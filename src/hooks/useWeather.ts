import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

const weatherEmoji: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function getWeatherEmoji(code: number): string {
  return weatherEmoji[code] || "🌡️";
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Try cached first (valid for 30 min)
    try {
      const cached = localStorage.getItem("habitflow_weather");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setWeather(data);
          return;
        }
      }
    } catch {
      // ignore cache errors
    }

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const json = await res.json();
          const data: WeatherData = {
            temperature: Math.round(json.current_weather.temperature),
            weatherCode: json.current_weather.weathercode,
          };
          setWeather(data);
          try {
            localStorage.setItem("habitflow_weather", JSON.stringify({ data, timestamp: Date.now() }));
          } catch {
            // ignore storage errors
          }
        } catch {
          // silently fail
        }
      },
      () => {
        // Fallback: Seoul coordinates
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current_weather=true`
        )
          .then((r) => r.json())
          .then((json) => {
            const data: WeatherData = {
              temperature: Math.round(json.current_weather.temperature),
              weatherCode: json.current_weather.weathercode,
            };
            setWeather(data);
            localStorage.setItem("habitflow_weather", JSON.stringify({ data, timestamp: Date.now() }));
          })
          .catch(() => {});
      },
      { timeout: 5000 }
    );
  }, []);

  return weather
    ? { emoji: getWeatherEmoji(weather.weatherCode), temperature: weather.temperature, loaded: true }
    : { emoji: "", temperature: 0, loaded: false };
}
