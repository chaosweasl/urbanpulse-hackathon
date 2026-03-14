// ─── OpenWeatherMap API Client ──────────────────────────

const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  alerts: WeatherAlert[];
  hasSevereAlert: boolean;
}

/**
 * Fetch current weather and alerts for a location.
 * Call this from API routes only (uses server-side API key).
 */
export async function fetchWeather(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHERMAP_API_KEY is not set");
  }

  // TODO: Implement actual API call
  // const response = await fetch(
  //   `${BASE_URL}/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
  // );
  // const data = await response.json();

  // Placeholder return
  return {
    temperature: 0,
    description: "Not implemented",
    icon: "01d",
    alerts: [],
    hasSevereAlert: false,
  };
}
