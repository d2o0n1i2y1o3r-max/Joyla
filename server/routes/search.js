import express from 'express';
import { searchPlaces as searchGooglePlaces, geocodeCity } from '../services/googlePlacesApi.js';

const router = express.Router();

// Search for places globally using Google Places API
router.get('/places', async (req, res) => {
  try {
    const { query, lat, lng } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log('[Search] Places search request:', query, 'at', lat, lng);

    // Call Google Places API
    const places = await searchGooglePlaces(query, lat, lng);

    res.json({ places });
  } catch (error) {
    console.error('[Search] Error searching places:', error);
    res.status(500).json({ error: 'Failed to search places' });
  }
});

// Geocode a city name to coordinates
router.get('/geocode', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log('[Search] Geocode request:', query);

    // Call Google Geocoding API
    const result = await geocodeCity(query);

    if (!result) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('[Search] Error geocoding city:', error);
    res.status(500).json({ error: 'Failed to geocode city' });
  }
});

export default router;
