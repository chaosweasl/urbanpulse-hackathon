import { PetReport } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { ImageOff, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PetCardProps {
  report: PetReport & { reporter: { username: string; avatar_url: string | null } };
  className?: string;
}

export function PetCard({ report, className }: PetCardProps) {
  const isLost = report.type === "lost";

  const speciesColors: Record<string, string> = {
    dog: "bg-amber-100 text-amber-800 border-amber-200",
    cat: "bg-purple-100 text-purple-800 border-purple-200",
    bird: "bg-cyan-100 text-cyan-800 border-cyan-200",
    other: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <Card className={cn(
      "overflow-hidden rounded-lg border border-white/8 bg-zinc-900 p-0 transition-all hover:-translate-y-0.5",
      isLost && "border-red-900/50",
      className
    )}>
      <div className="grid min-h-[380px] grid-rows-[4fr_1fr]">
        <div className="relative overflow-hidden bg-muted/20">
          {report.photo_url ? (
            <Image
              src={report.photo_url}
              alt={report.name || "Pet photo"}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <ImageOff size={32} className="mb-2 opacity-50" />
              <span className="text-xs font-medium">No photo available</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className={cn("font-bold uppercase", isLost ? "bg-red-500 hover:bg-red-500" : "bg-emerald-500 hover:bg-emerald-500")}>
              {isLost ? "LOST" : "FOUND"}
            </Badge>
            <Badge variant="outline" className={cn("capitalize border-white/10 bg-zinc-800 font-bold text-zinc-100", speciesColors[report.species] || speciesColors.other)}>
              {report.species}
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white/90">
            <div className="flex min-w-0 items-center gap-2">
              <AvatarWithBadge
                src={report.reporter.avatar_url}
                fallback={report.reporter.username}
                size="sm"
              />
              <span className="truncate">{report.reporter.username}</span>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-white/80">
              <Clock size={12} />
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <CardContent className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-foreground">
              {report.name || "Unknown Name"}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="truncate">{report.breed || "Unknown breed"}</span>
              <span>•</span>
              <span className="truncate">{report.color}</span>
            </p>
          </div>
          <CardFooter className="p-0">
            <Button asChild size="sm" className={cn("rounded-full px-5 text-xs font-bold", isLost ? "bg-white text-black hover:bg-white/90" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
              <Link href={`/pets/${report.id}`}>View</Link>
            </Button>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
}
