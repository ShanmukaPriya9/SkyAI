"use client";

import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/store/AppContext";

// Map conditions to local video files in the /public folder
const VIDEO_MAPPING: Record<string, string> = {
  "clear-day": "/sunny_day.mp4", 
  "clear-night": "/clear_night.mp4",
  "partly-cloudy": "/partly_cloudy_mrng.mp4",
  "light-rain": "/light_rainy_mrng.mp4",
  "heavy-rain": "/heavy_rain.mp4",
  "rain-night": "/rainy_night.mp4",
  "thunderstorm": "/thunderstorm.mp4",
  "cyclone": "/cyclone.mp4",
  "snow": "/snow.mp4",
  "fog": "/fog.mp4"
};

export default function WeatherVideoBackground() {
  const { weatherCode, isDay } = useAppContext();
  const [videoSrc, setVideoSrc] = useState(VIDEO_MAPPING["clear-day"]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let key = "clear-day";
    
    if (weatherCode) {
      if ([1000].includes(weatherCode)) {
        key = isDay === 0 ? "clear-night" : "clear-day";
      } else if ([1003, 1006, 1009].includes(weatherCode)) {
        key = "partly-cloudy";
      } else if ([1030, 1135, 1148].includes(weatherCode)) {
        key = "fog";
      } else if ([1063, 1180, 1186, 1189, 1240].includes(weatherCode)) {
        key = isDay === 0 ? "rain-night" : "light-rain";
      } else if ([1183, 1192, 1195, 1243].includes(weatherCode)) {
        key = isDay === 0 ? "rain-night" : "heavy-rain";
      } else if ([1087, 1273, 1276, 1279, 1282].includes(weatherCode)) {
        key = "thunderstorm";
      } else if ([1066, 1114, 1210, 1213, 1219, 1222, 1225].includes(weatherCode)) {
        key = "snow";
      } else if (weatherCode === 1117 || weatherCode === 1225) { 
        // Blizzard/extreme conditions mapped to cyclone (approx)
        key = "cyclone";
      }
    }
    
    setVideoSrc(VIDEO_MAPPING[key] || VIDEO_MAPPING["clear-day"]);
  }, [weatherCode, isDay]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-blue-900 pointer-events-none">
      <video
        ref={videoRef}
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-80"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
