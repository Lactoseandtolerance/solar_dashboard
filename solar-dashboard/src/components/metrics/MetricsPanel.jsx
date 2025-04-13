import React, { useState } from 'react';

// MetricCard component for individual metrics
const MetricCard = ({ title, value, unit, icon }) => {
  return (
    <div className="metric-card bg-white rounded-lg p-4 shadow-lg animate-float">
      <div className="flex items-center mb-2">
        {icon && (
          <div className="mr-2 text-sky-600">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-sky-800">{title}</h3>
      </div>
      <p className="text-2xl text-sky-600">
        {value} <span className="text-sm text-sky-400">{unit}</span>
      </p>
    </div>
  );
};

// FilterPanel component for data filtering
const FilterPanel = ({ onFilterChange }) => {
  const [location, setLocation] = useState('all');
  const [timeRange, setTimeRange] = useState(7);
  
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    onFilterChange({ location: e.target.value, timeRange });
  };
  
  const handleTimeRangeChange = (e) => {
    const days = parseInt(e.target.value);
    setTimeRange(days);
    onFilterChange({ location, timeRange: days });
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
      <h3 className="text-lg font-bold text-sky-800 mb-4">Filter Data</h3>
      
      <div className="mb-4">
        <label htmlFor="location" className="block mb-2 font-medium">Solar Farm Location</label>
        <select 
          id="location" 
          className="w-full p-2 border rounded-lg"
          value={location}
          onChange={handleLocationChange}
          aria-label="Select location"
        >
          <option value="all">All Locations</option>
          <option value="Solar Farm 1">Solar Farm 1 (New York)</option>
          <option value="Solar Farm 2">Solar Farm 2 (Los Angeles)</option>
          <option value="Solar Farm 3">Solar Farm 3 (Phoenix)</option>
          <option value="Solar Farm 4">Solar Farm 4 (Miami)</option>
          <option value="Solar Farm 5">Solar Farm 5 (Denver)</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="timeRange" className="block mb-2 font-medium">Time Range (days)</label>
        <input 
          type="range" 
          id="timeRange" 
          className="w-full"
          min="1" 
          max="30" 
          value={timeRange}
          onChange={handleTimeRangeChange}
          aria-label="Select time range in days"
        />
        <div className="text-center mt-1">{timeRange} days</div>
      </div>
    </div>
  );
};

// Main MetricsPanel component
const MetricsPanel = () => {
  const [filters, setFilters] = useState({ location: 'all', timeRange: 7 });
  
  // Mock data - in a real app this would come from an API based on filters
  const metrics = [
    {
      title: "Total Energy Production",
      value: filters.location === 'all' ? "12,450" : "5,830",
      unit: "kWh",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
    },
    {
      title: "Average Daily Production",
      value: filters.location === 'all' ? "1,778" : "833",
      unit: "kWh/day",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
    },
    {
      title: "Peak Production",
      value: filters.location === 'all' ? "245" : "126",
      unit: "kWh/hour",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
    },
    {
      title: "CO₂ Emissions Avoided",
      value: filters.location === 'all' ? "8.7" : "4.1",
      unit: "tons",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    },
    {
      title: "System Efficiency",
      value: filters.location === 'all' ? "87.3" : "91.5",
      unit: "%",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
    },
    {
      title: "Energy Storage Level",
      value: filters.location === 'all' ? "62.7" : "54.9",
      unit: "%",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
    }
  ];
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <div>
      <FilterPanel onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-sky-800 mb-4">Performance Insights</h3>
        <p>
          Based on the current data, {filters.location === 'all' ? 'all solar farms' : filters.location} {filters.location === 'all' ? 'are' : 'is'} operating at 
          {filters.location === 'all' ? ' 87.3%' : ' 91.5%'} efficiency. 
          This is {filters.location === 'all' ? '3.1%' : '7.3%'} above the expected performance for this time of year.
        </p>
        <p className="mt-2">
          The peak production time has been consistently between 11:00 AM and 2:00 PM, 
          with weather conditions having a moderate impact on overall output.
        </p>
      </div>
    </div>
  );
};

export default MetricsPanel;