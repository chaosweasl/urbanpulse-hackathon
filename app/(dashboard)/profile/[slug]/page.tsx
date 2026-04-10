"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ResourceList } from "@/components/profile/ResourceList";
import { SkillTagList } from "@/components/profile/SkillTagList";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import type { Profile, Resource } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * PublicProfilePage — Neighbor's public profile view.
 * Displays user info, trust score, resources, and provides a contact action.
 */
export default function PublicProfilePage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        // Fetch profile
        const profRes = await fetch(`/api/users/${slug}`);
        const profData = await profRes.json();

        if (!profData.success) {
          setError(profData.error || "User not found");
          setIsLoading(false);
          return;
        }

        const userData = profData.data as Profile;
        setProfile(userData);

        // Fetch resources for this user
        const resRes = await fetch(`/api/resources?owner_id=${userData.id}`);
        const resData = await resRes.json();

        if (resData.success) {
          setResources(resData.data || []);
        }

      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [slug]);

  const handleMessage = async () => {
    if (!profile) return;
    setIsStartingChat(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: profile.id }),
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/messages/${data.data.id}`);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Loading neighbor profile...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-red-50 p-4 rounded-3xl mb-4 text-red-500 border border-red-100">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Neighbor not found</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl border-border/50 text-primary hover:bg-muted/50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Header/Action Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to feed
        </Button>

        <Button
          onClick={handleMessage}
          disabled={isStartingChat}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {isStartingChat ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="mr-2 h-4 w-4" />
          )}
          Message neighbor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Tags */}
        <div className="lg:col-span-5 space-y-8">
          <ProfileCard profile={profile} />

          <SkillTagList
            initialTags={profile.skill_tags || []}
            className="w-full"
            // Read-only mode simulated by omitting onSave
          />
        </div>

        {/* Right Column: Shared Resources */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-muted/20 p-6 rounded-3xl border border-border/30">
            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-1">
              Community Sharing
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              Items and skills this neighbor is ready to share.
            </p>
          </div>

          <ResourceList
            initialResources={resources}
            // Read-only mode simulated by omitting onAdd/onRemove
          />
        </div>
      </div>
    </div>
  );
}
