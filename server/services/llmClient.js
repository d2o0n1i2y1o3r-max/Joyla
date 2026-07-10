// Anthropic Claude API client for AI recommendations
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function getRecommendation(weather, season, places) {
  if (!ANTHROPIC_API_KEY) {
    console.warn('[LLM] ANTHROPIC_API_KEY not set, using fallback logic');
    return getFallbackRecommendation(weather, season, places);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Today's weather: ${weather.condition}, ${weather.temperature}°C. Current season: ${season}.

Here is a list of available places:
${JSON.stringify(places, null, 2)}

Recommend the ONE best place to visit today, considering the weather and season (e.g. avoid recommending an outdoor park on a rainy day; prefer indoor venues or covered areas in bad weather; prefer tulip fields/gardens in spring; avoid recommending places whose bestSeason doesn't match if a better-matching option exists).

Respond in JSON format only, with this exact structure:
{
  "placeId": "...",
  "reason": "short explanation in Uzbek of why this place fits today's weather/season"
}

Do not include any other text in your response.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse LLM response as JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[LLM] Error getting recommendation:', error);
    return getFallbackRecommendation(weather, season, places);
  }
}

function getFallbackRecommendation(weather, season, places) {
  // Fallback logic when API key is not available or API fails
  // This is still weather/season-aware, not random
  
  let filteredPlaces = [...places];
  
  // Filter based on weather
  if (weather.condition === 'rainy' || weather.condition === 'stormy') {
    // Prefer indoor places in bad weather
    const indoorPlaces = places.filter(p => 
      p.category === 'restaurants' || p.category === 'entertainment'
    );
    if (indoorPlaces.length > 0) {
      filteredPlaces = indoorPlaces;
    }
  } else if (weather.condition === 'sunny' && weather.temperature > 25) {
    // Prefer outdoor places in nice weather
    const outdoorPlaces = places.filter(p => 
      p.category === 'nature' || p.category === 'historical'
    );
    if (outdoorPlaces.length > 0) {
      filteredPlaces = outdoorPlaces;
    }
  }
  
  // Filter based on season
  if (season === 'spring') {
    const springPlaces = filteredPlaces.filter(p => p.bestSeason === 'spring');
    if (springPlaces.length > 0) {
      filteredPlaces = springPlaces;
    }
  } else if (season === 'summer') {
    const summerPlaces = filteredPlaces.filter(p => 
      p.bestSeason === 'summer' || p.category === 'nature'
    );
    if (summerPlaces.length > 0) {
      filteredPlaces = summerPlaces;
    }
  }
  
  // Pick the highest-rated place from filtered results
  const sortedPlaces = filteredPlaces.sort((a, b) => b.rating - a.rating);
  const recommendedPlace = sortedPlaces[0] || places[0];
  
  // Generate reasoning in Uzbek
  let reason = '';
  if (weather.condition === 'rainy' || weather.condition === 'stormy') {
    reason = `Bugun yomg'irli (${weather.condition}), ${weather.temperature}°C — shuning uchun yopiq joy — ${recommendedPlace.name} tavsiya qilinadi`;
  } else if (weather.condition === 'sunny') {
    reason = `Bugun ochiq havoda, ${weather.temperature}°C — shuning uchun ${recommendedPlace.name} tavsiya qilinadi`;
  } else {
    reason = `Bugun ${weather.condition} ob-havo, ${weather.temperature}°C — ${recommendedPlace.name} uchun yaxshi kun`;
  }
  
  if (season === 'spring' && recommendedPlace.bestSeason === 'spring') {
    reason += ' va bu joy bahorda ayniqsa chiroyli';
  }
  
  return {
    placeId: recommendedPlace.id,
    reason: reason,
  };
}
