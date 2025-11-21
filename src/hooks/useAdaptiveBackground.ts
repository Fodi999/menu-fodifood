"use client";

import { useState, useEffect } from "react";

export type TimeOfDay = "morning" | "day" | "evening" | "night";
export type WeatherCondition = "clear" | "clouds" | "rain" | "thunderstorm" | "snow" | "fog";
export type LocationTheme = "tokyo" | "paris" | "newyork" | "default";

interface BackgroundConfig {
  gradients: string[];
  particles?: boolean;
  glowCircles?: boolean;
}

interface WeatherData {
  condition: WeatherCondition;
  temp: number;
  description: string;
}

interface LocationData {
  city: string;
  theme: LocationTheme;
  lat: number;
  lon: number;
}

// Определение времени суток по часам
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

// Определение темы локации по городу
const getLocationTheme = (city: string): LocationTheme => {
  const cityLower = city.toLowerCase();
  if (cityLower.includes("tokyo") || cityLower.includes("東京")) return "tokyo";
  if (cityLower.includes("paris") || cityLower.includes("париж")) return "paris";
  if (cityLower.includes("new york") || cityLower.includes("нью-йорк")) return "newyork";
  return "default";
};

// Конфигурации фонов для разных условий
const backgrounds: Record<TimeOfDay, Record<WeatherCondition, BackgroundConfig>> = {
  morning: {
    clear: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.85 0.15 60 / 0.3), transparent)",
        "radial-gradient(ellipse 60% 40% at 80% 30%, oklch(0.90 0.12 40 / 0.2), transparent)",
        "radial-gradient(ellipse 70% 50% at 20% 70%, oklch(0.88 0.10 80 / 0.15), transparent)",
      ],
      particles: true,
    },
    clouds: {
      gradients: [
        "radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.75 0.08 240 / 0.25), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 40%, oklch(0.80 0.06 220 / 0.2), transparent)",
      ],
    },
    rain: {
      gradients: [
        "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.60 0.12 240 / 0.3), transparent)",
        "radial-gradient(ellipse 60% 50% at 30% 60%, oklch(0.65 0.10 220 / 0.2), transparent)",
      ],
      particles: true,
    },
    thunderstorm: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% -20%, oklch(0.45 0.15 260 / 0.35), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 50%, oklch(0.50 0.12 240 / 0.25), transparent)",
      ],
      glowCircles: true,
    },
    snow: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.92 0.02 240 / 0.3), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 40%, oklch(0.95 0.01 220 / 0.25), transparent)",
      ],
      particles: true,
    },
    fog: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% 20%, oklch(0.85 0.03 240 / 0.4), transparent)",
        "radial-gradient(ellipse 80% 50% at 30% 70%, oklch(0.88 0.02 220 / 0.3), transparent)",
      ],
    },
  },
  day: {
    clear: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -30%, oklch(0.90 0.18 50 / 0.35), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.85 0.15 180 / 0.25), transparent)",
        "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.88 0.12 120 / 0.2), transparent)",
      ],
      glowCircles: true,
    },
    clouds: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.78 0.08 240 / 0.28), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 50%, oklch(0.82 0.06 220 / 0.22), transparent)",
      ],
    },
    rain: {
      gradients: [
        "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.14 240 / 0.32), transparent)",
        "radial-gradient(ellipse 70% 50% at 40% 60%, oklch(0.68 0.11 220 / 0.25), transparent)",
      ],
      particles: true,
    },
    thunderstorm: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% -20%, oklch(0.48 0.16 260 / 0.38), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 50%, oklch(0.52 0.13 240 / 0.28), transparent)",
      ],
      glowCircles: true,
    },
    snow: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.94 0.02 240 / 0.32), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 40%, oklch(0.96 0.01 220 / 0.27), transparent)",
      ],
      particles: true,
    },
    fog: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% 20%, oklch(0.87 0.04 240 / 0.42), transparent)",
        "radial-gradient(ellipse 80% 50% at 30% 70%, oklch(0.90 0.03 220 / 0.32), transparent)",
      ],
    },
  },
  evening: {
    clear: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.65 0.25 30 / 0.35), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.70 0.22 350 / 0.28), transparent)",
        "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.55 0.20 280 / 0.22), transparent)",
      ],
      glowCircles: true,
    },
    clouds: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.55 0.15 320 / 0.3), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 50%, oklch(0.60 0.12 300 / 0.25), transparent)",
      ],
    },
    rain: {
      gradients: [
        "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.45 0.18 260 / 0.35), transparent)",
        "radial-gradient(ellipse 70% 50% at 40% 60%, oklch(0.50 0.15 240 / 0.28), transparent)",
      ],
      particles: true,
    },
    thunderstorm: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% -20%, oklch(0.35 0.20 280 / 0.4), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 50%, oklch(0.40 0.18 260 / 0.32), transparent)",
      ],
      glowCircles: true,
    },
    snow: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.75 0.08 300 / 0.32), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 40%, oklch(0.80 0.06 280 / 0.27), transparent)",
      ],
      particles: true,
    },
    fog: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% 20%, oklch(0.65 0.10 300 / 0.4), transparent)",
        "radial-gradient(ellipse 80% 50% at 30% 70%, oklch(0.70 0.08 280 / 0.32), transparent)",
      ],
    },
  },
  night: {
    clear: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.35 0.15 280 / 0.3), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.30 0.18 260 / 0.25), transparent)",
        "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.25 0.12 240 / 0.2), transparent)",
      ],
      glowCircles: true,
      particles: true,
    },
    clouds: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.30 0.10 260 / 0.28), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 50%, oklch(0.35 0.08 240 / 0.22), transparent)",
      ],
    },
    rain: {
      gradients: [
        "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.25 0.15 260 / 0.32), transparent)",
        "radial-gradient(ellipse 70% 50% at 40% 60%, oklch(0.30 0.12 240 / 0.26), transparent)",
      ],
      particles: true,
    },
    thunderstorm: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% -20%, oklch(0.20 0.18 280 / 0.38), transparent)",
        "radial-gradient(ellipse 70% 50% at 80% 50%, oklch(0.25 0.15 260 / 0.3), transparent)",
      ],
      glowCircles: true,
    },
    snow: {
      gradients: [
        "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.45 0.08 260 / 0.3), transparent)",
        "radial-gradient(ellipse 60% 40% at 70% 40%, oklch(0.50 0.06 240 / 0.25), transparent)",
      ],
      particles: true,
    },
    fog: {
      gradients: [
        "radial-gradient(ellipse 90% 60% at 50% 20%, oklch(0.35 0.08 260 / 0.38), transparent)",
        "radial-gradient(ellipse 80% 50% at 30% 70%, oklch(0.40 0.06 240 / 0.3), transparent)",
      ],
    },
  },
};

