import '../css/vendor.css';
import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useEffect, useRef } from 'react';
import { initializeTheme } from './hooks/use-appearance';
import './lib/i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function TransitionWrapper({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (el) el.classList.add('page-entering');

        const offStart = router.on('start', () => {
            const el = ref.current;
            if (!el) return;
            el.classList.remove('page-entering');
            el.classList.add('page-exiting');
        });

        const offNavigate = router.on('navigate', () => {
            const el = ref.current;
            if (!el) return;
            el.classList.remove('page-exiting');
            void el.offsetWidth; // force reflow → restart animation
            el.classList.add('page-entering');
        });

        return () => { offStart(); offNavigate(); };
    }, []);

    return (
        <div id="page-transition-wrapper" ref={ref}>
            {children}
        </div>
    );
}

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <TransitionWrapper>
                <App {...props} />
            </TransitionWrapper>
        );
    },
    progress: {
        color: '#5FA145',
    },
});

// This will set light / dark mode on load...
initializeTheme();
