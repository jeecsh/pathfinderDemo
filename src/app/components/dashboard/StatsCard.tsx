'use client';

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useOrgTheme } from "@/hooks/useOrgTheme";
import { useDeviceType } from "@/hooks/useDeviceType";
import { motion } from "framer-motion";

type ChangeType = "increase" | "decrease";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: {
    value: number;
    timeframe: string;
    type: ChangeType;
  };
  isPositive: boolean;
}

export function StatsCard({ title, value, change, isPositive }: StatsCardProps) {
  const { colorTheme, adjustColor } = useOrgTheme();
  const { isMobile } = useDeviceType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 ${isMobile ? '' : 'p-6'} hover:shadow-md transition-all`}>
        <div className="flex justify-between items-start gap-2">
          <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground truncate`}>
            {title}
          </h3>
          <div
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="mr-1">
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
            </span>
            <span>{Math.abs(change.value)}%</span>
            <span className="ml-1 text-muted-foreground hidden md:inline">
              {change.timeframe}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <span 
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}
            style={{ color: colorTheme }}
          >
            {value}
          </span>
        </div>
        <div 
          className="mt-4 h-1 rounded-full overflow-hidden"
          style={{ 
            backgroundColor: adjustColor(colorTheme, 0, 0.1),
            width: '100%' 
          }}
        >
          <motion.div 
            className="h-1 rounded-full"
            style={{ 
              backgroundColor: colorTheme,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(change.value) * 5, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {isMobile && (
          <div className="mt-2 text-[10px] text-muted-foreground">
            {change.timeframe}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
