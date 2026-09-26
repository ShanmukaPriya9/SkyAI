"use client";

import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/store/AppContext";

// Map conditions to local video files in the /public folder
const VIDEO_MAPPING: Record<string, string> = {
  "clear-day": "/clouds.mp4", 
  "clear-night": "/clouds.mp4",
  "rain": "/clouds.mp4",
  "clouds": "/clouds.mp4",
  "storm": "/clouds.mp4",
  "snow": "/clouds.mp4",
  "mist": "/clouds.mp4"
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
        key = "clouds";
      } else if ([1030, 1135, 1148].includes(weatherCode)) {
        key = "mist";
      } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243].includes(weatherCode)) {
        key = "rain";
      } else if ([1087, 1273, 1276, 1279, 1282].includes(weatherCode)) {
        key = "storm";
      } else if ([1066, 1114, 1210, 1213, 1219, 1222, 1225].includes(weatherCode)) {
        key = "snow";
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
