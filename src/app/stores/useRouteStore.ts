import { create } from 'zustand';

interface Route {
  color: string;
  name: string;
  organization_id: string;
  path: [number, number][];
}

interface RouteState {
  routes: Route[];
  currentRoute: Route | null;
  selectedPoints: [number, number][];
  setSelectedPoints: (points: [number, number][]) => void;
  addPoint: (lat: number, lng: number) => void;
  clearPoints: () => void;
  saveRoute: (name: string, color: string, organization_id: string) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  routes: [],
  currentRoute: null,
  selectedPoints: [],
  
  setSelectedPoints: (points) => set({ selectedPoints: points }),
  
  addPoint: (lat, lng) => set((state) => {
    if (state.selectedPoints.length >= 20) {
      return state; // Maximum points reached
    }
    return {
      selectedPoints: [...state.selectedPoints, [lat, lng] as [number, number]]
    };
  }),
  
  clearPoints: () => set({ selectedPoints: [] }),
  
  saveRoute: (name, color, organization_id) => set((state) => ({
    routes: [
      ...state.routes,
      {
        name,
        color,
        organization_id,
        path: state.selectedPoints
      }
    ],
    selectedPoints: [] // Clear points after saving
  }))
}));
