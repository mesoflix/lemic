import { ReactNode, useEffect, useState } from 'react';
import { standalone_routes } from '@/components/shared';
import { localize } from '@deriv-com/translations';

export type PlatformsConfig = {
    active: boolean;
    buttonIcon: ReactNode;
    description: string;
    href: string;
    icon: ReactNode;
    showInEU: boolean;
};

export type MenuItemsConfig = {
    as: 'a' | 'button';
    href: string;
    icon: ReactNode;
    label: string;
};

// Function to load an external image
const ExternalIcon = ({ url, alt, size }: { url: string; alt: string; size: number }) => {
    const [iconSrc, setIconSrc] = useState<string | null>(null);

    useEffect(() => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => setIconSrc(URL.createObjectURL(blob)))
            .catch(() => setIconSrc(null));
    }, [url]);

    return iconSrc ? <img src={iconSrc} alt={alt} width={size} height={size} /> : <span>🔄</span>;
};

export const platformsConfig: PlatformsConfig[] = [
    {
        active: true,
        buttonIcon: <ExternalIcon url="/home.svg" alt="Bot Logo" size={25} />,
        description: localize('Automated trading at your fingertips. No coding needed.'),
        href: 'https://bot.binaryfx.site',
        icon: <ExternalIcon url="
                  /home.svg" alt="Bot Logo" size={32} />,
        showInEU: false,
    },
    {
        active: true,
        buttonIcon: <ExternalIcon url="/trade.svg" alt="Trade Logo" size={25} />,
        description: localize('Trade with advanced tools and strategies.'),
        href: 'https://trade.binaryfx.site',
        icon: <ExternalIcon url="/trade.svg" alt="Trade Logo" size={32} />,
        showInEU: true,
    },
];

export const TRADERS_HUB_LINK_CONFIG = {
    as: 'a',
    href: 'https://tradershub.binaryfx.site',
    icon: <ExternalIcon url="/home.svg" alt="Trader's Hub" size={20} />,
    label: "Trader's Hub",
};

export const MenuItems: MenuItemsConfig[] = [
    {
        as: 'a',
        href: 'https://t.me/binaryfx_site',
        icon: <ExternalIcon url="/telegram.svg" alt="Telegram" size={20} />,
    },
];
