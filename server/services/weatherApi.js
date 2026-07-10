// OpenWeatherMap API client
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeather(lat, lng) {
  if (!WEATHER_API_KEY) {
    console.warn('[Weather] ⚠️  OPENWEATHER_API_KEY not set in server/.env');
    console.log('[Weather] Using mock weather data (You need to add OPENWEATHER_API_KEY)');
    return getMockWeather();
  }

  try {
    console.log('[Weather] Fetching real weather from OpenWeatherMap...');
    const url = `${WEATHER_BASE_URL}?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
    console.log('[Weather] Request URL (key redacted):', url.replace(WEATHER_API_KEY, '***'));
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Weather] API error:', response.status, errorBody);
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Weather] ✓ Real weather fetched:', JSON.stringify(data.weather[0]));

    return {
      condition: getWeatherCondition(data.weather[0].main, data.weather[0].description),
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
    };
  } catch (error) {
    console.error('[Weather] ❌ Error fetching weather:', error.message);
    console.log('[Weather] Falling back to mock weather data');
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
