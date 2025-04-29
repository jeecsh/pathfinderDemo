import { create } from 'zustand';

type UserRole = 'admin' | 'manager' | 'viewer' | 'driver' | 'mobile';

export interface TeamMember {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  name?: string;
  phone?: string;
}

interface UserState {
  teamMembers: TeamMember[];
  
  addTeamMember: (member: Omit<TeamMember, 'permissions' | 'id'>) => void;
  removeTeamMember: (id: string) => void;
  getTeamMembersByRole: (roles: UserRole[]) => TeamMember[];
  reset: () => void;
}

const getRolePermissions = (role: UserRole): string[] => {
  const permissions = {
    admin: [
      'manage_users',
      'manage_vehicles',
      'view_analytics',
      'manage_settings',
      'manage_billing',
      'export_data',
    ],
    manager: [
      'view_analytics',
      'manage_vehicles',
      'export_data',
    ],
    viewer: [
      'view_analytics',
    ],
    driver: [
      'view_assigned_vehicles',
      'update_vehicle_status',
      'report_incidents',
    ],
    mobile: [
      'mobile_access',
      'view_analytics_limited',
      'receive_notifications',
    ],
  };
  
  return permissions[role] || [];
};

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  teamMembers: [],

  // Actions
  addTeamMember: (member) => set((state) => ({
    teamMembers: [
      ...state.teamMembers,
      {
        ...member,
        id: Math.random().toString(36).substring(2, 11),
        permissions: getRolePermissions(member.role),
      },
    ],
  })),

  removeTeamMember: (id) => set((state) => ({
    teamMembers: state.teamMembers.filter((member) => member.id !== id),
  })),

  getTeamMembersByRole: (roles) => {
    return get().teamMembers.filter((member) => roles.includes(member.role));
  },

  reset: () => set({ teamMembers: [] }),
}));
