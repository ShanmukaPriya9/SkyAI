<div align="center">
  
# ☁️ SkyAI
**Next-Generation Climate Analytics & AI Weather Assistant**

[![Live Demo](https://img.shields.io/badge/Live_Demo-sky--ai--virid.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://sky-ai-virid.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

SkyAI is a full-stack climate analytics dashboard and weather forecasting application built with Next.js. It integrates real-time meteorological data with an advanced conversational AI, allowing users to dynamically switch between specialized meteorological personas for tailored data analysis.

##  Features

* **Live AI Meteorologist:** Features a conversational interface powered by the **Google Gemini API**. The AI engine utilizes dynamic system instructions managed via global state, allowing the user to seamlessly toggle between four distinct analytical modes: *Casual Assistant*, *Professional Meteorologist*, *Agricultural Analyst*, and *Travel Advisor*.
* **Dynamic Video Environments:** The dashboard features a completely custom dynamic video background engine that maps strict daytime and nighttime weather codes to beautiful, locally hosted `.mp4` background loops in real-time.
* **Hyper-Local Geolocation:** Bypasses generalized city-center coordinate reporting by utilizing the browser's hardware Geolocation API in tandem with OpenStreetMap's Nominatim reverse-geocoding engine for hyper-local precision.
* **Comprehensive Metrics Grid:** Displays total rainfall, snow chances, standard US EPA Air Quality Index (AQI), and precise astronomical data (moon phases, sunrise, sunset) based on real-time API payloads.
* **Persistent Authentication Architecture:** Secures premium application routes (such as the WebGL Map and Climate graphs) using a custom localStorage-backed authentication engine, fully supporting dynamic user names globally.
* **Dynamic UI & Global State:** Built with a clean glassmorphism design system utilizing Tailwind CSS. Leverages native React Context API for global state management, instantly cascading user preferences (such as Celsius/Fahrenheit and Metric/Imperial toggles) throughout the application DOM.

##  Live Demo

You can interact with the live application deployed on Vercel here:  
--> **[https://sky-ai-virid.vercel.app](https://sky-ai-virid.vercel.app)**

##  Technology Stack

* **Frontend Framework:** React 18, Next.js 14 (App Router)
* **Styling:** Tailwind CSS, Lucide-React Icons
* **State Management:** React Context API (`AppContext.tsx`)
* **Data Providers:** 
  * WeatherAPI (Live metrics, Forecasts, AQI)
  * Google Gemini (Conversational AI Function Calling)
  * OpenStreetMap Nominatim (Reverse Geocoding)

##  Installation & Setup

To run this project locally, clone the repository and install the dependencies:

```bash
git clone https://github.com/ShanmukaPriya9/SkyAI.git
cd sky-ai
npm install
```

Create a `.env.local` file in the root directory and add your API keys:
```env
WEATHER_API_KEY=your_weatherapi_key
GEMINI_API_KEY=your_google_gemini_key
```

Start the local development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser to view the application.
