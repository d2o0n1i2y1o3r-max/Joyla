import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Proxy to Google Places API
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          type: type || 'point_of_interest',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Google Places API error:', error);
    res.status(500).json({ error: 'Failed to fetch places from Google Places API' });
  }
});

// Proxy to 2GIS API (fallback for better Uzbekistan coverage)
router.get('/2gis', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await axios.get(
      `https://catalog.api.2gis.com/3.0/items`,
      {
        params: {
          q: type || 'place',
          point: `${lng},${lat}`,
          radius,
          fields: 'items.geometry,items.name,items.description,items.address',
          key: process.env.TWOGIS_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('2GIS API error:', error);
    res.status(500).json({ error: 'Failed to fetch places from 2GIS API' });
  }
});

// Get place details with photos
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { source = 'google' } = req.query;

    if (source === 'google') {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'name,photos,formatted_address,rating,opening_hours,geometry',
            key: process.env.GOOGLE_PLACES_API_KEY,
          },
        }
      );
      res.json(response.data);
    } else {
      // 2GIS details endpoint
      const response = await axios.get(
        `https://catalog.api.2gis.com/3.0/items/${placeId}`,
        {
          params: {
            fields: 'items.name,items.description,items.photos,items.address,items.rating',
            key: process.env.TWOGIS_API_KEY,
          },
        }
      );
      res.json(response.data);
    }
  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

export default router;
