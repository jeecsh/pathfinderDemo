import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrgState {
  orgName: string;
  orgLogo: string | null;
  colorTheme: string;
  dataAnalyticsEnabled: boolean;
  shareDataAnalytics: boolean;
  isLoaded: boolean;
  
  setOrgData: (data: { 
    orgName: string;
    orgLogo: string | null;
    colorTheme: string;
  }) => void;
  setOrgName: (name: string) => void;
  setOrgLogo: (logo: string | null) => void;
  setColorTheme: (theme: string) => void;
  setDataAnalyticsEnabled: (enabled: boolean) => void;
  setShareDataAnalytics: (share: boolean) => void;
  setIsLoaded: (loaded: boolean) => void;
  reset: () => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      // Initial state
      orgName: 'My Organization',
      orgLogo: null,
      colorTheme: '#0891b2', // Default cyan color
      dataAnalyticsEnabled: true,
      shareDataAnalytics: false,
      isLoaded: false,

      // Actions
      setOrgData: (data) => {
        console.log('Setting org data:', data);
        set({ 
          ...data,
          isLoaded: true 
        });
      },
      setOrgName: (name) => set({ orgName: name }),
      setOrgLogo: (logo) => set({ orgLogo: logo }),
      setColorTheme: (theme) => set({ colorTheme: theme }),
      setDataAnalyticsEnabled: (enabled) => set({ dataAnalyticsEnabled: enabled }),
      setShareDataAnalytics: (share) => set({ shareDataAnalytics: share }),
      setIsLoaded: (loaded) => set({ isLoaded: loaded }),
      
      reset: () => {
        console.log('Resetting org store');
        set({
          orgName: 'My Organization',
          orgLogo: null,
          colorTheme: '#0891b2',
          dataAnalyticsEnabled: true,
          shareDataAnalytics: false,
          isLoaded: false,
        });
      }
    }),
    {
      name: 'org-storage',
    }
  )
);
