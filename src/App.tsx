import React, { useState } from 'react';
import Tabs from './components/Tabs';
import Events from './components/Events';
import Properties from './components/Properties';
import TrackingPlans from './components/TrackingPlans';

function App() {
  const [activeTab, setActiveTab] = useState('events');

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <Events />;
      case 'properties':
        return <Properties />;
      case 'tracking-plans':
        return <TrackingPlans />;
      default:
        return <Events />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Catalog</h1>
      </header>
      <main>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
