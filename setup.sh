#!/bin/bash
# Setup script for Solar Energy Dashboard Front-End MVP

echo "Setting up Solar Energy Dashboard Front-End..."

# Create React app
npx create-react-app solar-dashboard
cd solar-dashboard

# Install dependencies
echo "Installing dependencies..."
npm install react-leaflet leaflet chart.js react-chartjs-2
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install axios

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create directory structure
mkdir -p src/components/layout
mkdir -p src/components/map
mkdir -p src/components/charts
mkdir -p src/components/metrics
mkdir -p src/components/accessibility
mkdir -p src/data
mkdir -p src/styles
mkdir -p public/assets

# Get sample county GeoJSON data
echo "Downloading sample county GeoJSON data..."
curl -o src/data/us-counties-simplified.json https://raw.githubusercontent.com/topojson/us-atlas/master/counties-10m.json

# Create mock solar irradiance data
echo "Creating mock solar irradiance data..."
cat > src/data/mock-irradiance.json << 'EOL'
{
  "01001": 5.1, "01003": 5.3, "01005": 5.2, "01007": 5.0, "01009": 5.4,
  "06001": 6.8, "06003": 6.5, "06005": 6.7, "06007": 6.4, "06009": 6.2,
  "13001": 4.8, "13003": 4.9, "13005": 5.0, "13007": 4.7, "13009": 4.8,
  "36001": 4.2, "36003": 4.0, "36005": 4.1, "36007": 4.3, "36009": 4.2,
  "53001": 3.7, "53003": 3.5, "53005": 3.6, "53007": 3.8, "53009": 3.7
}
EOL

# Create sun and cloud SVGs
echo "Creating assets..."
mkdir -p public/assets/images
cat > public/assets/images/sun.svg << 'EOL'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="5" fill="#FFD700" stroke="#FFA500"/>
  <line x1="12" y1="3" x2="12" y2="1"/>
  <line x1="12" y1="23" x2="12" y2="21"/>
  <line x1="3" y1="12" x2="1" y2="12"/>
  <line x1="23" y1="12" x2="21" y2="12"/>
  <line x1="5.636" y1="5.636" x2="4.222" y2="4.222"/>
  <line x1="19.778" y1="19.778" x2="18.364" y2="18.364"/>
  <line x1="5.636" y1="18.364" x2="4.222" y2="19.778"/>
  <line x1="19.778" y1="4.222" x2="18.364" y2="5.636"/>
</svg>
EOL

cat > public/assets/images/cloud.svg << 'EOL'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#DDDDDD" stroke-width="1">
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
</svg>
EOL

cat > public/assets/sounds/chime.mp3 << 'EOL'
# This is a placeholder - you'll need to add an actual audio file here
EOL

# Configure Tailwind CSS
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
EOL

# Update src/index.css for Tailwind
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer components {
  .cloud-button {
    @apply relative bg-white text-sky-800 px-4 py-2 rounded-full shadow-md hover:scale-110 transition-all duration-200;
  }

  .cloud-button:hover::after {
    content: '';
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80;
    background-image: url('/assets/images/sun.svg');
    width: 24px;
    height: 24px;
  }
}

.sky-bg {
  background: linear-gradient(to bottom, #7dd3fc, #3b82f6);
  position: relative;
  overflow: hidden;
}

.cloud-drift {
  position: absolute;
  top: 20%;
  width: 100px;
  height: 50px;
  background: url('/assets/images/cloud.svg') no-repeat;
  animation: drift 60s linear infinite;
}

@keyframes drift {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(100vw); }
}
EOL

echo "Setup complete! CD into the solar-dashboard directory and run 'npm start' to launch the app."