// Темы локаций (переопределяют базовые градиенты)
const locationThemes: Record<LocationTheme, Partial<BackgroundConfig>> = {
  tokyo: {
    gradients: [
      "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.65 0.30 330 / 0.35), transparent)",
      "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.60 0.28 290 / 0.3), transparent)",
      "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.70 0.25 310 / 0.25), transparent)",
    ],
    glowCircles: true,
  },
  paris: {
    gradients: [
      "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.80 0.18 50 / 0.3), transparent)",
      "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.85 0.15 40 / 0.25), transparent)",
      "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.75 0.12 60 / 0.2), transparent)",
    ],
  },
  newyork: {
    gradients: [
      "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.40 0.15 260 / 0.35), transparent)",
      "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.35 0.18 240 / 0.3), transparent)",
      "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.45 0.12 280 / 0.25), transparent)",
    ],
    glowCircles: true,
  },
  default: {
    gradients: [
      "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.60 0.24 27 / 0.25), transparent)",
      "radial-gradient(ellipse 70% 50% at 80% 40%, oklch(0.55 0.20 45 / 0.2), transparent)",
      "radial-gradient(ellipse 60% 40% at 20% 80%, oklch(0.65 0.18 60 / 0.15), transparent)",
    ],
  },
};

export const useAdaptiveBackground = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Получить погоду с OpenWeather API
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        console.warn("OpenWeather API key not found");
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error("Weather fetch failed");

      const data = await response.json();
      
      let condition: WeatherCondition = "clear";
      const weatherMain = data.weather[0].main.toLowerCase();
      
      if (weatherMain.includes("cloud")) condition = "clouds";
      else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) condition = "rain";
      else if (weatherMain.includes("thunder")) condition = "thunderstorm";
      else if (weatherMain.includes("snow")) condition = "snow";
      else if (weatherMain.includes("fog") || weatherMain.includes("mist") || weatherMain.includes("haze")) condition = "fog";

      setWeather({
        condition,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
      });
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  // Получить геолокацию
  const fetchLocation = async () => {
    try {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Получить название города через reverse geocoding
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );

          if (response.ok) {
            const data = await response.json();
            const city = data[0]?.name || "Unknown";
            setLocation({
              city,
              theme: getLocationTheme(city),
              lat: latitude,
              lon: longitude,
            });

            // Получить погоду
            await fetchWeather(latitude, longitude);
          }

          setIsLoading(false);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setIsLoading(false);
    }
  };

  // Обновить время суток
  useEffect(() => {
    const updateTime = () => setTimeOfDay(getTimeOfDay());
    updateTime();

    const interval = setInterval(updateTime, 60000); // Каждую минуту
    return () => clearInterval(interval);
  }, []);

  // Получить данные при монтировании
  useEffect(() => {
    fetchLocation();
  }, []);

  // Получить конфигурацию фона
  const getBackgroundConfig = (): BackgroundConfig => {
    const weatherCondition = weather?.condition || "clear";
    const baseConfig = backgrounds[timeOfDay][weatherCondition];

    // Применить тему локации, если есть
    if (location?.theme && location.theme !== "default") {
      const themeConfig = locationThemes[location.theme];
      return {
        ...baseConfig,
        ...themeConfig,
      };
    }

    return baseConfig;
  };

  return {
    timeOfDay,
    weather,
    location,
    isLoading,
    backgroundConfig: getBackgroundConfig(),
  };
};
