# Solar Energy Dashboard MVP

A modern, accessible front-end for the Solar Energy Forecasting project with a playful cloud-themed design and interactive features.

## Features

- **Interactive County-Level Solar Irradiance Map**: Visual representation of solar irradiance data across counties in the USA
- **Metrics Dashboard**: Real-time display of key solar energy metrics with cloud-shaped cards
- **Data Visualization**: Dynamic charts showing energy production, forecasts, and trends
- **Accessibility Features**: High-contrast mode, resizable text, keyboard navigation, and screen reader support
- **Cloud-Themed UI**: Playful design with cloud-shaped buttons, sun logo hover effects, and floating animations

## Tech Stack

- **Framework**: React.js
- **Map Library**: React-Leaflet
- **Charts**: Chart.js with React-Chartjs-2
- **Styling**: Tailwind CSS with custom animations
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support

## Getting Started

1. Clone the repository
2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Navigate to the project directory:
   ```bash
   cd solar-dashboard
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
solar-dashboard/
├── public/
│   └── assets/
│       ├── images/
│       │   ├── sun.svg
│       │   └── cloud.svg
│       └── sounds/
│           └── chime.mp3
├── src/
│   ├── components/
│   │   ├── accessibility/
│   │   │   └── AccessibilityPanel.js
│   │   ├── charts/
│   │   │   └── ChartPanel.js
│   │   ├── layout/
│   │   │   └── Navbar.js
│   │   ├── map/
│   │   │   └── SolarMap.js
│   │   └── metrics/
│   │       └── MetricsPanel.js
│   ├── data/
│   │   ├── us-counties-simplified.json
│   │   └── mock-irradiance.json
│   ├── styles/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Accessibility Features

- **High Contrast Mode**: Toggle for better visibility
- **Resizable Text**: Slider to increase font size up to 2x
- **Keyboard Navigation**: All interactive elements accessible via Tab key
- **Screen Reader Support**: ARIA labels and live regions
- **Audio Feedback**: Optional sound cues on interactions

## Future Enhancements

- Integration with real-time solar data API
- User authentication and personalized dashboards
- Advanced filtering and comparison tools
- Historical data analysis
- Mobile app with push notifications for production alerts

## License

This project is licensed under the MIT License - see the LICENSE file for details.