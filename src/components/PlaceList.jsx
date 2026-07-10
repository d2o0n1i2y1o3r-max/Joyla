import PlaceCard from './PlaceCard';
import { usePlacesStore } from '../store/usePlacesStore';
import { useLocationStore } from '../store/useLocationStore';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const PlaceList = () => {
  const { filteredPlaces, apiPlaces, isLoading } = usePlacesStore();
  const { location, manualCity } = useLocationStore();

  console.log('[PlaceList] Rendering with filteredPlaces:', filteredPlaces.map(p => p.name));
  console.log('[PlaceList] API places:', apiPlaces.map(p => p.name));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const userLocation = location || manualCity;
  
  // Calculate distances for local places
  const localPlacesWithDistance = filteredPlaces.map(place => ({
    ...place,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : Infinity
  }));

  const sortedLocalPlaces = [...localPlacesWithDistance].sort((a, b) => a.distance - b.distance);
  const nearestPlaceId = sortedLocalPlaces[0]?.id;

  // Calculate distances for API places
  const apiPlacesWithDistance = apiPlaces.map(place => ({
    ...place,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : Infinity
  }));

  const sortedApiPlaces = [...apiPlacesWithDistance].sort((a, b) => a.distance - b.distance);

  const hasLocalResults = sortedLocalPlaces.length > 0;
  const hasApiResults = sortedApiPlaces.length > 0;

  if (!hasLocalResults && !hasApiResults) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No places found</h3>
        <p className="text-base-content/70">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Local Results */}
      {hasLocalResults && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedLocalPlaces.map((place) => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                isNearest={place.id === nearestPlaceId}
              />
            ))}
          </div>
        </>
      )}

      {/* API Results Divider */}
      {hasLocalResults && hasApiResults && (
        <div className="flex items-center gap-4 py-2">
          <div className="h-px bg-base-300 flex-1"></div>
          <span className="text-sm text-base-content/50 font-medium">
            Boshqa manbalardan topilgan joylar
          </span>
          <div className="h-px bg-base-300 flex-1"></div>
        </div>
      )}

      {/* API Results */}
      {hasApiResults && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedApiPlaces.map((place) => (
            <PlaceCard 
              key={place.id} 
              place={place} 
              isNearest={false}
              isFromApi={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceList;
