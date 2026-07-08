import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';

const TelegramLoginButton = ({ botUsername = 'JoylaAppBot', onAuthSuccess }) => {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!botUsername) {
      console.error('Bot username is required for Telegram Login Widget');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;
    
    window.onTelegramAuth = (user) => {
      handleAuthSuccess(user);
    };

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Telegram widget script');
      setIsScriptLoaded(false);
    };

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        containerRef.current.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [botUsername]);

  const handleAuthSuccess = async (user) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={containerRef} id="telegram-login-widget" className="flex justify-center">
        {!isScriptLoaded && (
          <div className="loading loading-spinner loading-lg"></div>
        )}
      </div>
      <p className="text-sm text-base-content/70 text-center max-w-md">
        {t('auth.loginWithTelegram')}
      </p>
    </div>
  );
};

export default TelegramLoginButton;
