import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import mockIrradiance from '../../data/mock-irradiance.json';

// Import county data - in production would be loaded via API
// For the demo we'll handle this file as a stub import
const countyData = { type: "FeatureCollection", features: [] };
// In practice, you would use: import countyData from '../../data/us-counties-simplified.json';

// Component to handle keyboard navigation
const KeyboardNavigation = ({ onCountySelect }) => {
  const map = useMap();
  const selectedCountyRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCountyRef.current) return;
      
      // Handle arrow keys
      switch(e.key) {
        case 'ArrowUp':
          map.panBy([0, -50]);
          break;
        case 'ArrowDown':
          map.panBy([0, 50]);
          break;
        case 'ArrowLeft':
          map.panBy([-50, 0]);
          break;
        case 'ArrowRight':
          map.panBy([50, 0]);
          break;
        case 'Enter':
          if (selectedCountyRef.current) {
            onCountySelect(selectedCountyRef.current);
          }
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [map, onCountySelect]);
  
  return null;
};

// Map Legend Component
const MapLegend = ({ highContrast }) => {
  const legendItems = [
    { label: 'High (6-7 kWh/m²)', color: highContrast ? '#fff' : '#ff0000' },
    { label: 'Medium-High (5-6 kWh/m²)', color: highContrast ? '#ccc' : '#ffa500' },
    { label: 'Medium (4-5 kWh/m²)', color: highContrast ? '#999' : '#ffff00' },
    { label: 'Low (3-4 kWh/m²)', color: highContrast ? '#666' : '#00ff00' },
    { label: 'Very Low (0-3 kWh/m²)', color: highContrast ? '#333' : '#0000ff' }
  ];
  
  return (
    <div className="map-legend" role="region" aria-label="Map legend">
      <div className="font-bold mb-2">Solar Irradiance</div>
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <div 
            className="legend-color" 
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          ></div>
          <div>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const SolarMap = ({ highContrast }) => {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyDetails, setCountyDetails] = useState(null);
  
  // Get color based on irradiance value
  const getColor = (value) => {
    if (highContrast) {
      // High contrast color scheme
      if (value > 6) return '#fff';
      if (value > 5) return '#ccc';
      if (value > 4) return '#999';
      if (value > 3) return '#666';
      return '#333';
    } else {
      // Regular color scheme (color-blind friendly)
      if (value > 6) return '#ff0000'; // Red
      if (value > 5) return '#ffa500'; // Orange
      if (value > 4) return '#ffff00'; // Yellow
      if (value > 3) return '#00ff00'; // Green
      return '#0000ff'; // Blue
    }
  };

  // Style each county based on its irradiance value
  const styleFeature = useMemo(() => {
    return (feature) => {
      const fips = feature.properties?.GEOID || '';
      const irradiance = mockIrradiance[fips] || 0;
      
      return {
        fillColor: getColor(irradiance),
        weight: selectedCounty === fips ? 3 : 1,
        opacity: 1,
        color: highContrast ? 'white' : 'gray',
        dashArray: '',
        fillOpacity: 0.7
      };
    };
  }, [selectedCounty, highContrast]);

  // Handle interactions with each county
  const onEachFeature = (feature, layer) => {
    const fips = feature.properties?.GEOID || '';
    const countyName = feature.properties?.NAME || 'Unknown County';
    const stateName = feature.properties?.STATE_NAME || 'Unknown State';
    const irradiance = mockIrradiance[fips] || 'N/A';
    
    // Tooltip and popup content
    const popupContent = `
      <strong>${countyName}, ${stateName}</strong><br/>
      Solar Irradiance: ${irradiance} kWh/m²
    `;
    
    layer.bindTooltip(popupContent);
    
    // Event handlers
    layer.on({
      mouseover: () => {
        layer.setStyle({
          weight: 3,
          color: highContrast ? '#fff' : '#333',
        });
        
        // Announce to screen readers
        const announcement = document.getElementById('map-announcement');
        if (announcement) {
          announcement.textContent = `${countyName}, ${stateName}: ${irradiance} kilowatt-hours per square meter`;
        }
      },
      mouseout: () => {
        if (selectedCounty !== fips) {
          layer.setStyle({
            weight: 1,
            color: highContrast ? 'white' : 'gray',
          });
        }
      },
      click: () => {
        setSelectedCounty(fips);
        
        // Populate county details for modal
        setCountyDetails({
          name: countyName,
          state: stateName,
          irradiance: irradiance,
          fips: fips
        });
        
        // Announce selection to screen readers
        const announcement = document.getElementById('map-announcement');
        if (announcement) {
          announcement.textContent = `Selected ${countyName}, ${stateName}. Solar irradiance: ${irradiance} kilowatt-hours per square meter.`;
        }
      }
    });
  };

  // Close the county details modal
  const closeDetails = () => {
    setCountyDetails(null);
  };

  return (
    <div className="relative">
      {/* Screen reader announcement area */}
      <div 
        id="map-announcement" 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      ></div>
      
      <div 
        className="w-full rounded-lg shadow-lg overflow-hidden" 
        style={{ height: '500px' }}
        role="region" 
        aria-label="Solar irradiance map by county"
      >
        <MapContainer 
          center={[39.8283, -98.5795]} 
          zoom={4} 
          style={{ height: '100%', width: '100%' }}
          // These attributes help screen readers but aren't in react-leaflet props
          aria-label="Map of United States counties showing solar irradiance levels"
        >
          <TileLayer
            url={highContrast 
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* When we have real data, render the GeoJSON layer */}
          {countyData.features.length > 0 && (
            <GeoJSON 
              data={countyData}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}
          
          <KeyboardNavigation onCountySelect={setCountyDetails} />
          <MapLegend highContrast={highContrast} />
        </MapContainer>
      </div>
      
      {/* County Details Modal */}
      {countyDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`rounded-lg p-6 max-w-md w-full ${highContrast ? 'bg-black text-white border-2 border-white' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">{countyDetails.name}, {countyDetails.state}</h3>
            
            <div className="mb-4">
              <p className="text-lg">Solar Irradiance: <span className="font-bold">{countyDetails.irradiance} kWh/m²</span></p>
              <p>FIPS Code: {countyDetails.fips}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold">Monthly Average Irradiance</h4>
              <ul>
                <li>January: {(countyDetails.irradiance * 0.6).toFixed(1)} kWh/m²</li>
                <li>April: {(countyDetails.irradiance * 0.9).toFixed(1)} kWh/m²</li>
                <li>July: {(countyDetails.irradiance * 1.3).toFixed(1)} kWh/m²</li>
                <li>October: {(countyDetails.irradiance * 0.85).toFixed(1)} kWh/m²</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="cloud-button"
                onClick={closeDetails}
                aria-label="Close details"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Message for demo - in real implementation we'd load actual data */}
      <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
        <p className="font-bold">Demo Note:</p>
        <p>This is a representation of the map component. In a real implementation, county GeoJSON data would be loaded via API. The actual map would show county boundaries colored by solar irradiance levels.</p>
      </div>
    </div>
  );
};

export default SolarMap;