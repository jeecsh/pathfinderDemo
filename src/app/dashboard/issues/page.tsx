'use client';

import { useState, useMemo } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { IssueCard } from '@/app/components/issues/IssueCard';
import { IssueForm } from '@/app/components/issues/IssueForm';
import { useIssueStore, IssueStatus, Issue, IssuePriority } from '@/app/stores/useIssueStore';
import { Plus, AlertTriangle, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityChart } from '@/app/components/dashboard/ActivityChart';

const generateTimelineData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.floor(Math.random() * 10),
    });
  }
  return data;
};

export default function IssuesPage() {
  const { issues, comments, getIssueComments, getIssuesStats } = useIssueStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');

  const stats = getIssuesStats();
  const timelineData = generateTimelineData(14);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;
      return true;
    });
  }, [issues, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <ThemeHeader
        description="Track and manage issues across your organization"
        action={
          <ThemeButton
            onClick={() => {
              setSelectedIssue(null);
              setShowForm(true);
            }}
            icon={<Plus className="h-4 w-4" />}
          >
            Create Issue
          </ThemeButton>
        }
      >
        Issues
      </ThemeHeader>

      {/* Issue Form Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <IssueForm
              issue={selectedIssue || undefined}
              onSubmit={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ThemeCard 
          title="Total Issues" 
          description={`${stats.total} issues tracked`}
          icon={<AlertTriangle className="h-4 w-4" />}
        >
          <div className="mt-4">
            <ActivityChart
              title="Issues Trend"
              data={timelineData}
              valueFormatter={(value) => value.toString()}
            />
          </div>
        </ThemeCard>
        {/* Priority Distribution */}
        <ThemeCard title="By Priority">
          <div className="space-y-2">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  {
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300': priority === 'low',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300': priority === 'medium',
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300': priority === 'high',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300': priority === 'critical',
                  }
                )}>
                  {priority.toUpperCase()}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </ThemeCard>
        {/* Status Distribution */}
        <ThemeCard title="By Status">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Open</span>
              <span className="font-medium">{stats.open}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>In Progress</span>
              <span className="font-medium">{stats.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resolved</span>
              <span className="font-medium">{stats.resolved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Closed</span>
              <span className="font-medium">{stats.closed}</span>
            </div>
          </div>
        </ThemeCard>
        {/* Type Distribution */}
        <ThemeCard title="By Type">
          <div className="space-y-2">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </ThemeCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
          className="rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as IssuePriority | 'all')}
          className="rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredIssues.map(issue => (
          <IssueCard
            key={issue.id}
            issue={issue}
            comments={getIssueComments(issue.id).length}
            onSelect={(id) => {
              const selected = issues.find(i => i.id === id);
              if (selected) {
                setSelectedIssue(selected);
                setShowForm(true);
              }
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {issues.length === 0 && !showForm && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No issues found</h3>
          <p className="mt-2 text-muted-foreground">
            Start by creating your first issue
          </p>
          <ThemeButton
            className="mt-6"
            onClick={() => setShowForm(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Create First Issue
          </ThemeButton>
        </div>
      )}
    </div>
  );
}
