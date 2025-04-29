'use client';

import { Issue, IssuePriority } from '@/app/stores/useIssueStore';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { AlertCircle, Clock, Tag, Car, Users, MessageCircle } from 'lucide-react';
import { useUserStore } from '@/app/stores/useUserStore';
import { formatDistanceToNow } from 'date-fns';

const priorityColors: Record<IssuePriority, { bg: string; text: string }> = {
  low: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

interface IssueCardProps {
  issue: Issue;
  comments: number;
  onSelect: (id: string) => void;
}

export function IssueCard({ issue, comments, onSelect }: IssueCardProps) {
  const { teamMembers } = useUserStore();
  const assignedUser = teamMembers.find(member => member.id === issue.assignedTo);
  const reportedByUser = teamMembers.find(member => member.id === issue.reportedBy);

  return (
    <ThemeCard
      title={issue.title}
      icon={<AlertCircle className="h-5 w-5" />}
      action={
        <ThemeButton
          size="sm"
          variant="outline"
          onClick={() => onSelect(issue.id)}
        >
          View Details
        </ThemeButton>
      }
    >
      <div className="space-y-4">
        {/* Priority and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority].bg} ${priorityColors[issue.priority].text}`}>
              {issue.priority.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              #{issue.id.slice(0, 8)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>

        {/* Tags */}
        {issue.tags && issue.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {issue.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-accent/50 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Items */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {issue.relatedVehicles && issue.relatedVehicles.length > 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{issue.relatedVehicles.length}</span>
            </div>
          )}
          {issue.relatedTeams && issue.relatedTeams.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{issue.relatedTeams.length}</span>
            </div>
          )}
          {comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </div>
          )}
        </div>

        {/* Assignment Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Assigned to:</span>{' '}
              <span className="font-medium">
                {assignedUser?.name || 'Unassigned'}
              </span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">By:</span>{' '}
            <span className="font-medium">
              {reportedByUser?.name || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </ThemeCard>
  );
}
