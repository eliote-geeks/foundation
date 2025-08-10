import React from 'react';

interface ModernBadgeProps {
    variant: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
    children: React.ReactNode;
    animated?: boolean;
    glow?: boolean;
}

export function ModernBadge({ variant, children, animated = false, glow = false }: ModernBadgeProps) {
    const gradients = {
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        danger: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        info: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    };

    const glowColors = {
        success: 'rgba(79, 172, 254, 0.4)',
        warning: 'rgba(250, 112, 154, 0.4)',
        danger: 'rgba(255, 107, 107, 0.4)',
        info: 'rgba(67, 233, 123, 0.4)',
        primary: 'rgba(102, 126, 234, 0.4)',
        secondary: 'rgba(108, 117, 125, 0.4)'
    };

    return (
        <span
            className={`status-badge d-inline-flex align-items-center ${animated ? 'pulse' : ''}`}
            style={{
                background: gradients[variant],
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                padding: '6px 16px',
                borderRadius: '50px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                border: 'none',
                boxShadow: glow ? `0 4px 15px ${glowColors[variant]}` : '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {children}
        </span>
    );
}

export function StatusBadge({ status }: { status: 'open' | 'active' | 'closed' | 'upcoming' | 'ended' | 'closing-soon' }) {
    const statusConfig = {
        open: { variant: 'success' as const, label: 'Ouvert' },
        active: { variant: 'success' as const, label: 'Actif' },
        closed: { variant: 'danger' as const, label: 'Fermé' },
        upcoming: { variant: 'info' as const, label: 'À venir' },
        ended: { variant: 'secondary' as const, label: 'Terminé' },
        'closing-soon': { variant: 'warning' as const, label: 'Clôture bientôt' }
    };

    const config = statusConfig[status];

    return (
        <ModernBadge variant={config.variant} animated={status === 'active'} glow={status === 'closing-soon'}>
            {config.label}
        </ModernBadge>
    );
}