import { ReactNode } from 'react';
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

export type TAccount = {
    balance: string;
    currency: string;
    icon: React.ReactNode;
    isActive: boolean;
    isEu: boolean;
    isVirtual: boolean;
    loginid: string;
    token: string;
    type: string;
};

export const platformsConfig: PlatformsConfig[] = [
    {
        active: true,
        buttonIcon: <Home size={25} />, 
        description: localize('Automated trading at your fingertips. No coding needed.'),
        href: 'https://bot.binarylab.site',
        icon: <Home size={32} />, 
        showInEU: false,
    },
    {
        active: true,
        buttonIcon: <FileText size={25} />, 
        description: localize('Trade with advanced tools and strategies.'),
        href: 'https://trade.binarylab.site',
        icon: <FileText size={32} />, 
        showInEU: true,
    },
    {
        active: true,
        buttonIcon: <DollarSign size={24} />, 
        description: localize('A user-friendly trading experience for all levels.'),
        href: 'https://smarttrader.binarylab.site',
        icon: <DollarSign size={32} />, 
        showInEU: false,
    },
];

export const TRADERS_HUB_LINK_CONFIG = {
    as: 'a',
    href: 'https://tradershub.binarylab.site',
    icon: <Home size={20} />, 
    label: "Trader's Hub",
};

export const MenuItems: MenuItemsConfig[] = [
    {
        as: 'a',
        href: 'https://reports.binarylab.site',
        icon: <FileText size={20} />, 
        label: localize('Reports'),
    },
    {
        as: 'a',
        href: 'https://cashier.binarylab.site',
        icon: <DollarSign size={20} />, 
        label: localize('Cashier'),
    },
    {
        as: 'a',
        href: 'https://t.me/binaryfx_site',
        icon: <ExternalIcon url="telegram.svg" alt="Telegram" size={20} />, 
    },
];
