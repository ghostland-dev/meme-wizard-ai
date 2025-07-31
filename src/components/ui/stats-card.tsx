import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  className?: string;
}

export function StatsCard({ title, value, change, className }: StatsCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border bg-card p-6",
      "hover:scale-105 transition-all duration-300 hover:shadow-glow-primary",
      className
    )}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            change.trend === "up" ? "text-success" : "text-destructive"
          )}>
            {change.trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold bg-gradient-viral bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  );
}