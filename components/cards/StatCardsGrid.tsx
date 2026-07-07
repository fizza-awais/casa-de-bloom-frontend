import React from 'react';
import StatCard from './StatCard';
import type { LucideProps } from 'lucide-react';

interface StatsData {
  icon: React.ComponentType<LucideProps>;
  title: string;
  value: string | number;
}

interface StatsCardsGridProps {
  statsData: StatsData[];
  loading: boolean;
}

export default function StatsCardsGrid({
  statsData,
  loading,
}: StatsCardsGridProps) {
  return (
    <div
      className={`
        grid gap-4 md:gap-6 mb-8
        grid-cols-2
        sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
        ${loading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
}