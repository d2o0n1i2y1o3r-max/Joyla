// Google Places API client for geocoding and place search
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function searchPlaces(query, lat, lng) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('[GooglePlaces] GOOGLE_PLACES_API_KEY not set, returning empty results');
    return [];
  }

  try {
    // Use Google Places Text Search API
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.append('query', query);
    
    // Add location bias if coordinates provided
    if (lat && lng) {
      url.searchParams.append('location', `${lat},${lng}`);
      url.searchParams.append('radius', '50000'); // 50km radius
    }
    
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.warn('[GooglePlaces] API returned non-OK status:', data.status);
      return [];
    }

    // Normalize Google Places results to our place object format
    return data.results.map(place => normalizeGooglePlace(place));
  } catch (error) {
    console.error('[GooglePlaces] Error searching places:', error);
    return [];
  }
}

export async function geocodeCity(query) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('[GooglePlaces] GOOGLE_PLACES_API_KEY not set, returning null');
    return null;
  }

  try {
    // Use Google Geocoding API
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', query);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
      name: result.formatted_address || query,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error('[GooglePlaces] Error geocoding city:', error);
    return null;
  }
}

function normalizeGooglePlace(place) {
  // Extract photo URL if available
  let photo = null;
  if (place.photos && place.photos.length > 0) {
    const photoRef = place.photos[0].photo_reference;
    photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`;
  }

  // Infer category from place types
  const category = inferCategory(place.types);

  return {
    id: `google-${place.place_id}`,
    name: place.name,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    photo: photo || null,
    rating: place.rating || 0,
    isOpen: place.opening_hours?.open_now ?? true,
    address: place.formatted_address || '',
    category: category,
    city: extractCity(place),
    isFromApi: true, // Flag to distinguish from local dataset
  };
}

function inferCategory(types) {
  const typeMap = {
    'park': 'nature',
    'natural_feature': 'nature',
    'museum': 'historical',
    'art_gallery': 'historical',
    'tourist_attraction': 'historical',
    'restaurant': 'restaurants',
    'cafe': 'restaurants',
    'bar': 'restaurants',
    'movie_theater': 'entertainment',
    'amusement_park': 'entertainment',
    'spa': 'wellness',
    'health': 'wellness',
  };

  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type];
    }
  }

  return 'nature'; // Default fallback
}

function extractCity(place) {
  // Try to extract city from address components
  if (place.address_components) {
    const cityComponent = place.address_components.find(comp =>
      comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
    );
    if (cityComponent) {
      return cityComponent.long_name;
    }
  }

  // Fallback to formatted address (first part)
  if (place.formatted_address) {
    const parts = place.formatted_address.split(',');
    return parts[0].trim();
  }

  return 'Unknown';
}
