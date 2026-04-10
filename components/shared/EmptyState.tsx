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
      "flex flex-col items-center justify-center rounded-3xl bg-neutral-900/75 py-20 text-center",
      className
    )}>
      {Icon && (
        <div className="mb-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,hsl(var(--primary)/0.45),transparent_70%)] p-6 shadow-xl">
          <Icon size={48} className="text-primary" />
        </div>
      )}
      <h3 className="text-2xl font-black text-foreground mb-2">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm font-medium text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
