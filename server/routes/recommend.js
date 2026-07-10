import express from 'express';
import { getWeather, getSeason } from '../services/weatherApi.js';
import { getRecommendation } from '../services/llmClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { lat, lng, places } = req.body;

    if (!places || places.length === 0) {
      console.error('[Recommend] No places provided in request');
      return res.status(400).json({ error: 'No places provided' });
    }

    console.log('[Recommend] ========== REQUEST START ==========');
    console.log('[Recommend] Request received with', places.length, 'places');
    console.log('[Recommend] Location:', { lat, lng });

    // Step 1: Get weather data
    console.log('[Recommend] Step 1: Fetching weather data...');
    const weather = await getWeather(lat, lng);
    console.log('[Recommend] Step 1 SUCCESS - Weather:', JSON.stringify(weather));

    // Step 2: Get current season
    console.log('[Recommend] Step 2: Computing current season...');
    const season = getSeason();
    console.log('[Recommend] Step 2 SUCCESS - Season:', season);

    // Step 3: Get AI recommendation
    console.log('[Recommend] Step 3: Getting AI recommendation from LLM...');
    console.log('[Recommend] Step 3 - Sending to LLM:', places.length, 'places, weather:', weather.condition, 'season:', season);
    const recommendation = await getRecommendation(weather, season, places);
    console.log('[Recommend] Step 3 SUCCESS - Recommendation:', JSON.stringify(recommendation));

    // Step 4: Validate recommendation
    console.log('[Recommend] Step 4: Validating recommendation...');
    if (!recommendation.placeId) {
      console.error('[Recommend] Step 4 FAILED - Recommendation missing placeId:', recommendation);
      return res.status(422).json({ error: 'Invalid recommendation structure (missing placeId)', detail: recommendation });
    }

    // Step 5: Find the full place object
    console.log('[Recommend] Step 5: Finding place object for placeId:', recommendation.placeId);
    const place = places.find(p => p.id === recommendation.placeId);
    if (!place) {
      console.error('[Recommend] Step 5 FAILED - Place not found. Available IDs:', places.map(p => p.id));
      return res.status(404).json({ error: 'Recommended place not found in places list', placeId: recommendation.placeId });
    }
    console.log('[Recommend] Step 5 SUCCESS - Found place:', place.name);

    console.log('[Recommend] ========== REQUEST SUCCESS ==========');
    res.json({
      place,
      reason: recommendation.reason,
      weather,
      season,
    });
  } catch (error) {
    console.error('[Recommend] ========== REQUEST FAILED ==========');
    console.error('[Recommend] Error type:', error.constructor.name);
    console.error('[Recommend] Error message:', error.message);
    console.error('[Recommend] Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to get recommendation', detail: error.message });
  }
});

export default router;
