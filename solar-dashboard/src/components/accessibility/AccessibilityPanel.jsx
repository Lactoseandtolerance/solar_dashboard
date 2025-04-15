import React from 'react';
import PropTypes from 'prop-types';
import './AccessibilityPanel.css';

const AccessibilityPanel = ({ highContrast, fontSize, onContrastToggle, onFontSizeChange }) => {
  const handleFontSizeChange = (size) => {
    onFontSizeChange(size);
  };

  return (
    <div className='accessibility-panel' role='region' aria-label='Accessibility controls'>
      <button
        onClick={onContrastToggle}
        aria-pressed={highContrast}
        className='cloud-button'
      >
        {highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
      </button>
      <div className='font-size-control'>
        <label htmlFor='fontSize'>Font Size: {fontSize.toFixed(1)}rem</label>
        <input
          id='fontSize'
          type='range'
          min='0.8'
          max='1.5'
          step='0.1'
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseFloat(e.target.value))}
          aria-valuenow={fontSize}
          aria-valuemin='0.8'
          aria-valuemax='1.5'
        />
      </div>
    </div>
  );
};

AccessibilityPanel.propTypes = {
  highContrast: PropTypes.bool.isRequired,
  fontSize: PropTypes.number.isRequired,
  onContrastToggle: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
};

export default AccessibilityPanel;
