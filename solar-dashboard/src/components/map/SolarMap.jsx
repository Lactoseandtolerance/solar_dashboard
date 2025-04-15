import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat'; // Heatmap plugin
import 'leaflet/dist/leaflet.css';

const SolarMap = ({ highContrast, data }) => {
  const mapStyle = highContrast ? { background: '#fff' } : {};
  const heatOptions = highContrast
    ? { radius: 25, blur: 15, max: 1000, gradient: { 0.4: 'yellow', 0.65: 'red', 1.0: 'white' } }
    : { radius: 25, blur: 15, max: 1000 };

  return (
    <MapContainer
      center={[33.7490, -84.3880]} // Atlanta, GA
      zoom={10}
      style={{ height: '400px', ...mapStyle }}
      ref={(map) => {
        if (map && data.length) {
          const points = data.map((point) => [point.lat, point.lng, point.irradiance]);
          L.heatLayer(points, heatOptions).addTo(map);
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default SolarMap;