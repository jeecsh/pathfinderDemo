import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssueType = 'bug' | 'feature' | 'incident' | 'maintenance' | 'other';

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  assignedTo?: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  attachments?: string[];
  relatedVehicles?: string[];
  relatedTeams?: string[];
}

interface IssueState {
  issues: Issue[];
  comments: IssueComment[];
  selectedIssue: string | null;

  // Issue actions
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, data: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  setSelectedIssue: (id: string | null) => void;

  // Comment actions
  addComment: (comment: Omit<IssueComment, 'id' | 'createdAt'>) => void;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;

  // Filters and queries
  getIssuesByStatus: (status: IssueStatus) => Issue[];
  getIssuesByPriority: (priority: IssuePriority) => Issue[];
  getIssuesByAssignee: (userId: string) => Issue[];
  getIssueComments: (issueId: string) => IssueComment[];
  getIssuesStats: () => {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: Record<IssuePriority, number>;
    byType: Record<IssueType, number>;
  };

  reset: () => void;
}

const initialState = {
  issues: [],
  comments: [],
  selectedIssue: null,
};

export const useIssueStore = create<IssueState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addIssue: (issueData) => set((state) => ({
          issues: [...state.issues, {
            ...issueData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
        })),

        updateIssue: (id, data) => set((state) => ({
          issues: state.issues.map(issue =>
            issue.id === id
              ? {
                  ...issue,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : issue
          ),
        })),

        deleteIssue: (id) => set((state) => ({
          issues: state.issues.filter(issue => issue.id !== id),
          comments: state.comments.filter(comment => comment.issueId !== id),
        })),

        setSelectedIssue: (id) => set({ selectedIssue: id }),

        addComment: (commentData) => set((state) => ({
          comments: [...state.comments, {
            ...commentData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
          }],
        })),

        updateComment: (id, content) => set((state) => ({
          comments: state.comments.map(comment =>
            comment.id === id ? { ...comment, content } : comment
          ),
        })),

        deleteComment: (id) => set((state) => ({
          comments: state.comments.filter(comment => comment.id !== id),
        })),

        getIssuesByStatus: (status) => {
          return get().issues.filter(issue => issue.status === status);
        },

        getIssuesByPriority: (priority) => {
          return get().issues.filter(issue => issue.priority === priority);
        },

        getIssuesByAssignee: (userId) => {
          return get().issues.filter(issue => issue.assignedTo === userId);
        },

        getIssueComments: (issueId) => {
          return get().comments.filter(comment => comment.issueId === issueId);
        },

        getIssuesStats: () => {
          const issues = get().issues;
          const stats = {
            total: issues.length,
            open: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
            byPriority: {
              low: 0,
              medium: 0,
              high: 0,
              critical: 0,
            },
            byType: {
              bug: 0,
              feature: 0,
              incident: 0,
              maintenance: 0,
              other: 0,
            },
          };

          issues.forEach(issue => {
            // Count by status
            switch (issue.status) {
              case 'open': stats.open++; break;
              case 'in_progress': stats.inProgress++; break;
              case 'resolved': stats.resolved++; break;
              case 'closed': stats.closed++; break;
            }

            // Count by priority
            stats.byPriority[issue.priority]++;

            // Count by type
            stats.byType[issue.type]++;
          });

          return stats;
        },

        reset: () => set(initialState),
      }),
      {
        name: 'issue-storage',
      }
    )
  )
);
