import { useCallback, useRef, useState } from 'react';

export interface UploadedMedia {
    id: number;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    size_fmt: string;
    is_image: boolean;
    width?: number | null;
    height?: number | null;
}

interface FileItem {
    uid: string;
    file: File;
    preview?: string;
    progress: number;  // 0-100
    uploaded?: UploadedMedia;
    error?: string;
}

interface Props {
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMb?: number;
    onChange?: (media: UploadedMedia[]) => void;
    label?: string;
    hint?: string;
    className?: string;
}

function mimeIcon(mime: string): string {
    if (mime.startsWith('image/'))              return 'bi-file-image';
    if (mime === 'application/pdf')             return 'bi-file-earmark-pdf';
    if (mime.includes('word'))                  return 'bi-file-earmark-word';
    if (mime.includes('sheet') || mime.includes('excel')) return 'bi-file-earmark-excel';
    if (mime.startsWith('video/'))              return 'bi-file-play';
    return 'bi-file-earmark';
}

let uidCounter = 0;
const uid = () => `mu-${++uidCounter}-${Date.now()}`;

export function MediaUploader({
    accept = 'image/*,application/pdf',
    multiple = true,
    maxFiles = 10,
    maxSizeMb = 10,
    onChange,
    label = 'Glissez vos fichiers ici',
    hint,
    className = '',
}: Props) {
    const [items, setItems] = useState<FileItem[]>([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = useCallback(async (item: FileItem) => {
        const form = new FormData();
        form.append('file', item.file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/media/upload');

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
        xhr.setRequestHeader('X-CSRF-TOKEN', token);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 90);
                setItems(prev => prev.map(i => i.uid === item.uid ? { ...i, progress: pct } : i));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 201) {
                const uploaded: UploadedMedia = JSON.parse(xhr.responseText);
                setItems(prev => {
                    const next = prev.map(i => i.uid === item.uid
                        ? { ...i, progress: 100, uploaded }
                        : i
                    );
                    onChange?.(next.filter(i => i.uploaded).map(i => i.uploaded!));
                    return next;
                });
            } else {
                let msg = 'Erreur lors du téléversement';
                try { msg = JSON.parse(xhr.responseText)?.message ?? msg; } catch {}
                setItems(prev => prev.map(i => i.uid === item.uid ? { ...i, error: msg } : i));
            }
        };

        xhr.onerror = () => {
            setItems(prev => prev.map(i => i.uid === item.uid
                ? { ...i, error: 'Erreur réseau' }
                : i
            ));
        };

        xhr.send(form);
    }, [onChange]);

    const addFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const maxBytes = maxSizeMb * 1024 * 1024;
        const toAdd: FileItem[] = [];

        Array.from(files).forEach(file => {
            if (!multiple && items.length + toAdd.length >= 1) return;
            if (items.length + toAdd.length >= maxFiles) return;
            if (file.size > maxBytes) {
                toAdd.push({
                    uid: uid(), file,
                    progress: 0,
                    error: `Fichier trop volumineux (max ${maxSizeMb} MB)`,
                });
                return;
            }
            const preview = file.type.startsWith('image/')
                ? URL.createObjectURL(file)
                : undefined;
            toAdd.push({ uid: uid(), file, preview, progress: 0 });
        });

        setItems(prev => [...prev, ...toAdd]);
        toAdd.filter(i => !i.error).forEach(uploadFile);
    }, [items, maxFiles, maxSizeMb, multiple, uploadFile]);

    const remove = useCallback((uid: string) => {
        setItems(prev => {
            const item = prev.find(i => i.uid === uid);
            if (item?.preview) URL.revokeObjectURL(item.preview);
            const next = prev.filter(i => i.uid !== uid);
            onChange?.(next.filter(i => i.uploaded).map(i => i.uploaded!));
            return next;
        });
    }, [onChange]);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    return (
        <div className={className}>
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{
                    border: `2px dashed ${dragging ? 'var(--titi-green)' : 'var(--titi-border)'}`,
                    borderRadius: 12,
                    padding: '32px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragging ? 'rgba(95,161,69,0.06)' : 'var(--titi-surface)',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                }}
            >
                <i
                    className="bi bi-cloud-arrow-up"
                    style={{
                        fontSize: '2.5rem',
                        color: dragging ? 'var(--titi-green)' : 'var(--titi-muted)',
                        display: 'block',
                        marginBottom: 10,
                        transition: 'color 0.2s',
                    }}
                />
                <div style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4 }}>
                    {label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                    ou <span style={{ color: 'var(--titi-green)', textDecoration: 'underline' }}>cliquez pour sélectionner</span>
                </div>
                {hint && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--titi-muted)', marginTop: 6 }}>{hint}</div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    style={{ display: 'none' }}
                    onChange={e => addFiles(e.target.files)}
                    onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                />
            </div>

            {/* Preview grid */}
            {items.length > 0 && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 10,
                        marginTop: 14,
                    }}
                >
                    {items.map(item => (
                        <FileCard key={item.uid} item={item} onRemove={remove} />
                    ))}
                </div>
            )}
        </div>
    );
}

function FileCard({ item, onRemove }: { item: FileItem; onRemove: (uid: string) => void }) {
    const done = item.progress === 100 && item.uploaded;
    const error = !!item.error;

    return (
        <div
            style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                border: `1px solid ${error ? '#f87171' : done ? 'var(--titi-green)' : 'var(--titi-border)'}`,
                background: 'var(--titi-white)',
                transition: 'border-color 0.2s',
            }}
        >
            {/* Preview area */}
            <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--titi-surface)' }}>
                {item.preview ? (
                    <img
                        src={item.preview}
                        alt={item.file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <i
                        className={mimeIcon(item.file.type)}
                        style={{ fontSize: '2rem', color: error ? '#f87171' : 'var(--titi-sub)' }}
                    />
                )}
            </div>

            {/* Progress bar */}
            {!done && !error && item.progress > 0 && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'var(--titi-border)' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${item.progress}%`,
                            background: 'var(--titi-green)',
                            transition: 'width 0.2s ease',
                        }}
                    />
                </div>
            )}

            {/* Done checkmark */}
            {done && (
                <div style={{
                    position: 'absolute', top: 6, left: 6,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--titi-green)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <i className="bi bi-check" style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }} />
                </div>
            )}

            {/* Remove button */}
            <button
                type="button"
                onClick={() => onRemove(item.uid)}
                style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)', border: 'none',
                    color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', lineHeight: 1,
                }}
            >
                <i className="bi bi-x" />
            </button>

            {/* Filename + size */}
            <div style={{ padding: '4px 6px', background: 'var(--titi-white)' }}>
                <div style={{
                    fontSize: '0.68rem', color: 'var(--titi-text)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    fontWeight: 500,
                }}>
                    {item.file.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: error ? '#f87171' : 'var(--titi-muted)' }}>
                    {error ? item.error : item.uploaded?.size_fmt ?? formatBytes(item.file.size)}
                </div>
            </div>
        </div>
    );
}

function formatBytes(b: number): string {
    if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
    if (b >= 1024)    return Math.round(b / 1024) + ' KB';
    return b + ' B';
}
