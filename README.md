# SkyAI 

SkyAI is a full-stack climate analytics dashboard and weather forecasting application built with Next.js. It integrates real-time meteorological data with an advanced conversational AI, allowing users to dynamically switch between specialized meteorological personas for tailored data analysis.

## Key Features

*   **Multi-Persona AI Integration:** Features a conversational interface powered by the Google Gemini API. The AI engine utilizes dynamic system instructions managed via global state, allowing the user to seamlessly toggle between four distinct analytical modes: Casual Assistant, Professional Meteorologist, Agricultural Analyst, and Travel Advisor.
*   **Live Global Radar:** Implements interactive map overlays for tracking atmospheric wind vectors, regional precipitation, and cloud cover.
*   **Hyper-Local Geolocation:** Bypasses generalized city-center coordinate reporting by utilizing the browser's hardware Geolocation API in tandem with OpenStreetMap's Nominatim reverse-geocoding engine for hyper-local precision.
*   **Historical Climate Analytics:** Includes dedicated data visualization engines for deep-dive historical climate analysis and long-term atmospheric CO2 tracking.
*   **Persistent Authentication Architecture:** Secures premium application routes (such as the WebGL Map and Climate graphs) using a custom localStorage-backed authentication engine and route guards.
*   **Dynamic UI & Global State:** Built with a clean glassmorphism design system utilizing Tailwind CSS. Leverages native React Context API for global state management, instantly cascading user preferences (such as Celsius/Fahrenheit toggles) throughout the application DOM.

## Technology Stack

*   **Frontend Framework:** React 18, Next.js 14 (App Router)
*   **Styling:** Tailwind CSS, Lucide-React
*   **State Management:** React Context API
*   **Data Providers:** WeatherAPI (Live metrics), Google Gemini (Conversational AI), OpenStreetMap Nominatim (Reverse Geocoding)

## Installation & Setup

To run this project locally, clone the repository and install the dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser to view the application.
