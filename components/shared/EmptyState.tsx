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
      "flex flex-col items-center justify-center py-20 text-center",
      "rounded-3xl border-2 border-dashed border-border/30 bg-muted/10",
      className
    )}>
      {Icon && (
        <div className="mb-6 rounded-full bg-muted/50 p-6 shadow-xl">
          <Icon size={48} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-2xl font-black text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground font-medium max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
