# 🌤️ SkyAI 

**An intelligent, multi-persona climate analytics dashboard powered by Next.js and Gemini AI.**

SkyAI is a modern, full-stack weather application that goes beyond simple forecasting. It integrates real-time meteorological data with an advanced AI chatbot that dynamically shifts its personality and analysis based on your specific needs—ranging from a casual daily planner to a professional meteorologist, a crop-focused agriculture analyst, or a flight-focused travel advisor.

![SkyAI Interface](https://github.com/user-attachments/assets/placeholder)

## ✨ Key Features

*   **🧠 Intelligent AI Modes:** Chat with 4 distinct AI personas, powered by Google's Gemini API. The AI dynamically rewrites its system instructions globally based on your selected mode.
*   **🗺️ Live Global Radar:** Interactive map overlays for tracking wind vectors, precipitation, and cloud cover.
*   **📍 Hyper-Local Precision:** Uses your device's hardware Geolocation API combined with OpenStreetMap reverse-geocoding to bypass generic cities and snap directly to your exact neighborhood.
*   **📊 Climate Analytics:** Deep-dive historical climate analysis and atmospheric CO₂ tracking.
*   **🔐 Persistent Authentication:** A custom, fully-functional secure authentication engine that actively locks and unlocks premium features (like the WebGL Map and Climate graphs) across the entire application.
*   **✨ Dynamic UI:** Gorgeous glassmorphism design, responsive layouts, and real-time global unit conversions (Celsius/Fahrenheit) that cascade instantly through the React DOM.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Next.js 14 (App Router), Tailwind CSS
*   **State Management:** Native React Context API
*   **UI Components:** Lucide-React Icons
*   **Data & APIs:** WeatherAPI (Live metrics), Google Gemini (Conversational AI), OpenStreetMap Nominatim (Reverse Geocoding)

## 🚀 Getting Started

To run this project locally, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.
