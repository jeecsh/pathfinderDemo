'use client';

import { Team, TeamMember, useTeamStore } from '@/app/stores/useTeamStore';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { Users, Star, TrendingUp, Check } from 'lucide-react';
import { useOrgTheme } from '@/hooks/useOrgTheme';

interface TeamCardProps {
  team: Team;
  leader: TeamMember | undefined;
  members: TeamMember[];
  onSelect: (id: string) => void;
}

export function TeamCard({ team, leader, members, onSelect }: TeamCardProps) {
  const { colorTheme } = useOrgTheme();
  
  const activeMembers = members.filter(m => m.status === 'active').length;
  const memberCount = members.length;
  const performance = team.performance || {
    completedTasks: 0,
    onTimeDelivery: 0,
    rating: 0
  };

  return (
    <ThemeCard
      title={team.name}
      description={team.description}
      icon={<Users />}
      action={
        <ThemeButton
          size="sm"
          variant="outline"
          onClick={() => onSelect(team.id)}
        >
          View Details
        </ThemeButton>
      }
    >
      <div className="space-y-4">
        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Team Members</p>
            <p className="text-lg font-semibold mt-1" style={{ color: colorTheme }}>
              {activeMembers}/{memberCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Tasks</p>
            <p className="text-lg font-semibold mt-1" style={{ color: colorTheme }}>
              {performance.completedTasks}
            </p>
          </div>
        </div>

        {/* Team Leader */}
        {leader && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <div className="flex-shrink-0">
              {leader.avatar ? (
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: colorTheme }}
                >
                  {leader.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{leader.name}</p>
              <p className="text-xs text-muted-foreground">Team Leader</p>
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: colorTheme }} />
            <span>{performance.onTimeDelivery}% On-time</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: colorTheme }} />
            <span>{performance.rating.toFixed(1)} Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: colorTheme }} />
            <span>+12% Growth</span>
          </div>
        </div>
      </div>
    </ThemeCard>
  );
}
