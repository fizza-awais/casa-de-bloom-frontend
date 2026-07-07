import type { LucideProps } from 'lucide-react';

interface StatCardProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  value: string | number;
}

export default function StatCard({
  icon: Icon,
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-ui-border relative overflow-hidden group transition-all hover:shadow-md h-full flex flex-col justify-between">
      <div className="text-center space-y-2 md:space-y-3 flex-1">
        <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider block leading-tight">
          {title}
        </span>
        <span className="text-xl md:text-2xl font-bold text-slate-800 leading-none tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}