import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  teamId: string;
  avatar?: string;
  lastActive?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  leader: string; // Team leader's ID
  members: string[]; // Array of member IDs
  createdAt: string;
  status: 'active' | 'inactive';
  performance?: {
    completedTasks: number;
    onTimeDelivery: number;
    rating: number;
  };
}

interface TeamState {
  teams: Team[];
  members: TeamMember[];
  selectedTeam: string | null;
  isLoaded: boolean;

  // Team actions
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  setSelectedTeam: (id: string | null) => void;

  // Member actions
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, data: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  
  // Team member management
  assignMemberToTeam: (memberId: string, teamId: string) => void;
  removeMemberFromTeam: (memberId: string, teamId: string) => void;
  
  // Performance tracking
  updateTeamPerformance: (teamId: string, performance: Team['performance']) => void;
  
  // Utilities
  getTeamMembers: (teamId: string) => TeamMember[];
  getTeamLeader: (teamId: string) => TeamMember | undefined;
  getMemberTeams: (memberId: string) => Team[];
  
  setIsLoaded: (loaded: boolean) => void;
  reset: () => void;
}

const initialState = {
  teams: [],
  members: [],
  selectedTeam: null,
  isLoaded: false,
};

export const useTeamStore = create<TeamState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addTeam: (teamData) => set((state) => {
          const newTeam: Team = {
            ...teamData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
          };
          return { teams: [...state.teams, newTeam] };
        }),

        updateTeam: (id, data) => set((state) => ({
          teams: state.teams.map(team => 
            team.id === id ? { ...team, ...data } : team
          ),
        })),

        removeTeam: (id) => set((state) => ({
          teams: state.teams.filter(team => team.id !== id),
        })),

        setSelectedTeam: (id) => set({ selectedTeam: id }),

        addMember: (memberData) => set((state) => {
          const newMember: TeamMember = {
            ...memberData,
            id: Math.random().toString(36).substr(2, 9),
          };
          return { members: [...state.members, newMember] };
        }),

        updateMember: (id, data) => set((state) => ({
          members: state.members.map(member =>
            member.id === id ? { ...member, ...data } : member
          ),
        })),

        removeMember: (id) => set((state) => ({
          members: state.members.filter(member => member.id !== id),
          teams: state.teams.map(team => ({
            ...team,
            members: team.members.filter(memberId => memberId !== id),
          })),
        })),

        assignMemberToTeam: (memberId, teamId) => set((state) => ({
          teams: state.teams.map(team =>
            team.id === teamId && !team.members.includes(memberId)
              ? { ...team, members: [...team.members, memberId] }
              : team
          ),
        })),

        removeMemberFromTeam: (memberId, teamId) => set((state) => ({
          teams: state.teams.map(team =>
            team.id === teamId
              ? { ...team, members: team.members.filter(id => id !== memberId) }
              : team
          ),
        })),

        updateTeamPerformance: (teamId, performance) => set((state) => ({
          teams: state.teams.map(team =>
            team.id === teamId ? { ...team, performance } : team
          ),
        })),

        getTeamMembers: (teamId) => {
          const state = get();
          const team = state.teams.find(t => t.id === teamId);
          return team ? state.members.filter(m => team.members.includes(m.id)) : [];
        },

        getTeamLeader: (teamId) => {
          const state = get();
          const team = state.teams.find(t => t.id === teamId);
          return team ? state.members.find(m => m.id === team.leader) : undefined;
        },

        getMemberTeams: (memberId) => {
          const state = get();
          return state.teams.filter(team => 
            team.members.includes(memberId) || team.leader === memberId
          );
        },

        setIsLoaded: (loaded) => set({ isLoaded: loaded }),

        reset: () => set(initialState),
      }),
      {
        name: 'team-storage',
      }
    )
  )
);
