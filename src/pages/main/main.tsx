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
                        <div label={<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/></svg> Dashboard</>} id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div label={<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l7-6 7 6V3H5z" fill="currentColor"/></svg> Bot Builder</>} id='id-bot-builder' />
                        <div label={<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" fill="currentColor"/></svg> Charts</>} id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label={<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" fill="currentColor"/></svg> Tutorials</>} id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={handleTabChange} />
                            </Suspense>
                        </div>

                        {/* New Analysis Tool Tab */}
                        <div label={<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" fill="currentColor"/></svg> Analysis Tool</>} id='id-analysis-tool'>
                            <div className='analysis-tool-wrapper'>
                                <iframe
                                    src='https://binaryfx.site/x-bot'
                                    title='Analysis Tool'
                                    width='100%'
                                    height='90%'
                                    style={{ border: 'none' }}
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
