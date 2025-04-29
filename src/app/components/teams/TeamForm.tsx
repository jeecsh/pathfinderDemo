'use client';

import { useState } from 'react';
import { useTeamStore, Team } from '@/app/stores/useTeamStore';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { useUserStore } from '@/app/stores/useUserStore';
import { Select } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';

interface TeamFormProps {
  team?: Team;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const { addTeam, updateTeam } = useTeamStore();
  const { teamMembers } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Team>>({
    name: team?.name || '',
    description: team?.description || '',
    leader: team?.leader || '',
    members: team?.members || [],
    status: team?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.leader) {
      setError('Team name and leader are required');
      return;
    }

    try {
      if (team) {
        updateTeam(team.id, formData);
      } else {
        addTeam(formData as Omit<Team, 'id' | 'createdAt'>);
      }
      onSubmit();
    } catch (err) {
      setError('Failed to save team');
    }
  };

  return (
    <ThemeCard
      title={team ? 'Edit Team' : 'Create New Team'}
      description={team ? 'Update team details' : 'Create a new team and assign members'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border-destructive/20 border rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter team description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="leader" className="block text-sm font-medium text-foreground">
              Team Leader
            </label>
            <select
              id="leader"
              value={formData.leader}
              onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Select a team leader</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="members" className="block text-sm font-medium text-foreground">
              Team Members
            </label>
            <select
              id="members"
              multiple
              value={formData.members}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, members: selected }));
              }}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              size={5}
            >
              {teamMembers
                .filter(member => member.id !== formData.leader)
                .map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground">
              Team Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Team['status'] }))}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <ThemeButton
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </ThemeButton>
          <ThemeButton type="submit">
            {team ? 'Update Team' : 'Create Team'}
          </ThemeButton>
        </div>
      </form>
    </ThemeCard>
  );
}
