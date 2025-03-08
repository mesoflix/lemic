import React, { useState } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import Tabs from '@/components/shared_ui/tabs/tabs';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import Dashboard from '../dashboard';

const AppWrapper = observer(() => {
    const { dashboard } = useStore();
    const { active_tab, setActiveTab } = dashboard;
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    const toggleAnalysisTool = () => {
        setIsAnalysisOpen(!isAnalysisOpen);
    };

    return (
        <div className='main'>
            <div className='main__container'>
                <Tabs active_index={active_tab} onTabItemClick={setActiveTab} className='main__tabs' top>
                    <div
                        label={<span>Dashboard</span>}
                        id='id-dbot-dashboard'
                    >
                        <Dashboard />
                    </div>
                    <div
                        label={<span>Analysis Tool</span>}
                        id='id-analysis-tool'
                    >
                        <button onClick={toggleAnalysisTool} className='analysis-tool-btn'>Open Analysis Tool</button>
                    </div>
                </Tabs>
            </div>
            {isAnalysisOpen && (
                <Draggable>
                    <div id='draggable_resize_container' className='draggable'>
                        <div className='draggable-content'>
                            <div className='draggable-content__header'>
                                <span>Analysis Tool</span>
                                <button onClick={toggleAnalysisTool} className='draggable-content__header__close'>X</button>
                            </div>
                            <div className='draggable-content__body'>
                                <iframe
                                    id='trading-view-iframe'
                                    src='https://charts.deriv.com/deriv?hide-signup=true'
                                    style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                    </div>
                </Draggable>
            )}
        </div>
    );
});

export default AppWrapper;
