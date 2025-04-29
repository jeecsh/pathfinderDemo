'use client';

import { useState } from 'react';
import { Team, useTeamStore } from '@/app/stores/useTeamStore';
import { useUserStore } from '@/app/stores/useUserStore';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { TeamCard } from '@/app/components/teams/TeamCard';
import { TeamForm } from '@/app/components/teams/TeamForm';
import { Users, Plus, Activity } from 'lucide-react';
import { ActivityChart } from '@/app/components/dashboard/ActivityChart';
import { useOrgTheme } from '@/hooks/useOrgTheme';

export default function TeamsPage() {
  const { teams, getTeamMembers, getTeamLeader } = useTeamStore();
  const { colorTheme } = useOrgTheme();
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Mock team performance data
  const generateMockPerformance = (hours: number) => {
    const data = [];
    const now = new Date();
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.getHours().toString().padStart(2, '0') + ':00',
        value: Math.floor(Math.random() * 100),
      });
    }
    return data;
  };

  const performanceData = generateMockPerformance(12);

  return (
    <div className="space-y-6">
      <ThemeHeader
        description="Manage your teams and monitor their performance"
        action={
          <ThemeButton
            onClick={() => {
              setSelectedTeam(null);
              setShowForm(true);
            }}
            icon={<Plus className="h-4 w-4" />}
          >
            Create Team
          </ThemeButton>
        }
      >
        Manage Teams
      </ThemeHeader>

      {/* Team Form Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <TeamForm
              team={selectedTeam || undefined}
              onSubmit={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            leader={getTeamLeader(team.id)}
            members={getTeamMembers(team.id)}
            onSelect={(id) => {
              const selected = teams.find(t => t.id === id);
              if (selected) {
                setSelectedTeam(selected);
                setShowForm(true);
              }
            }}
          />
        ))}
      </div>

      {/* Performance Overview */}
      {teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <ActivityChart
              title="Team Performance Trend"
              data={performanceData}
              valueFormatter={(value) => `${value}%`}
            />
          </div>
          <div>
            <ActivityChart
              title="Completed Tasks"
              data={performanceData}
              valueFormatter={(value) => value.toString()}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {teams.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold" style={{ color: colorTheme }}>
            No teams created yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Start by creating your first team to manage your organization better
          </p>
          <ThemeButton
            className="mt-6"
            onClick={() => setShowForm(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Create Your First Team
          </ThemeButton>
        </div>
      )}
    </div>
  );
}
