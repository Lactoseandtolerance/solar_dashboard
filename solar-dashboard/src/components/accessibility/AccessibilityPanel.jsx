import React, { useState } from 'react';

// Audio feedback for buttons
const playChime = () => {
  try {
    const audio = new Audio('/assets/sounds/chime.mp3');
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

const AccessibilityPanel = ({ 
  highContrast, 
  fontSize, 
  onContrastToggle, 
  onFontSizeChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleContrastToggle = () => {
    playChime();
    onContrastToggle();
  };
  
  const handleFontSizeChange = (e) => {
    const newSize = parseFloat(e.target.value);
    onFontSizeChange(newSize);
  };
  
  const togglePanel = () => {
    playChime();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`accessibility-panel ${highContrast ? 'bg-black text-white border-2 border-white' : 'bg-white'}`}>
      <button 
        className="flex items-center justify-center w-full mb-3"
        onClick={togglePanel}
        aria-expanded={isExpanded}
        aria-controls="accessibility-controls"
        aria-label="Toggle accessibility menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Accessibility</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div id="accessibility-controls" className="pt-2 border-t">
          <div className="mb-4">
            <button
              className={`w-full py-2 px-4 rounded-full mb-2 flex items-center justify-between ${highContrast ? 'bg-white text-black' : 'cloud-button'}`}
              onClick={handleContrastToggle}
              aria-pressed={highContrast}
              aria-label="Toggle high contrast mode"
            >
              <span>{highContrast ? 'Normal Mode' : 'High Contrast'}</span>
              <span className={`inline-block w-6 h-6 rounded-full ml-2 ${highContrast ? 'bg-black border-2 border-white' : 'bg-sky-500'}`}></span>
            </button>
            
            <div className="mt-4">
              <label htmlFor="font-size-slider" className="block mb-2 font-medium">
                Text Size ({fontSize.toFixed(1)}x)
              </label>
              <input
                id="font-size-slider"
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="w-full"
                aria-label="Adjust font size"
              />
            </div>
            
            <div className="mt-4">
              <label className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <span>Enable Audio Feedback</span>
              </label>
            </div>
            
            <div className="text-sm mt-4">
              <p>Press Tab to navigate and Enter to select.</p>
              <p>Use arrow keys to navigate the map.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;