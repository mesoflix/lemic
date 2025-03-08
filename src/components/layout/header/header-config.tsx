import { ReactNode } from 'react';
import { standalone_routes } from '@/components/shared';
import {
    LegacyCashierIcon as CashierLogo,
    LegacyHomeNewIcon as TradershubLogo,
    LegacyReportsIcon as ReportsLogo,
} from '@deriv/quill-icons/Legacy';
import {
    DerivProductBrandLightDerivBotLogoWordmarkIcon as DerivBotLogo,
    DerivProductBrandLightDerivTraderLogoWordmarkIcon as DerivTraderLogo,
    PartnersProductBrandLightSmarttraderLogoWordmarkIcon as SmarttraderLogo,
} from '@deriv/quill-icons/Logo';
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
        buttonIcon: <DerivBotLogo height={25} width={94} />,
        description: localize('Automated trading at your fingertips. No coding needed.'),
        href: 'https://bot.binaryfx.site',
        icon: <DerivBotLogo height={32} width={121} />,
        showInEU: false,
    },
    {
        active: true,
        buttonIcon: <DerivTraderLogo height={25} width={114.97} />,
        description: localize('Trade with advanced tools and strategies.'),
        href: 'https://trade.binaryfx.site',
        icon: <DerivTraderLogo height={32} width={148} />,
        showInEU: true,
    },
    {
        active: true,
        buttonIcon: <SmarttraderLogo height={24} width={115} />,
        description: localize('A user-friendly trading experience for all levels.'),
        href: 'https://smarttrader.binaryfx.site',
        icon: <SmarttraderLogo height={32} width={153} />,
        showInEU: false,
    },
];

export const TRADERS_HUB_LINK_CONFIG = {
    as: 'a',
    href: 'https://tradershub.binaryfx.site',
    icon: <TradershubLogo iconSize='xs' />,
    label: "Trader's Hub",
};

export const MenuItems: MenuItemsConfig[] = [
    {
        as: 'a',
        href: 'https://reports.binaryfx.site',
        icon: <ReportsLogo iconSize='xs' />,
        label: localize('Reports'),
    },
    {
        as: 'a',
        href: 'https://cashier.binaryfx.site',
        icon: <CashierLogo iconSize='xs' />,
        label: localize('Cashier'),
    },
    {
        as: 'a',
        href: 'https://t.me/binaryfx_site',
        icon: <CashierLogo iconSize='xs' />, // Change to a relevant Telegram icon
        label: localize('Join our Telegram'),
    },
];
