import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PageSwitcherFab = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { path: '/', icon: '🏠', label: 'Bosh sahifa' },
    { path: '/dachas', icon: '🏡', label: 'Dachalar' },
    { path: '/family', icon: '👨‍👩‍👧‍👦', label: 'Oilaviy' },
    { path: '/favorites', icon: '❤️', label: 'Sevimlilar' },
    { path: '/about', icon: 'ℹ️', label: 'Biz haqimizda' },
  ];

  const handlePageClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-2">
          {pages.map((page) => (
            <button
              key={page.path}
              onClick={() => handlePageClick(page.path)}
              className="btn btn-circle btn-lg bg-base-200 hover:bg-base-300 shadow-lg border-2 border-primary/20 transition-all duration-300"
              title={page.label}
            >
              <span className="text-2xl">{page.icon}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle btn-lg shadow-lg transition-all duration-300 ${
          isOpen ? 'btn-primary rotate-45' : 'btn-secondary'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default PageSwitcherFab;
