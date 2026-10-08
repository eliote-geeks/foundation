#!/usr/bin/env sh
set -eu

backup_root="${BACKUP_ROOT:-/var/backups/foundation-titi}"
retention_days="${BACKUP_RETENTION_DAYS:-14}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive="$backup_root/foundation-titi-storage-$timestamp.tar.gz"

mkdir -p "$backup_root"
chmod 0700 "$backup_root"

volume_name="$(docker inspect foundation-titi-app --format '{{range .Mounts}}{{if eq .Destination "/var/www/html/storage"}}{{.Name}}{{end}}{{end}}')"

if [ -z "$volume_name" ]; then
    echo "Volume de stockage introuvable" >&2
    exit 1
fi

docker compose stop app
trap 'docker compose start app >/dev/null 2>&1 || true' EXIT INT TERM

docker run --rm \
    -v "$volume_name:/data:ro" \
    -v "$backup_root:/backup" \
    alpine:3.22 \
    tar -C /data -czf "/backup/$(basename "$archive")" .

chmod 0600 "$archive"
docker compose start app
trap - EXIT INT TERM

find "$backup_root" -type f -name 'foundation-titi-storage-*.tar.gz' -mtime "+$retention_days" -delete
echo "$archive"
