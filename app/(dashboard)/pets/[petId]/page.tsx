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
        <div className="p-8 bg-red-50 text-red-600 rounded-3xl flex flex-col items-center justify-center text-center gap-4 border-2 border-red-100">
          <AlertCircle className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-bold mb-2">Error Loading Pet</h2>
            <p className="font-medium">{error || "Pet not found"}</p>
          </div>
          <Button onClick={() => router.push("/pets")} variant="outline" className="mt-4 rounded-xl bg-white text-foreground">
            Back to Pets
          </Button>
        </div>
      </div>
    );
  }

  const isLost = pet.type === "lost";

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={() => router.push("/pets")} className="rounded-xl font-bold -ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pets
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={cn(
          "relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-xl border-4",
          isLost ? "border-red-500/20" : "border-green-500/20"
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
            <Badge className={cn("px-4 py-1.5 text-sm font-black shadow-lg", isLost ? "bg-red-500" : "bg-green-500")}>
              {isLost ? "LOST PET" : "FOUND PET"}
            </Badge>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-background/50 backdrop-blur font-bold capitalize px-3">
                {pet.species}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock size={14} />
                {new Date(pet.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2">{pet.name || "Unknown Name"}</h1>
            <p className="text-lg font-medium text-muted-foreground">
              {pet.breed ? `${pet.breed} • ` : ""}{pet.color}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-muted/20 border border-border/50 glass">
            <h3 className="text-xs font-black uppercase text-muted-foreground mb-3 tracking-widest flex items-center gap-2">
              <Info size={14} /> Description
            </h3>
            <p className="font-medium text-foreground leading-relaxed whitespace-pre-wrap">
              {pet.description}
            </p>
          </div>

          <div className="flex items-center justify-between p-5 rounded-3xl border border-border/50 bg-background shadow-sm">
            <div className="flex items-center gap-4">
              <AvatarWithBadge src={pet.reporter.avatar_url} fallback={pet.reporter.username} size="lg" />
              <div>
                <p className="text-xs font-black uppercase text-muted-foreground">Reported By</p>
                <p className="font-bold">{pet.reporter.username}</p>
              </div>
            </div>
            <Button onClick={handleContact} className="rounded-2xl shadow-lg font-bold">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border/50 mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">AI Match Results</h2>
          <p className="text-muted-foreground font-medium">
            Our AI scans all reports to find potential matches for this pet.
          </p>
        </div>
        <PetMatchResults reportId={pet.id} reportType={pet.type} />
      </div>
    </div>
  );
}
