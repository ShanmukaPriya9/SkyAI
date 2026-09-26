import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, FunctionDeclaration } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the tool for Gemini to call
const weatherTool: FunctionDeclaration = {
  name: "get_weather",
  description: "Fetches current weather and forecast for a given location",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      location: {
        type: SchemaType.STRING,
        description: "The city and state/country, e.g., 'San Francisco, CA'",
      },
    },
    required: ["location"],
  },
};

export async function POST(request: Request) {
  try {
    const { message, history = [], aiMode = "manual" } = await request.json();

    let systemInstruction = "";

    switch (aiMode) {
      case "expert":
        systemInstruction = "You are SkyAI, a strict, professional, highly-trained Meteorologist. When asked about the weather, ALWAYS use the get_weather tool. Your analysis MUST be strictly data-driven, technical, and highly concise. Focus on barometric pressure, wind vectors, AQI, and precise temperature deltas. Do NOT use emojis. Do NOT use casual language. Be direct and scientific. CRITICAL: You MUST highlight important words by bolding (**text**) all numerical values, meteorological terms, and critical metrics.";
        break;
      case "agriculture":
        systemInstruction = "You are SkyAI, an agricultural climate specialist. When asked about the weather, ALWAYS use the get_weather tool. The user is a farmer/grower. You MUST highly prioritize analyzing soil moisture, frost risks, evapotranspiration rates, crop viability, and precipitation accumulation in your response. Give specific agricultural recommendations. Use relevant farming emojis.";
        break;
      case "travel":
        systemInstruction = "You are SkyAI, an aviation and travel weather specialist. When asked about the weather, ALWAYS use the get_weather tool. The user is traveling. You MUST highly prioritize analyzing flight delays, road visibility, atmospheric turbulence, crosswinds, and packing recommendations based on the destination's climate. Use travel and weather emojis.";
        break;
      case "manual":
      default:
        systemInstruction = "You are SkyAI, an expert conversational weather assistant. When asked about the weather, ALWAYS use the get_weather tool. You MUST format your response beautifully. Use emojis. Keep paragraphs very short (1-2 sentences). Use bullet points for forecasts. End with a clearly separated 'Recommendation' section. Do not give giant blocks of plain text.";
        break;
    }

    // The user's AI model from 2026
    const model = genAI.getGenerativeModel({
      model: "models/gemini-flash-lite-latest", 
      tools: [{ functionDeclarations: [weatherTool] }],
      systemInstruction
    });

    const chat = model.startChat({
      history: history,
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    // Check if Gemini decided to call our weather tool
    const functionCall = response.functionCalls()?.[0];
    
    if (functionCall && functionCall.name === "get_weather") {
      const location = (functionCall.args as any).location;
      
      // Execute the actual API call to WeatherAPI
      const weatherRes = await fetch(`${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=3&aqi=yes&alerts=yes`);
      const weatherData = await weatherRes.json();

      // Send the weather data back to Gemini as a system/user context string to bypass the strict role constraint
      result = await chat.sendMessage(`[System Context]: The weather tool returned this data for ${location}:\n${JSON.stringify(weatherData)}`);
      response = result.response;
    }

    return NextResponse.json({ 
      text: response.text(),
      history: await chat.getHistory()
    });
    
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
