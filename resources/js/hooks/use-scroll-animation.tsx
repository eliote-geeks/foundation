import { useEffect, useState, useRef } from 'react';

export function useScrollAnimation(threshold = 0.1) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return { ref, isVisible };
}

export function useCountUp(end: number, duration = 2000, startOnVisible = true) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(!startOnVisible);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            setCount(Math.floor(progress * end));
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }, [end, duration, hasStarted]);

    const start = () => setHasStarted(true);

    return { count, start, hasStarted };
}

export function ScrollAnimatedSection({ 
    children, 
    animation = 'fadeInUp',
    delay = 0,
    className = ''
}: {
    children: React.ReactNode;
    animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn';
    delay?: number;
    className?: string;
}) {
    const { ref, isVisible } = useScrollAnimation();

    const animationClasses = {
        fadeInUp: 'fade-in',
        fadeInLeft: 'slide-in-left',
        fadeInRight: 'slide-in-right',
        fadeIn: 'fade-in',
        scaleIn: 'modern-card'
    };

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
            style={{
                animationDelay: `${delay}ms`,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out'
            }}
        >
            {children}
        </div>
    );
}

export function AnimatedCounter({ 
    end, 
    suffix = '', 
    prefix = '',
    duration = 2000,
    className = 'stats-counter'
}: {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}) {
    const { ref, isVisible } = useScrollAnimation();
    const { count, start } = useCountUp(end, duration, false);

    useEffect(() => {
        if (isVisible) {
            start();
        }
    }, [isVisible, start]);

    return (
        <div ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
}