import { useTranslation } from 'react-i18next';
import useDachasStore from '../store/useDachasStore';

const REGIONS = [
  'Toshkent viloyati',
  'Toshkent',
  'Buxoro',
  'Samarqand',
  'Farg\'ona',
  'Namangan',
  'Andijon',
  'Xiva',
  'Qarshi',
];

const AMENITIES = [
  'pool',
  'sauna',
  'barbecue',
  'wifi',
  'parking',
  'garden',
  'kitchen',
  'terrace',
  'mountain_view',
  'farm',
];

const DachaFilters = () => {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useDachasStore();

  const handleRegionChange = (e) => {
    setFilters({ region: e.target.value });
  };

  const handleMinPriceChange = (e) => {
    setFilters({ minPrice: Number(e.target.value) });
  };

  const handleMaxPriceChange = (e) => {
    setFilters({ maxPrice: Number(e.target.value) });
  };

  const handleCapacityChange = (e) => {
    setFilters({ minCapacity: Number(e.target.value) });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ amenities: newAmenities });
  };

  const handleReset = () => {
    resetFilters();
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      pool: 'Havuz',
      sauna: 'Sauna',
      barbecue: 'Barbekyu',
      wifi: 'Wi-Fi',
      parking: 'Parking',
      garden: 'Bog\'',
      kitchen: 'Oshxona',
      terrace: 'Terrasa',
      mountain_view: 'Tog\' manzarasi',
      farm: 'Ferma',
    };
    return labels[amenity] || amenity;
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Filterlar</h3>
        <button onClick={handleReset} className="btn btn-sm btn-ghost">
          Tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Region Filter */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Viloyat/Shahar</span>
          </label>
          <select
            value={filters.region}
            onChange={handleRegionChange}
            className="select select-bordered select-sm"
          >
            <option value="">Barchasi</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Narx (so'm/kecha)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
              className="input input-bordered input-sm w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Minimum kishi</span>
          </label>
          <input
            type="number"
            placeholder="Kishi soni"
            value={filters.minCapacity}
            onChange={handleCapacityChange}
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Amenities */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Qulayliklar</span>
          </label>
          <div className="flex flex-wrap gap-1">
            {AMENITIES.slice(0, 5).map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`badge badge-sm cursor-pointer ${
                  filters.amenities.includes(amenity)
                    ? 'badge-primary'
                    : 'badge-outline'
                }`}
              >
                {getAmenityLabel(amenity)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {AMENITIES.slice(5).map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`badge badge-sm cursor-pointer ${
                  filters.amenities.includes(amenity)
                    ? 'badge-primary'
                    : 'badge-outline'
                }`}
              >
                {getAmenityLabel(amenity)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DachaFilters;
