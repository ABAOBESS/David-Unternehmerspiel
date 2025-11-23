import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const baseClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className={`p-4 rounded-xl border ${baseClass} shadow-sm flex flex-col justify-between h-24`}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 flex justify-between items-center">
        {title}
        {icon && <span className="text-lg opacity-50">{icon}</span>}
      </div>
      <div className="text-2xl font-bold truncate">
        {value}
      </div>
    </div>
  );
};

export default StatCard;