import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props}
            src="/logo foundation.jpg" 
            alt="Logo Fondation"
            className={`rounded-lg shadow-sm ${props.className || ''}`}
            style={{ 
                objectFit: 'contain',
                backgroundColor: 'white',
                border: '1px solid rgba(255,255,255,0.1)'
            }}
        />
    );
}
