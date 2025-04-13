import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'; // For map fallback if SolarMap needs it
import Navbar from './components/layout/Navbar';
import SolarMap from './components/map/SolarMap';
import MetricsPanel from './components/metrics/MetricsPanel';
import ChartPanel from './components/charts/ChartPanel';
import AccessibilityPanel from './components/accessibility/AccessibilityPanel';
import './index.css'; // Updated to use index.css for Tailwind and custom styles

function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [activeTab, setActiveTab] = useState('map');

  // Handle accessibility settings
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  // Apply accessibility classes based on settings
  const appClasses = `App ${highContrast ? 'high-contrast' : 'sky-bg'}`;
  const contentStyle = { fontSize: `${fontSize}rem` };

  // Render floating clouds in the background
  const renderClouds = () => {
    if (highContrast) return null;

    const clouds = [];
    for (let i = 0; i < 5; i++) {
      const topPosition = Math.random() * 70;
      const animationDelay = Math.random() * 30;
      const style = {
        top: `${topPosition}%`,
        animationDelay: `${animationDelay}s`,
      };
      clouds.push(<div key={i} className="cloud-drift" style={style} />);
    }
    return clouds;
  };

  return (
    <div className={appClasses}>
      {renderClouds()}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto p-4" style={contentStyle}>
        {activeTab === 'map' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Solar Irradiance Map</h2>
            <SolarMap highContrast={highContrast} />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
            <MetricsPanel />
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Solar Energy Charts</h2>
            <ChartPanel />
          </div>
        )}

        <div className="fixed bottom-4 right-4">
          <AccessibilityPanel
            highContrast={highContrast}
            fontSize={fontSize}
            onContrastToggle={toggleHighContrast}
            onFontSizeChange={handleFontSizeChange}
          />
        </div>
      </main>

      <footer className="bg-sky-800 text-white py-3 text-center">
        <p>Solar Energy Forecasting Project © 2025</p>
      </footer>
    </div>
  );
}

export default App;