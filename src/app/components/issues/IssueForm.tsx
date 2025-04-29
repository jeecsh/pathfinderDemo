'use client';

import { useState } from 'react';
import { Issue, IssueType, IssuePriority, IssueStatus, useIssueStore } from '@/app/stores/useIssueStore';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { useUserStore } from '@/app/stores/useUserStore';
import { useTeamStore } from '@/app/stores/useTeamStore';
import { useVehicleStore } from '@/app/stores/useVehicleStore';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueFormProps {
  issue?: Issue;
  onSubmit: () => void;
  onCancel: () => void;
}

const issueTypes: IssueType[] = ['bug', 'feature', 'incident', 'maintenance', 'other'];
const priorities: IssuePriority[] = ['low', 'medium', 'high', 'critical'];
const statuses: IssueStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export function IssueForm({ issue, onSubmit, onCancel }: IssueFormProps) {
  const { addIssue, updateIssue } = useIssueStore();
  const { teamMembers } = useUserStore();
  const { teams } = useTeamStore();
  const { vehicles } = useVehicleStore();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Issue>>({
    title: issue?.title || '',
    description: issue?.description || '',
    type: issue?.type || 'bug',
    priority: issue?.priority || 'medium',
    status: issue?.status || 'open',
    assignedTo: issue?.assignedTo || undefined,
    reportedBy: issue?.reportedBy || teamMembers[0]?.id,
    tags: issue?.tags || [],
    relatedVehicles: issue?.relatedVehicles || [],
    relatedTeams: issue?.relatedTeams || [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.reportedBy) {
      setError('Title, description, and reporter are required');
      return;
    }

    try {
      if (issue) {
        updateIssue(issue.id, formData);
      } else {
        addIssue(formData as Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>);
      }
      onSubmit();
    } catch (err) {
      setError('Failed to save issue');
    }
  };

  const handleTagAdd = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput]
      }));
      setTagInput('');
    }
  };

  return (
    <ThemeCard
      title={issue ? 'Edit Issue' : 'Create New Issue'}
      description={issue ? 'Update issue details' : 'Create a new issue to track'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border-destructive/20 border rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              placeholder="Issue title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              rows={4}
              placeholder="Detailed description of the issue"
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium">Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as IssueType }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              >
                {issueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as IssuePriority }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as IssueStatus }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium">Assign To</label>
              <select
                id="assignedTo"
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value || undefined }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium">Tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/50"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      tags: prev.tags?.filter(t => t !== tag)
                    }))}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1 text-sm"
                placeholder="Add tag..."
              />
              <ThemeButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTagAdd}
              >
                Add
              </ThemeButton>
            </div>
          </div>

          {/* Related Items */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="relatedTeams" className="block text-sm font-medium">Related Teams</label>
              <select
                id="relatedTeams"
                multiple
                value={formData.relatedTeams || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, relatedTeams: selected }));
                }}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                size={3}
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="relatedVehicles" className="block text-sm font-medium">Related Vehicles</label>
              <select
                id="relatedVehicles"
                multiple
                value={formData.relatedVehicles || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, relatedVehicles: selected }));
                }}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                size={3}
              >
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
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
            {issue ? 'Update Issue' : 'Create Issue'}
          </ThemeButton>
        </div>
      </form>
    </ThemeCard>
  );
}
