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
      "overflow-hidden rounded-3xl transition-all hover:shadow-lg glass",
      isLost && "border-red-200/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
      className
    )}>
      <div className="relative h-48 w-full bg-muted/30">
        {report.photo_url ? (
          <Image src={report.photo_url} alt={report.name || "Pet photo"} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
            <ImageOff size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">No photo available</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("font-black uppercase shadow-md", isLost ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}>
            {isLost ? "LOST" : "FOUND"}
          </Badge>
          <Badge variant="outline" className={cn("capitalize font-bold bg-white/90 backdrop-blur", speciesColors[report.species] || speciesColors.other)}>
            {report.species}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-black text-foreground truncate">
            {report.name || "Unknown Name"}
          </h3>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mt-1">
            <span className="truncate">{report.breed || "Unknown breed"}</span>
            <span>•</span>
            <span className="truncate">{report.color}</span>
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {report.description}
        </p>

        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <AvatarWithBadge
              src={report.reporter.avatar_url}
              fallback={report.reporter.username}
              size="sm"
            />
            <span className="truncate max-w-[100px]">{report.reporter.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{new Date(report.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className={cn("w-full rounded-xl shadow-md font-bold", isLost ? "bg-red-50 hover:text-red-700 text-red-600 border border-red-200" : "bg-primary/10 text-primary hover:bg-primary/20")} variant="outline">
          <Link href={`/pets/${report.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
