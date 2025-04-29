import { create } from 'zustand';

interface BillingState {
  trackingType: string;
  countingType: string;
  countingEnabled: boolean;
  mobileAppEnabled: boolean;
  announcementEnabled: boolean;
  notificationEnabled: boolean;
  feedbackEnabled: boolean;
  hardwareQuantity: number;
  selectedHardware: string | null;
  hybridAcknowledged: boolean;
  
  // Actions
  setTrackingType: (type: string) => void;
  setCountingType: (type: string) => void;
  setCountingEnabled: (enabled: boolean) => void;
  setMobileAppEnabled: (enabled: boolean) => void;
  setAnnouncementEnabled: (enabled: boolean) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setFeedbackEnabled: (enabled: boolean) => void;
  setHardwareQuantity: (quantity: number) => void;
  setSelectedHardware: (hardware: string | null) => void;
  setHybridAcknowledged: (acknowledged: boolean) => void;
  reset: () => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  // Initial state
  trackingType: '',
  countingType: '',
  countingEnabled: false,
  mobileAppEnabled: false,
  announcementEnabled: false,
  notificationEnabled: false,
  feedbackEnabled: false,
  hardwareQuantity: 1,
  selectedHardware: null,
  hybridAcknowledged: false,

  // Actions
  setTrackingType: (type) => set(() => ({ 
    trackingType: type,
    countingType: '', // Reset counting type when changing tracking type
    countingEnabled: false, // Reset counting enabled
    selectedHardware: null, // Reset hardware selection
    mobileAppEnabled: type === 'software', // Mobile app required for software
    hybridAcknowledged: false // Reset hybrid acknowledgment
  })),
  
  setCountingType: (type) => set((state) => {
    // Only allow QR code for software solution unless hybrid is acknowledged
    if (state.trackingType === 'software' && type !== 'qr_code' && !state.hybridAcknowledged) {
      return state;
    }
    return { 
      countingType: type,
      selectedHardware: null, // Reset hardware selection when changing counting type
      countingEnabled: Boolean(type) // Enable counting if type is set
    };
  }),
  
  setCountingEnabled: (enabled) => set((state) => ({
    countingEnabled: enabled,
    countingType: enabled ? state.countingType : '', // Reset counting type if disabled
    selectedHardware: enabled ? state.selectedHardware : null // Reset hardware if disabled
  })),
  
  setMobileAppEnabled: (enabled) => set({ mobileAppEnabled: enabled }),
  setAnnouncementEnabled: (enabled) => set({ announcementEnabled: enabled }),
  setNotificationEnabled: (enabled) => set({ notificationEnabled: enabled }),
  setFeedbackEnabled: (enabled) => set({ feedbackEnabled: enabled }),
  setHardwareQuantity: (quantity) => set({ hardwareQuantity: quantity }),
  setSelectedHardware: (hardware) => set({ selectedHardware: hardware }),
  setHybridAcknowledged: (acknowledged) => set({ hybridAcknowledged: acknowledged }),
  
  reset: () => set({
    trackingType: '',
    countingType: '',
    countingEnabled: false,
    mobileAppEnabled: false,
    announcementEnabled: false,
    notificationEnabled: false,
    feedbackEnabled: false,
    hardwareQuantity: 1,
    selectedHardware: null,
    hybridAcknowledged: false
  })
}));
