import React from 'react';

const MetricsPanel = ({ data, activeMetric }) => (
  <div className="p-4 bg-white shadow rounded">
    <h3 className="text-lg font-semibold">{activeMetric === 'totalEnergy' ? 'Total Energy' : 'Average Irradiance'}</h3>
    <p className="text-2xl">
      {activeMetric === 'totalEnergy'
        ? `${(data.totalEnergy || 0).toFixed(2)} kWh`
        : `${(data.avgIrradiance || 0).toFixed(2)} W/m²`}
    </p>
  </div>
);

export default MetricsPanel;