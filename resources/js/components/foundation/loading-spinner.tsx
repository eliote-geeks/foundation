import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'white';
    text?: string;
}

export function LoadingSpinner({ size = 'md', variant = 'primary', text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'width: 24px; height: 24px; border-width: 2px;',
        md: 'width: 40px; height: 40px; border-width: 4px;',
        lg: 'width: 60px; height: 60px; border-width: 6px;'
    };

    const colors = {
        primary: { border: 'rgba(102, 126, 234, 0.3)', top: '#667eea' },
        secondary: { border: 'rgba(108, 117, 125, 0.3)', top: '#6c757d' },
        white: { border: 'rgba(255, 255, 255, 0.3)', top: '#ffffff' }
    };

    return (
        <div className="d-flex flex-column align-items-center gap-3">
            <div
                className="loading-spinner rounded-circle"
                style={{
                    ...sizeClasses[size],
                    border: `${colors[variant].border}`,
                    borderTop: `${colors[variant].top}`,
                    animation: 'spin 1s linear infinite'
                } as any}
            />
            {text && (
                <p className={`text-${variant === 'white' ? 'white' : 'muted'} mb-0 small`}>
                    {text}
                </p>
            )}
        </div>
    );
}

export function PageLoader() {
    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999
            }}
        >
            <div className="text-center">
                <LoadingSpinner size="lg" text="Chargement..." />
                <div className="mt-4">
                    <h5 style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Fondation Titi
                    </h5>
                </div>
            </div>
        </div>
    );
}

export function ButtonLoader({ children, loading = false, ...props }: any) {
    return (
        <button {...props} disabled={loading || props.disabled}>
            {loading ? (
                <div className="d-flex align-items-center gap-2">
                    <LoadingSpinner size="sm" variant="white" />
                    Chargement...
                </div>
            ) : (
                children
            )}
        </button>
    );
}