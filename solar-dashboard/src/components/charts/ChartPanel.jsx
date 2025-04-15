import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPanel = ({ data, highContrast }) => {
  const chartData = {
    labels: data.map((d) => new Date(d.timestamp * 1000).toLocaleTimeString()),
    datasets: [
      {
        label: 'Energy (kWh)',
        data: data.map((d) => d.energy),
        borderColor: highContrast ? '#fff' : 'rgba(59, 130, 246, 1)',
        backgroundColor: highContrast ? '#fff' : 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: highContrast ? '#fff' : '#000' } } },
    scales: {
      x: { ticks: { color: highContrast ? '#fff' : '#000' } },
      y: { ticks: { color: highContrast ? '#fff' : '#000' } },
    },
  };

  return (
    <div className={highContrast ? 'bg-black p-4' : 'bg-white p-4'}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartPanel;