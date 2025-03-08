import React, { lazy, Suspense, useEffect, useState } from 'react';
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
import Dialog from '@/components/shared_ui/dialog';
import Draggable from 'react-draggable';

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
    const [isAnalysisToolOpen, setAnalysisToolOpen] = useState(false);

    const handleOpenAnalysisTool = () => setAnalysisToolOpen(true);
    const handleCloseAnalysisTool = () => setAnalysisToolOpen(false);

    return (
        <React.Fragment>
            <div className='main'>
                <div className={classNames('main__container')}>
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemClick={setActiveTab}
                        top
                    >
                        <div label='Dashboard' id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={setActiveTab} />
                        </div>
                        <div label='Bot Builder' id='id-bot-builder' />
                        <div label='Charts' id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label='Tutorials' id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={setActiveTab} />
                            </Suspense>
                        </div>
                        <div label='Analysis Tool' id='id-analysis-tool'>
                            <button className='open-analysis-tool-btn' onClick={handleOpenAnalysisTool}>
                                Open Analysis Tool
                            </button>
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
            
            {/* Analysis Tool Popup */}
            {isAnalysisToolOpen && (
                <Draggable handle='.drag-handle'>
                    <div className='analysis-tool-popup' style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'white', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <div className='drag-handle' style={{ cursor: 'move', padding: '10px', background: '#ddd', textAlign: 'right' }}>
                            <button onClick={handleCloseAnalysisTool} style={{ border: 'none', background: 'transparent', fontSize: '16px' }}>✖</button>
                        </div>
                        <iframe
                            src='https://your-analysis-tool-url.com'
                            title='Analysis Tool'
                            width='100%'
                            height='100%'
                            style={{ border: 'none' }}
                        />
                    </div>
                </Draggable>
            )}
        </React.Fragment>
    );
});

export default AppWrapper;
