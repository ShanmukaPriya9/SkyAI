"use client";

import { useEffect, useState, useRef } from "react";

// Placeholder royalty-free videos for different weather conditions
const VIDEO_MAPPING = {
  "clear-day": "/clouds.mp4", 
  "clear-night": "/clouds.mp4",
  "rain": "/clouds.mp4",
  "clouds": "/clouds.mp4",
  "storm": "/clouds.mp4"
};

type WeatherCondition = keyof typeof VIDEO_MAPPING;

export default function WeatherVideoBackground({ condition = "clouds" }: { condition?: WeatherCondition }) {
  const [videoSrc, setVideoSrc] = useState(VIDEO_MAPPING[condition]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // When condition changes, softly transition the video
    setVideoSrc(VIDEO_MAPPING[condition]);
  }, [condition]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-blue-900">
      <video
        ref={videoRef}
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-100"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {/* Simple translucent overlay */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
