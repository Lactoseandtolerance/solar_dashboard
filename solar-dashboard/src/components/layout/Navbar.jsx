import React from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className='navbar' role='navigation' aria-label='Main navigation'>
      <ul className='flex space-x-4'>
        <li>
          <button
            className={`nav-button ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
            aria-current={activeTab === 'map' ? 'page' : undefined}
          >
            Map
          </button>
        </li>
        <li>
          <button
            className={`nav-button ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
            aria-current={activeTab === 'metrics' ? 'page' : undefined}
          >
            Metrics
          </button>
        </li>
        <li>
          <button
            className={`nav-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
            aria-current={activeTab === 'charts' ? 'page' : undefined}
          >
            Charts
          </button>
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Navbar;
