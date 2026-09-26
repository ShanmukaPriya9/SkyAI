import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json([]);

  try {
    // Using OpenStreetMap Nominatim for hyper-local searching (neighborhoods, villages, streets)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`, {
      headers: {
        "User-Agent": "SkyAI-WeatherApp/1.0"
      }
    });
    
    if (!response.ok) throw new Error("OSM search failed");
    
    const data = await response.json();
    
    const rawResults = data.map((item: any) => {
      const parts = item.display_name.split(", ");
      return {
        id: item.place_id,
        name: parts[0],
        region: parts.length > 1 ? parts.slice(1, 3).join(", ") : "",
        country: parts[parts.length - 1],
        lat: item.lat,
        lon: item.lon,
        query: `${item.lat},${item.lon}` // This exact coordinate is passed to WeatherAPI
      };
    });

    // Deduplicate OSM results (OSM often returns multiple nodes for the same city/region)
    const seen = new Set();
    const results = rawResults.filter((loc: any) => {
      const key = `${loc.name}|${loc.region}|${loc.country}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to search location" }, { status: 500 });
  }
}
