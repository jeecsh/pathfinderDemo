import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface DemoVehicle {
  id: string;
  name: string;
  type: 'car' | 'truck' | 'van' | 'bus';
  licensePlate: string;
  model: string;
  year: string;
  vin: string;
  trackingDevice: {
    type: 'GPS' | 'IoT';
    serialNumber: string;
  };
}

export interface DemoUser {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer' | 'driver' | 'mobile';
  phone?: string;
}

interface DemoState {
  billingData: {
    trackingType: string;
    countingType: string;
    mobileAppEnabled: boolean;
    announcementEnabled: boolean;
    notificationEnabled: boolean;
    feedbackEnabled: boolean;
    hardwareQuantity: number;
    selectedHardware: string | null;
  };
  orgData: {
    orgName: string;
    orgLogo: string;
    colorTheme: string;
    shareDataAnalytics: boolean;
  };
  usersList: DemoUser[];
  vehiclesList: DemoVehicle[];
  setBillingData: (data: Partial<DemoState['billingData']>) => void;
  setOrgData: (data: Partial<DemoState['orgData']>) => void;
  addUser: (user: Omit<DemoUser, 'id'>) => void;
  removeUser: (id: string) => void;
  addVehicle: (vehicle: Omit<DemoVehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;
  clearDemoData: () => void;
}

const initialState = {
  billingData: {
    trackingType: '',
    countingType: '',
    mobileAppEnabled: false,
    announcementEnabled: false,
    notificationEnabled: false,
    feedbackEnabled: false,
    hardwareQuantity: 1,
    selectedHardware: null,
  },
  orgData: {
    orgName: '',
    orgLogo: '',
    colorTheme: 'Default',
    shareDataAnalytics: false,
  },
  usersList: [],
  vehiclesList: []
};

export const useDemoStore = create<DemoState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setBillingData: (data) => set((state) => ({
          billingData: { ...state.billingData, ...data }
        })),
        setOrgData: (data) => set((state) => ({
          orgData: { ...state.orgData, ...data }
        })),
        addUser: (user) => set((state) => ({
          usersList: [...state.usersList, { ...user, id: Math.random().toString(36).substr(2, 9) }]
        })),
        removeUser: (id) => set((state) => ({
          usersList: state.usersList.filter(user => user.id !== id)
        })),
        addVehicle: (vehicle) => set((state) => ({
          vehiclesList: [...state.vehiclesList, { ...vehicle, id: Math.random().toString(36).substr(2, 9) }]
        })),
        removeVehicle: (id) => set((state) => ({
          vehiclesList: state.vehiclesList.filter(vehicle => vehicle.id !== id)
        })),
        clearDemoData: () => set(initialState),
      }),
      {
        name: 'demo-storage',
      }
    )
  )
);
