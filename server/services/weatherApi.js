// OpenWeatherMap API client
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeather(lat, lng) {
  if (!WEATHER_API_KEY) {
    console.warn('[Weather] OPENWEATHER_API_KEY not set, returning mock data');
    return getMockWeather();
  }

  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      condition: getWeatherCondition(data.weather[0].main, data.weather[0].description),
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
    };
  } catch (error) {
    console.error('[Weather] Error fetching weather:', error);
    return getMockWeather();
  }
}

function getWeatherCondition(main, description) {
  const desc = description.toLowerCase();
  
  if (main === 'Clear') return 'sunny';
  if (main === 'Clouds') return 'cloudy';
  if (main === 'Rain' || main === 'Drizzle') return 'rainy';
  if (main === 'Snow') return 'snowy';
  if (main === 'Thunderstorm') return 'stormy';
  if (main === 'Mist' || main === 'Fog' || main === 'Haze') return 'foggy';
  
  // Fallback to description
  if (desc.includes('sun') || desc.includes('clear')) return 'sunny';
  if (desc.includes('cloud')) return 'cloudy';
  if (desc.includes('rain')) return 'rainy';
  if (desc.includes('snow')) return 'snowy';
  
  return 'sunny'; // Default fallback
}

function getMockWeather() {
  // Return mock data for development without API key
  const month = new Date().getMonth();
  
  // Season-based mock weather
  if (month >= 2 && month <= 4) {
    // Spring (March-May)
    return { condition: 'sunny', temperature: 20, description: 'sunny' };
  } else if (month >= 5 && month <= 7) {
    // Summer (June-August)
    return { condition: 'sunny', temperature: 30, description: 'sunny' };
  } else if (month >= 8 && month <= 10) {
    // Autumn (September-November)
    return { condition: 'cloudy', temperature: 15, description: 'cloudy' };
  } else {
    // Winter (December-February)
    return { condition: 'cloudy', temperature: 5, description: 'cloudy' };
  }
}

export function getSeason() {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}
