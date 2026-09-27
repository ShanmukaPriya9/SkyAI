import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "Tirupati";
  const days = searchParams.get("days") || "7";

  if (!WEATHER_API_KEY) {
    return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 });
  }

  try {
    let overrideLocationName = null;
    if (location.includes(",")) {
      try {
        const [lat, lon] = location.split(",");
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`, {
          headers: { "User-Agent": "SkyAI-WeatherApp/1.0" }
        });
        const nomData = await nomRes.json();
        if (nomData && nomData.address) {
          const localName = nomData.address.neighbourhood || nomData.address.suburb || nomData.address.residential || nomData.address.quarter || nomData.address.hamlet || nomData.address.village || nomData.address.city_district || nomData.address.locality || nomData.address.city || nomData.address.town || nomData.name;
          const state = nomData.address.state || nomData.address.country || "";
          overrideLocationName = `${localName}${localName && state ? ', ' : ''}${state}`;
        }
      } catch (e) {
        console.error("Server-side Nominatim failed:", e);
      }
    }

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=${days}&aqi=yes&alerts=yes`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (overrideLocationName && data.location) {
      data.location.precise_name = overrideLocationName;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
