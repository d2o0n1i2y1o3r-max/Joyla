import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const TelegramOtpLogin = () => {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'JoylaAppBot';

  useEffect(() => {
    // Generate random session ID
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
  }, []);

  const handleOpenBot = () => {
    const deepLink = `https://t.me/${botUsername}?start=${sessionId}`;
    window.open(deepLink, '_blank');
    setIsCodeSent(true);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[Frontend] Sending OTP verification request:', { sessionId, code });
      
      const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, code }),
      });

      console.log('[Frontend] Response status:', response.status);
      
      const data = await response.json();
      console.log('[Frontend] Response data:', data);

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('[Frontend] OTP verification error:', err);
      setError(`Error: ${err.message}. Is the backend server running on port 3001?`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsLoading(true);

    try {
      console.log('[Frontend] Sending OTP resend request:', { sessionId });
      
      const response = await fetch('http://localhost:3001/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      console.log('[Frontend] Resend response status:', response.status);
      
      const data = await response.json();
      console.log('[Frontend] Resend response data:', data);

      if (response.ok) {
        setError('');
        setCode('');
        // Focus back on input after resend
        setTimeout(() => {
          const input = document.querySelector('input[type="text"]');
          if (input) input.focus();
        }, 100);
      } else {
        setError(data.error || 'Resend failed');
      }
    } catch (err) {
      console.error('[Frontend] OTP resend error:', err);
      setError(`Error: ${err.message}. Is the backend server running on port 3001?`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <button
        onClick={handleOpenBot}
        className="btn btn-primary btn-lg gap-2 w-full max-w-xs"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
        Open Telegram Bot
      </button>

      {isCodeSent && (
        <form onSubmit={handleVerify} className="w-full max-w-xs space-y-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter 6-digit code</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="input input-bordered input-lg text-center text-2xl tracking-widest"
              maxLength={6}
              required
              autoFocus
              style={{ pointerEvents: 'auto' }}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : 'Verify'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="btn btn-ghost btn-sm w-full"
            disabled={isLoading}
          >
            Resend code
          </button>
        </form>
      )}

      <p className="text-sm text-base-content/70 text-center max-w-md">
        {t('auth.loginWithTelegram')}
      </p>
    </div>
  );
};

export default TelegramOtpLogin;
