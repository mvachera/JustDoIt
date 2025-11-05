import { ComponentType } from 'react';

export interface StatsCardProps {
  icon: ComponentType<any>;
  title: string;
  value: string | number;
  color: string;
  children?: React.ReactNode;
}

export default function StatsCard({ icon: Icon, title, value, color, children }: StatsCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {children}
        </div>
        <div className={`p-3 rounded-lg ${color} ml-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}