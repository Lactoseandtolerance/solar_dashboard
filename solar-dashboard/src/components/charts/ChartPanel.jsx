import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart configuration for accessibility
ChartJS.defaults.color = '#1e3a8a';
ChartJS.defaults.font.family = 'Poppins, sans-serif';
ChartJS.defaults.font.size = 14;

// Custom tooltip with cloud-shaped styles
const customTooltip = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  titleColor: '#1e3a8a',
  bodyColor: '#1e3a8a',
  borderColor: '#3b82f6',
  borderWidth: 1,
  cornerRadius: 12,
  padding: 12,
  boxPadding: 6,
  titleFont: {
    size: 14,
    weight: 'bold',
  },
  bodyFont: {
    size: 14,
  },
  caretSize: 8,
  caretPadding: 10,
};

// Energy Production Chart Component
const EnergyProductionChart = ({ location, timeFrame }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  
  // Generate mock data based on location and timeFrame
  useEffect(() => {
    const days = [];
    const production = [];
    const forecasted = [];
    
    // Generate dates for the selected time frame
    const today = new Date();
    for (let i = 0; i < timeFrame; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.unshift(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate mock values based on location (would come from API in real app)
      const baseValue = location === 'all' ? 1500 : 800;
      const randomFactor = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
      production.unshift(Math.round(baseValue * randomFactor));
      
      // Forecast values - slightly different for visual interest
      const forecastFactor = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
      forecasted.unshift(Math.round(baseValue * forecastFactor));
    }
    
    setChartData({
      labels: days,
      datasets: [
        {
          label: 'Actual Production',
          data: production,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
        {
          label: 'Forecasted Production',
          data: forecasted,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderWidth: 3,
          borderDash: [5, 5],
          tension: 0.4,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#fff',
          pointRadius: 3,
        },
      ],
    });
  }, [location, timeFrame]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Energy Production (kWh)',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: customTooltip,
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + ' kWh';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <div className="chart-container" aria-label="Line chart showing daily energy production">
      <Line data={chartData} options={options} />
    </div>
  );
};

// Hourly Production Chart Component
const HourlyProductionChart = ({ location }) => {
  const hours = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
  
  // Generate mock data based on location
  const getHourlyData = () => {
    const baseValue = location === 'all' ? 120 : 65;
    const data = [];
    
    for (let i = 0; i < hours.length; i++) {
      // Create a bell curve with peak at midday
      const hourFactor = 1 - Math.pow((i - 6) / 6, 2); // Peak around noon
      const randomFactor = Math.random() * 0.1 + 0.95; // Add small random variation
      data.push(Math.round(baseValue * hourFactor * randomFactor));
    }
    
    return data;
  };
  
  const chartData = {
    labels: hours,
    datasets: [
      {
        label: 'Energy Output',
        data: getHourlyData(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Hourly Energy Production (kWh)',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: customTooltip,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + ' kWh';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <div className="chart-container" aria-label="Bar chart showing hourly energy production">
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Filter Controls for Charts
const ChartFilters = ({ location, timeFrame, onFilterChange }) => {
  const handleLocationChange = (e) => {
    onFilterChange({ location: e.target.value, timeFrame });
  };
  
  const handleTimeFrameChange = (e) => {
    onFilterChange({ location, timeFrame: parseInt(e.target.value) });
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
      <h3 className="text-lg font-bold text-sky-800 mb-4">Chart Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="chartLocation" className="block mb-2 font-medium">Location</label>
          <select 
            id="chartLocation" 
            className="w-full p-2 border rounded-lg"
            value={location}
            onChange={handleLocationChange}
            aria-label="Select location for chart data"
          >
            <option value="all">All Locations</option>
            <option value="Solar Farm 1">Solar Farm 1 (New York)</option>
            <option value="Solar Farm 2">Solar Farm 2 (Los Angeles)</option>
            <option value="Solar Farm 3">Solar Farm 3 (Phoenix)</option>
            <option value="Solar Farm 4">Solar Farm 4 (Miami)</option>
            <option value="Solar Farm 5">Solar Farm 5 (Denver)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="chartTimeFrame" className="block mb-2 font-medium">Time Period (days)</label>
          <select 
            id="chartTimeFrame" 
            className="w-full p-2 border rounded-lg"
            value={timeFrame}
            onChange={handleTimeFrameChange}
            aria-label="Select time period for chart data"
          >
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main ChartPanel Component
const ChartPanel = () => {
  const [filters, setFilters] = useState({
    location: 'all',
    timeFrame: 14
  });
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <div>
      <ChartFilters 
        location={filters.location}
        timeFrame={filters.timeFrame}
        onFilterChange={handleFilterChange}
      />
      
      <EnergyProductionChart 
        location={filters.location}
        timeFrame={filters.timeFrame}
      />
      
      <HourlyProductionChart 
        location={filters.location}
      />
      
      <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-sky-800 mb-4">Data Insights</h3>
        <p>
          The charts show that {filters.location === 'all' ? 'all solar farms combined' : filters.location} generated 
          an average of {filters.location === 'all' ? '1,450' : '780'} kWh per day over the selected period.
        </p>
        <p className="mt-2">
          Peak production occurs consistently between 11 AM and 2 PM, with maximum output reaching 
          {filters.location === 'all' ? ' 120' : ' 65'} kWh per hour during ideal conditions.
        </p>
        <p className="mt-2">
          The forecast accuracy over this period was {filters.location === 'all' ? '92%' : '89%'}, 
          which is {filters.location === 'all' ? '3%' : '2%'} better than the previous period.
        </p>
      </div>
    </div>
  );
};

export default ChartPanel;