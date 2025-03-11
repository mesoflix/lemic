import React, { lazy, Suspense, useEffect, useCallback, useState } from 'react';
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
    const [selectedBot, setSelectedBot] = useState(null);

    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial', 'analysis_tool', 'free_bots', 'signals'];
    
    const GetHashedValue = useCallback((tab) => {
        let tab_value = location.hash?.split('#')[1];
        return tab_value ? Number(hash.indexOf(String(tab_value))) : tab;
    }, [location.hash]);
    
    const active_hash_tab = GetHashedValue(active_tab);

    useEffect(() => {
        setActiveTab(Number(active_hash_tab));
        navigate(`#${hash[active_hash_tab] || hash[0]}`);
    }, [active_hash_tab, setActiveTab, navigate]);

    const handleTabChange = useCallback((tab_index) => {
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
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 9L12 2L21 9V21H3V9Z' fill='black'/></svg> Dashboard</>} id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 2L19 8H5L12 2ZM12 11L19 17H5L12 11ZM12 20L5 14H19L12 20Z' fill='black'/></svg> Bot Builder</>} id='id-bot-builder' />
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 3V21H21V3H3ZM19 19H5V5H19V19ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H12V17H7V15Z' fill='black'/></svg> Charts</>} id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M4 4H20V20H4V4ZM6 6V18H18V6H6ZM9 9H15V11H9V9ZM9 13H15V15H9V13Z' fill='black'/></svg> Tutorials</>} id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={handleTabChange} />
                            </Suspense>
                        </div>
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 3H21V21H3V3ZM5 5V19H19V5H5ZM9 7H15V9H9V7ZM9 11H15V13H9V11ZM9 15H12V17H9V15Z' fill='black'/></svg> Analysis Tool</>} id='id-analysis-tool'>
                            <div className='analysis-tool-wrapper' style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                                <iframe
                                    src='https://binaryfx.site/x-bot'
                                    title='Analysis Tool'
                                    width='100%'
                                    height='100%'
                                    style={{ flexGrow: 1, border: 'none', overflow: 'auto' }}
                                />
                            </div>
                        </div>
                        <div label={<><svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 2L19 8H5L12 2ZM12 11L19 17H5L12 11ZM12 20L5 14H19L12 20Z' fill='black'/></svg> Signals</>} id='id-signals'>
                            <div className='signals-wrapper' style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                                <iframe
                                    src='https://binaryfx.site/signals'
                                    title='Signals Tool'
                                    width='100%'
                                    height='100%'
                                    style={{ flexGrow: 1, border: 'none', overflow: 'auto' }}
                                />
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
