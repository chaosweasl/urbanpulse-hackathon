import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-white/8 bg-zinc-900 py-20 text-center",
      className
    )}>
      {Icon && (
        <div className="mb-6 rounded-lg bg-zinc-800 p-5">
          <Icon size={48} className="text-primary" />
        </div>
      )}
      <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm font-medium text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
