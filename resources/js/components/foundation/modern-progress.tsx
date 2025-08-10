import React from 'react';

interface ModernProgressProps {
    value: number;
    max?: number;
    variant?: 'primary' | 'success' | 'warning' | 'info';
    animated?: boolean;
    showLabel?: boolean;
    height?: number;
}

export function ModernProgress({ 
    value, 
    max = 100, 
    variant = 'primary', 
    animated = true,
    showLabel = false,
    height = 8 
}: ModernProgressProps) {
    const percentage = Math.min((value / max) * 100, 100);
    
    const gradients = {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        info: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };

    return (
        <div className="mb-2">
            {showLabel && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">Progression</span>
                    <span className="small fw-bold">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div 
                className="modern-progress position-relative overflow-hidden"
                style={{ 
                    height: `${height}px`,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '50px'
                }}
            >
                <div
                    className="modern-progress-bar h-100 position-relative"
                    style={{
                        width: `${percentage}%`,
                        background: gradients[variant],
                        borderRadius: '50px',
                        transition: 'width 1s ease-out',
                        overflow: 'hidden'
                    }}
                >
                    {animated && (
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                animation: 'progressShine 1.5s ease-in-out infinite'
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'primary' | 'success' | 'warning' | 'info';
    showLabel?: boolean;
    children?: React.ReactNode;
}

export function CircularProgress({ 
    value, 
    max = 100, 
    size = 120,
    strokeWidth = 8,
    variant = 'primary',
    showLabel = true,
    children 
}: CircularProgressProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colors = {
        primary: '#667eea',
        success: '#4facfe',
        warning: '#fa709a',
        info: '#43e97b'
    };

    return (
        <div className="position-relative d-inline-flex align-items-center justify-content-center">
            <svg
                width={size}
                height={size}
                className="transform-rotate-neg-90"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(0, 0, 0, 0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors[variant]}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 1s ease-out',
                        filter: 'drop-shadow(0 0 6px rgba(102, 126, 234, 0.3))'
                    }}
                />
            </svg>
            
            {/* Center content */}
            <div className="position-absolute d-flex flex-column align-items-center justify-content-center text-center">
                {children || (showLabel && (
                    <>
                        <div className="h4 mb-0 fw-bold" style={{ color: colors[variant] }}>
                            {percentage.toFixed(0)}%
                        </div>
                        <small className="text-muted">Complété</small>
                    </>
                ))}
            </div>
        </div>
    );
}