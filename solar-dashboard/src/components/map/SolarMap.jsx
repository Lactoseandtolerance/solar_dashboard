import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

function HeatmapLayer({ data }) {
  const map = useMap();
  React.useEffect(() => {
    if (!data || !data.length) return;

    const points = data.map(point => [
      point.lat,
      point.lng,
      point.irradiance / 100
    ]);

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.5,
      gradient: { 0: 'blue', 0.5: 'purple', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data]);

  return null;
}

function MarkerClusterLayer({ data }) {
  const map = useMap();
  React.useEffect(() => {
    if (!data || !data.length) return;

    const markers = L.markerClusterGroup({
      maxClusterRadius: 40,
      disableClusteringAtZoom: 10
    });

    data.forEach(point => {
      const marker = L.marker([point.lat, point.lng]);
      marker.bindPopup(`Irradiance: ${point.irradiance} W/m²`);
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [map, data]);

  return null;
}

function SolarMap({ mapData, highContrast }) {
  return (
    <div style={{ height: '600px', width: '100%', background: highContrast ? '#000' : '#fff' }}>
      <MapContainer
        center={[37.0902, -95.7129]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={
            highContrast
              ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer data={mapData} />
        <MarkerClusterLayer data={mapData} />
      </MapContainer>
    </div>
  );
}

SolarMap.propTypes = {
  mapData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      irradiance: PropTypes.number,
    })
  ).isRequired,
  highContrast: PropTypes.bool,
};

HeatmapLayer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      irradiance: PropTypes.number,
    })
  ).isRequired,
};

MarkerClusterLayer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      irradiance: PropTypes.number,
    })
  ).isRequired,
};

export default SolarMap;