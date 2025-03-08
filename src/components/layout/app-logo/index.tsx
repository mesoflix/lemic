import { useDevice } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = () => {
    const { isDesktop } = useDevice();

    return isDesktop ? (
        <a href="https://bot.binarylab.site" target="_blank" rel="noopener noreferrer">
            <img src="/logo.png" alt="Your Logo" className="app-header__logo" />
        </a>
    ) : null;
};
