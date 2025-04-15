import React from 'react';

// Audio feedback for buttons
const playChime = () => {
  try {
    const audio = new Audio('/public/assets/sounds/chime.mp3');
    audio.volume = 0.3;
    audio.play();
    
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  } catch (error) {
    console.log('Audio playback error:', error);
  }
};

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Map' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'charts', label: 'Charts' },
    { id: 'export', label: 'Export' }
  ];

  const handleClick = (tabId) => {
    playChime();
    setActiveTab(tabId);
  };

  return (
    <nav className="sticky top-0 bg-sky-400 p-4 flex flex-wrap justify-center gap-4 shadow-lg z-10">
      <div className="flex items-center mr-4">
        <img 
          src="/public/assets/images/sun.svg" 
          width="30" 
          height="30" 
          className="inline-block mr-2" 
          alt="Sun logo" 
        />
        <span className="text-xl font-bold text-white">Solar Forecast</span>
      </div>

      <div className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`cloud-button ${activeTab === item.id ? 'bg-yellow-100 scale-105' : ''}`}
            onClick={() => handleClick(item.id)}
            aria-label={item.label}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;