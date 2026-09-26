"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/store/AppContext";

// YouTube Video IDs for different weather conditions
const VIDEO_MAPPING: Record<string, string> = {
  "clear-day": "5Mxg-1hF1C8", // Blue sky
  "clear-night": "AWKzriOtiE8", // Starry night
  "rain": "mPZkdNFkNps", // Rain
  "clouds": "rQ5_2w2G3O8", // Cloudy sky
  "storm": "fBtzv9D8fM4", // Thunderstorm
  "snow": "BwwxO1bLIf4", // Snow
  "mist": "15v1oH17T2c" // Fog
};

export default function WeatherVideoBackground() {
  const { weatherCode, isDay } = useAppContext();
  const [videoId, setVideoId] = useState(VIDEO_MAPPING["clear-day"]);

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
    
    setVideoId(VIDEO_MAPPING[key] || VIDEO_MAPPING["clear-day"]);
  }, [weatherCode, isDay]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-blue-900 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[300vh] lg:w-[150vw] lg:h-[150vh]">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`}
          allow="autoplay"
          className="w-full h-full object-cover opacity-80"
          frameBorder="0"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
