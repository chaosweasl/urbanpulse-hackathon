// ─── OpenWeatherMap API Client ──────────────────────────

const BASE_URL = "https://api.openweathermap.org/data/3.0";

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
  lng: number,
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    // Graceful degradation when no API key is provided
    return {
      temperature: 0,
      description: "Weather unavailable",
      icon: "01d",
      alerts: [],
      hasSevereAlert: false,
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily&appid=${apiKey}&units=metric`,
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API returned ${response.status}`);
    }

    const data = await response.json();

    const alerts: WeatherAlert[] = (data.alerts || []).map(
      (alert: Record<string, unknown>) => ({
        event: alert.event,
        description: alert.description,
        start: alert.start,
        end: alert.end,
      }),
    );

    return {
      temperature: data.current?.temp || 0,
      description: data.current?.weather?.[0]?.description || "Unknown",
      icon: data.current?.weather?.[0]?.icon || "01d",
      alerts,
      hasSevereAlert: alerts.length > 0,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Graceful degradation on fetch error
    return {
      temperature: 0,
      description: "Weather unavailable",
      icon: "01d",
      alerts: [],
      hasSevereAlert: false,
    };
  }
}
