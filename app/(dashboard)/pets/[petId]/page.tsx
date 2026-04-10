"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PetMatchResults } from "@/components/pets/PetMatchResults";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { ArrowLeft, MapPin, Clock, Info, MessageCircle, AlertCircle, Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PetDetail {
  id: string;
  type: "lost" | "found";
  name: string | null;
  species: string;
  breed: string | null;
  color: string;
  description: string;
  photo_url: string | null;
  created_at: string;
  reporter_id: string;
  reporter: {
    username: string;
    avatar_url: string | null;
  };
}

export default function PetDetailPage() {
  const params = useParams();
  const petId = Array.isArray(params.petId) ? params.petId[0] : params.petId;
  const router = useRouter();
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`/api/pets/${Array.isArray(petId) ? petId[0] : petId}`);
        const data = await res.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to load pet details");
        }

        setPet(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPet();
  }, [petId]);

  const handleContact = async () => {
    if (!pet) return;
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: pet.reporter_id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        router.push(`/messages/${data.data.id}`);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-900/40 bg-zinc-900 p-8 text-center text-red-300">
          <AlertCircle className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-bold mb-2">Error Loading Pet</h2>
            <p className="font-medium">{error || "Pet not found"}</p>
          </div>
          <Button onClick={() => router.push("/pets")} variant="outline" className="mt-4 rounded-lg">
            Back to Pets
          </Button>
        </div>
      </div>
    );
  }

  const isLost = pet.type === "lost";

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={() => router.push("/pets")} className="-ml-4 rounded-lg font-bold">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pets
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={cn(
          "relative h-[400px] w-full overflow-hidden rounded-lg border-2",
          isLost ? "border-red-900/50" : "border-green-900/50"
        )}>
          {pet.photo_url ? (
            <Image src={pet.photo_url} alt={pet.name || "Pet"} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <ImageOff size={64} className="mb-4 opacity-50" />
              <p className="font-bold">No photo provided</p>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className={cn("px-4 py-1.5 text-sm font-bold", isLost ? "bg-red-500" : "bg-green-500")}>
              {isLost ? "LOST PET" : "FOUND PET"}
            </Badge>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-zinc-800 border-white/10 font-bold capitalize px-3">
                {pet.species}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock size={14} />
                {new Date(pet.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{pet.name || "Unknown Name"}</h1>
            <p className="text-lg font-medium text-muted-foreground">
              {pet.breed ? `${pet.breed} • ` : ""}{pet.color}
            </p>
          </div>

          <div className="rounded-lg border border-white/8 bg-zinc-900 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              <Info size={14} /> Description
            </h3>
            <p className="font-medium text-foreground leading-relaxed whitespace-pre-wrap">
              {pet.description}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/8 bg-zinc-900 p-5">
            <div className="flex items-center gap-4">
              <AvatarWithBadge src={pet.reporter.avatar_url} fallback={pet.reporter.username} size="lg" />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Reported By</p>
                <p className="font-bold">{pet.reporter.username}</p>
              </div>
            </div>
            <Button onClick={handleContact} className="rounded-lg font-bold">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border/50 mt-12">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">AI Match Results</h2>
          <p className="text-muted-foreground font-medium">
            Our AI scans all reports to find potential matches for this pet.
          </p>
        </div>
        <PetMatchResults reportId={pet.id} reportType={pet.type} />
      </div>
    </div>
  );
}
