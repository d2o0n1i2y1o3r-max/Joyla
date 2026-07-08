import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import TelegramOtpLogin from './TelegramOtpLogin';

const AuthGate = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full mx-4">
          <div className="card-body items-center text-center">
            <img src="/logo.svg" alt="Joyla Logo" className="w-24 h-24 mb-4" />
            <h1 className="card-title text-3xl font-bold mb-2">{t('app.name')}</h1>
            <p className="text-base-content/70 mb-6">{t('app.tagline')}</p>
            
            <div className="w-full">
              <TelegramOtpLogin />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGate;
