import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslation } from 'react-i18next';
import { useOnboardingStore } from '../store/useOnboardingStore';

const OnboardingTour = () => {
  const { t } = useTranslation();
  const { hasSeenOnboarding, isRunning, startOnboarding, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    if (!hasSeenOnboarding) {
      startOnboarding();
    }
  }, [hasSeenOnboarding, startOnboarding]);

  useEffect(() => {
    if (!isRunning || hasSeenOnboarding) return;

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#search-input',
          popover: {
            title: t('onboarding.search'),
            description: '',
          },
        },
        {
          element: '.category-filter',
          popover: {
            title: t('onboarding.categories'),
            description: '',
          },
        },
        {
          element: '#view-toggle',
          popover: {
            title: t('onboarding.mapToggle'),
            description: '',
          },
        },
        {
          element: '.place-card',
          popover: {
            title: t('onboarding.directions'),
            description: '',
          },
        },
      ],
      onCloseClick: () => {
        completeOnboarding();
      },
      onNextClick: () => {
        // Continue to next step
      },
      onPrevClick: () => {
        // Go to previous step
      },
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [isRunning, hasSeenOnboarding, completeOnboarding, t]);

  return null;
};

export default OnboardingTour;
