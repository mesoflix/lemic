import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import Tabs from '@/components/shared_ui/tabs/tabs';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { useDevice } from '@deriv-com/ui';
import RunPanel from '../../components/run-panel';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';
import { FaTimes, FaChartLine } from 'react-icons/fa';

const Chart = lazy(() => import('../chart'));
const Tutorial = lazy(() => import('../tutorials'));

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard } = useStore();
    const {
        active_tab,
        is_chart_modal_visible,
        is_trading_view_modal_visible,
        setActiveTab,
    } = dashboard;
    const { isDesktop } = useDevice();
    const location = useLocation();
    const navigate = useNavigate();

    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial', 'analysis_tool'];
    
    const GetHashedValue = useCallback((tab: number) => {
        let tab_value = location.hash?.split('#')[1];
        return tab_value ? Number(hash.indexOf(String(tab_value))) : tab;
    }, [location.hash]);
    
    const active_hash_tab = GetHashedValue(active_tab);

    useEffect(() => {
        setActiveTab(Number(active_hash_tab));
        navigate(`#${hash[active_hash_tab] || hash[0]}`);
    }, [active_hash_tab, setActiveTab, navigate]);

    const handleTabChange = useCallback((tab_index: number) => {
        setActiveTab(tab_index);
        navigate(`#${hash[tab_index] || hash[0]}`);
    }, [setActiveTab, navigate]);

    return (
        <React.Fragment>
            <div className='main'>
                <div className={classNames('main__container')}>
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div label='Dashboard' id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div label='Bot Builder' id='id-bot-builder' />
                        <div label='Charts' id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label='Tutorials' id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={handleTabChange} />
                            </Suspense>
                        </div>

                        {/* New Analysis Tool Tab as Fullscreen Draggable Popup */}
                        <div label='Analysis Tool' id='id-analysis-tool'>
                            <div id='draggable_resize_container' className='draggable_resize_container'>
                                <div className='draggable' data-testid='dt_react_draggable'>
                                    <div className='draggable-content' style={{ width: '100vw', height: '100vh' }}>
                                        <div className='draggable-content__header'>
                                            <div className='draggable-content__header__title'>
                                                <FaChartLine style={{ marginRight: '8px' }} /> Analysis Tool
                                            </div>
                                            <div className='draggable-content__header__close' data-testid='dt_react_draggable-close-modal'>
                                                <FaTimes style={{ cursor: 'pointer' }} />
                                            </div>
                                        </div>
                                        <div className='draggable-content__body'>
                                            <iframe
                                                id='analysis-tool-iframe'
                                                src='https://your-analysis-tool-url.com'
                                                title='Analysis Tool'
                                                style={{ width: '100%', height: '100%', border: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className='main__run-strategy-wrapper'>
                <RunStrategy />
                <RunPanel />
            </div>
            <ChartModal />
            <TradingViewModal />
        </React.Fragment>
    );
});

export default AppWrapper;
