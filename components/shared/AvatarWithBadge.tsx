import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarWithBadgeProps {
  src?: string | null;
  fallback: string;
  isVerified?: boolean;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarWithBadge({
  src, fallback, isVerified, isOnline, size = "md", className
}: AvatarWithBadgeProps) {
  const sizeClasses = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" };
  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar className={cn(sizeClasses[size], "border border-white/10")}>
        <AvatarImage src={src || ""} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
          {fallback.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isVerified && (
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-primary" />
      )}
      {isOnline && !isVerified && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
      )}
    </div>
  );
}
