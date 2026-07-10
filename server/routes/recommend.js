import express from 'express';
import { getWeather, getSeason } from '../services/weatherApi.js';
import { getRecommendation } from '../services/llmClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { lat, lng, places } = req.body;

    if (!places || places.length === 0) {
      return res.status(400).json({ error: 'No places provided' });
    }

    console.log('[Recommend] Request received with', places.length, 'places');

    // Get weather data
    const weather = await getWeather(lat, lng);
    console.log('[Recommend] Weather:', weather);

    // Get current season
    const season = getSeason();
    console.log('[Recommend] Season:', season);

    // Get AI recommendation
    const recommendation = await getRecommendation(weather, season, places);
    console.log('[Recommend] Recommendation:', recommendation);

    // Find the full place object
    const place = places.find(p => p.id === recommendation.placeId);
    if (!place) {
      return res.status(404).json({ error: 'Recommended place not found in places list' });
    }

    res.json({
      place,
      reason: recommendation.reason,
      weather,
      season,
    });
  } catch (error) {
    console.error('[Recommend] Error:', error);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

export default router;
