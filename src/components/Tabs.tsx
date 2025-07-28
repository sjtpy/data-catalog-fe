import React from 'react';

interface TabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'events', label: 'Events' },
        { id: 'properties', label: 'Properties' },
        { id: 'tracking-plans', label: 'Tracking Plans' },
    ];

    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;