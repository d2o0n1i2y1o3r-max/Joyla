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
  const { filteredPlaces, isLoading } = usePlacesStore();
  const { location, manualCity } = useLocationStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No places found</h3>
        <p className="text-base-content/70">Try adjusting your search or filters</p>
      </div>
    );
  }

  const userLocation = location || manualCity;
  
  // Calculate distances and sort
  const placesWithDistance = filteredPlaces.map(place => ({
    ...place,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : Infinity
  }));

  const sortedPlaces = [...placesWithDistance].sort((a, b) => a.distance - b.distance);
  const nearestPlaceId = sortedPlaces[0]?.id;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {sortedPlaces.map((place) => (
        <PlaceCard 
          key={place.id} 
          place={place} 
          isNearest={place.id === nearestPlaceId}
        />
      ))}
    </div>
  );
};

export default PlaceList;
