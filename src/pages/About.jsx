import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uz' ? 'ru' : 'uz';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a onClick={() => navigate('/')}>{t('nav.home')}</a></li>
              <li><a onClick={() => navigate('/dachas')}>{t('nav.dachas')}</a></li>
              <li><a onClick={() => navigate('/family')}>{t('nav.family')}</a></li>
              <li><a onClick={() => navigate('/favorites')}>{t('nav.favorites')}</a></li>
              <li><a onClick={() => navigate('/about')}>{t('nav.about')}</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl gap-2">
            <img src="/logo.svg" alt="Joyla Logo" className="w-8 h-8" />
            <span className="font-bold">{t('app.name')}</span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={() => navigate('/')} className="font-medium">{t('nav.home')}</a></li>
            <li><a onClick={() => navigate('/dachas')} className="font-medium">{t('nav.dachas')}</a></li>
            <li><a onClick={() => navigate('/family')} className="font-medium">{t('nav.family')}</a></li>
            <li><a onClick={() => navigate('/favorites')} className="font-medium">{t('nav.favorites')}</a></li>
            <li><a onClick={() => navigate('/about')} className="font-medium">{t('nav.about')}</a></li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button onClick={toggleLanguage} className="btn btn-ghost btn-sm">
            {i18n.language === 'uz' ? '🇺🇿 UZ' : '🇷🇺 RU'}
          </button>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('nav.about')}</h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Biz haqimizda?</h2>
              <p className="text-base-content/80 leading-relaxed">
                <strong>Joylar</strong> — bu O'zbekiston bo'ylab qiziqarli joylarni kashf etish uchun yaratilgan ilova. 
                Sizga yaqin tabiat obidalari, tarixiy joylar, restoranlar va dam olish maskanlarini topishda yordam beradi.
              </p>
              <p className="text-base-content/80 leading-relaxed mt-4">
                Bizning maqsadimiz — odamlarga o'z shahrida yoki tashrif buyurgan joylarda qayerga borishni bilmasa, 
                qiziqarli va unutilmas joylarni topish imkoniyatini berishdir. Ayniqsa, oilaviy dam olish, piknik va 
                tabiat qo'yniga chiqishni yaxshi ko'radiganlar uchun.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Nima uchun Joylar?</h2>
              <ul className="list-disc list-inside space-y-2 text-base-content/80">
                <li>Geolokatsiya orqali avtomatik ravishda yaqin joylarni topish</li>
                <li>Turli kategoriyalar bo'yicha filtr: tabiat, tarixiy joylar, restoranlar va boshqalar</li>
                <li>3D interaktiv kartalar bilan joylarni vizual ko'rish</li>
                <li>Dachalar va oilaviy piknik joylari uchun maxsus bo'limlar</li>
                <li>Sevimli joylarni saqlash imkoniyati</li>
                <li>O'zbek va rus tillarida qo'llab-quvvatlash</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Kim yaratdi?</h2>
              <p className="text-base-content/80 leading-relaxed">
                Bu ilovani <strong>Doniyor</strong> yaratdi. O'zbekistonning go'zal joylarini odamlarga ko'rsatish 
                va dam olish madaniyatini rivojlantirish maqsadida ishlab chiqildi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Aloqa</h2>
              <p className="text-base-content/80 leading-relaxed mb-4">
                Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning:
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://t.me/JoylaAppBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-outline gap-2 w-fit"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Telegram Bot
                </a>
                <a
                  href="mailto:doniyor@joyla.uz"
                  className="btn btn-ghost btn-outline gap-2 w-fit"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  doniyor@joyla.uz
                </a>
              </div>
            </section>

            <section className="bg-base-200 rounded-lg p-6 mt-8">
              <p className="text-center text-base-content/70">
                © 2024 Joylar. Barcha huquqlar himoyalangan.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
