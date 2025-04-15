import React from 'react';
import PropTypes from 'prop-types';
import './MetricsPanel.css';

const MetricsPanel = ({ data, activeMetric }) => {
  const metrics = {
    totalEnergy: { label: 'Total Energy', value: data.totalEnergy ? `${data.totalEnergy.toFixed(2)} kWh` : 'N/A' },
    avgIrradiance: { label: 'Avg Irradiance', value: data.avgIrradiance ? `${data.avgIrradiance.toFixed(2)} W/m²` : 'N/A' },
    temperature: { label: 'Temperature', value: data.temperature ? `${data.temperature.toFixed(2)} °C` : 'N/A' },
  };

  const selectedMetric = metrics[activeMetric] || metrics.totalEnergy;

  return (
    <div className='metrics-panel' role='region' aria-label='Solar metrics'>
      <h3>{selectedMetric.label}</h3>
      <p className='text-4xl font-bold'>{selectedMetric.value}</p>
    </div>
  );
};

MetricsPanel.propTypes = {
  data: PropTypes.shape({
    totalEnergy: PropTypes.number,
    avgIrradiance: PropTypes.number,
    temperature: PropTypes.number,
  }).isRequired,
  activeMetric: PropTypes.string.isRequired,
};

export default MetricsPanel;
