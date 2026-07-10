const SeasonalBadge = ({ bestSeason }) => {
  if (bestSeason !== 'spring') return null;

  return (
    <div className="badge badge-primary badge-sm gap-1">
      <span>🌷</span>
      <span>Bahorda chiroyli</span>
    </div>
  );
};

export default SeasonalBadge;
