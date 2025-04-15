import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import fetch from 'node-fetch';
import Navbar from './components/layout/Navbar';
import SolarMap from './components/map/SolarMap';
import MetricsPanel from './components/metrics/MetricsPanel';
import ChartPanel from './components/charts/ChartPanel';
import AccessibilityPanel from './components/accessibility/AccessibilityPanel';
import './index.css';

function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [activeTab, setActiveTab] = useState('map');
  const [solarData, setSolarData] = useState({
    mapData: [],
    metrics: {},
    chartData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('totalEnergy');

  // Fetch data from Azure Functions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://solar-dashboard-functions.azurewebsites.net/api/GetSolarData');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSolarData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch solar data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 600000); // Refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  // Handle accessibility settings
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const handleFontSizeChange = (newSize) => setFontSize(newSize);

  // Apply accessibility classes
  const appClasses = `App ${highContrast ? 'high-contrast' : 'sky-bg'}`;
  const contentStyle = { fontSize: `${fontSize}rem` };

  // Render floating clouds
  const renderClouds = () => {
    if (highContrast) return null;
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      const topPosition = Math.random() * 70;
      const animationDelay = Math.random() * 30;
      const style = { top: `${topPosition}%`, animationDelay: `${animationDelay}s` };
      clouds.push(<div key={i} className="cloud-drift" style={style} />);
    }
    return clouds;
  };

  return (
    <div className={appClasses}>
      {renderClouds()}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto p-4" style={contentStyle}>
        {loading && <p className="text-center animate-pulse">Loading data...</p>}
        {error && (
          <div className="text-center text-red-500 mb-4">
            <p>{error}</p>
            <button
              className="cloud-button mt-2"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
            >
              Retry
            </button>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Solar Irradiance Map</h2>
            <SolarMap highContrast={highContrast} data={solarData.mapData} />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
            <div className="flex space-x-4 mb-4">
              <button
                className={`cloud-button ${activeMetric === 'totalEnergy' ? 'bg-sky-600 text-white' : ''}`}
                onClick={() => setActiveMetric('totalEnergy')}
              >
                Total Energy
              </button>
              <button
                className={`cloud-button ${activeMetric === 'avgIrradiance' ? 'bg-sky-600 text-white' : ''}`}
                onClick={() => setActiveMetric('avgIrradiance')}
              >
                Avg Irradiance
              </button>
            </div>
            <MetricsPanel data={solarData.metrics} activeMetric={activeMetric} />
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Solar Energy Charts</h2>
            <ChartPanel data={solarData.chartData} highContrast={highContrast} />
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