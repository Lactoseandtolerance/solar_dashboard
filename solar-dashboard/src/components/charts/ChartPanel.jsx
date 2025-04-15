import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './ChartPanel.css';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const ChartPanel = ({ data, highContrast }) => {
  const chartData = {
    datasets: [
      {
        label: 'Energy (kWh)',
        data: data.map(item => ({ x: item.timestamp, y: item.energy })),
        borderColor: highContrast ? '#fff' : '#1e3a8a',
        backgroundColor: highContrast ? '#fff' : '#1e3a8a',
        fill: false,
      },
      {
        label: 'Temperature (°C)',
        data: data.map(item => ({ x: item.timestamp, y: item.temperature })),
        borderColor: highContrast ? '#ccc' : '#b91c1c',
        backgroundColor: highContrast ? '#ccc' : '#b91c1c',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'hour' },
      },
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div className='chart-panel' role='region' aria-label='Solar energy charts'>
      <Line data={chartData} options={options} />
    </div>
  );
};

ChartPanel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      energy: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired,
    })
  ).isRequired,
  highContrast: PropTypes.bool.isRequired,
};

export default ChartPanel;
