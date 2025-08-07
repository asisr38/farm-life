import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export default function StatsCard({ title, value, icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {icon && <div className="text-farm-green-600">{icon}</div>}
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

