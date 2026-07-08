import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOnboardingStore = create(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      currentStep: 0,
      isRunning: false,
      
      setHasSeenOnboarding: (hasSeen) => set({ hasSeenOnboarding: hasSeen }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsRunning: (isRunning) => set({ isRunning }),
      startOnboarding: () => set({ isRunning: true, currentStep: 0 }),
      stopOnboarding: () => set({ isRunning: false, currentStep: 0 }),
      completeOnboarding: () => set({ 
        hasSeenOnboarding: true, 
        isRunning: false, 
        currentStep: 0 
      }),
    }),
    {
      name: 'joyla-onboarding',
    }
  )
);
