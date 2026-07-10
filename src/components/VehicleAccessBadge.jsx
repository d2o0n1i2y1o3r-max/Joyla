const VehicleAccessBadge = ({ vehicleAccess }) => {
  const getBadgeInfo = () => {
    switch (vehicleAccess) {
      case 'sedan':
        return {
          icon: '🚗',
          label: 'Har qanday mashinada borish mumkin',
          className: 'badge-success',
        };
      case 'suv_recommended':
        return {
          icon: '🚙',
          label: 'SUV tavsiya etiladi',
          className: 'badge-warning',
        };
      case 'on_foot_only':
        return {
          icon: '🚶',
          label: 'Faqat piyoda',
          className: 'badge-error',
        };
      default:
        return {
          icon: '🚗',
          label: 'Mashinada borish mumkin',
          className: 'badge-neutral',
        };
    }
  };

  const { icon, label, className } = getBadgeInfo();

  return (
    <div className={`badge badge-sm gap-1 ${className}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default VehicleAccessBadge;
