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

    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial', 'analysis_tool', 'free_bots'];
    
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

    const loadBotFile = (botName) => {
        const botUrl = `/bots/${botName}.xml`; // Assuming bot files are stored under /bots
        fetch(botUrl)
            .then(response => response.text())
            .then(data => {
                console.log(`Loaded bot: ${botName}`, data);
                // You can process and load the bot file data here
            })
            .catch(error => console.error(`Error loading bot ${botName}:`, error));
    };

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
                        <div label={<><svg width='16' height='16'><circle cx='8' cy='8' r='6' fill='black' /></svg> Dashboard</>} id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div label={<><svg width='16' height='16'><rect width='12' height='12' x='2' y='2' fill='black' /></svg> Bot Builder</>} id='id-bot-builder' />
                        <div label={<><svg width='16' height='16'><path d='M2 14 L8 2 L14 14 Z' fill='black' /></svg> Charts</>} id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label={<><svg width='16' height='16'><line x1='2' y1='8' x2='14' y2='8' stroke='black' strokeWidth='2' /></svg> Tutorials</>} id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={handleTabChange} />
                            </Suspense>
                        </div>

                        {/* New Analysis Tool Tab */}
                        <div label={<><svg width='16' height='16'><rect width='12' height='12' x='2' y='2' fill='black' /></svg> Analysis Tool</>} id='id-analysis-tool'>
                            <div className='analysis-tool-wrapper' style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                                <iframe
                                    src='https://your-analysis-tool-url.com'
                                    title='Analysis Tool'
                                    width='100%'
                                    height='100%'
                                    style={{ flexGrow: 1, border: 'none', overflow: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* New Free Bots Tab */}
                        <div label={<><svg width='16' height='16'><polygon points='2,2 14,2 8,14' fill='black' /></svg> Free Bots</>} id='id-free-bots'>
                            <div className='free-bots-wrapper' style={{ padding: '20px', textAlign: 'center' }}>
                                <h2 style={{ marginBottom: '10px' }}>Free Bots</h2>
                                <p style={{ marginBottom: '20px' }}>Browse and download free bot files here.</p>
                                <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                    {['bot_strategy_1', 'bot_strategy_2', 'bot_strategy_3', 'bot_strategy_4', 'bot_strategy_5'].map((bot, index) => (
                                        <li key={index} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9', cursor: 'pointer' }} onClick={() => { setSelectedBot(bot); loadBotFile(bot); }}>
                                            📂 {bot.replace(/_/g, ' ').toUpperCase()}
                                        </li>
                                    ))}
                                </ul>
                                {selectedBot && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Loading {selectedBot.replace(/_/g, ' ').toUpperCase()}...</p>}
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
