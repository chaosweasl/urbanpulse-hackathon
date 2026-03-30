"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustScore } from "./TrustScore";
import type { Profile } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  className?: string;
}

/**
 * Profile: ProfileCard — user profile summary card.
 * Displays neighbor avatar, display name, bio, trust score display, and joined date.
 * Styled with the HeroAlert blue/gold palette for a consistent neighborly feel.
 */
export function ProfileCard({ profile, className }: ProfileCardProps) {
  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Construct a breakdown from profile data for the TrustScore component
  const trustBreakdown = {
    base_score: 50, // Mock base
    successful_lends: 0, // Profile doesn't have this breakdown yet
    successful_helps: profile.successful_interactions,
    positive_feedback_count: profile.successful_interactions,
    negative_feedback_count: 0,
    verified_badge: profile.is_verified_neighbor,
    computed_score: profile.trust_score,
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto overflow-hidden border-2 border-blue-100/50 shadow-xl shadow-blue-900/5 bg-white rounded-3xl transition-all hover:shadow-2xl hover:shadow-blue-900/10",
        className
      )}
    >
      <CardHeader className="relative p-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute -bottom-10 left-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-black text-xl">
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {profile.is_verified_neighbor && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-1.5 border border-white/30 shadow-sm">
            <ShieldCheck className="text-white h-5 w-5" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-14 pb-6 px-6">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-2xl font-black text-blue-950 tracking-tight leading-none">
            {profile.full_name || profile.username}
          </h2>
          <p className="text-blue-600/60 font-medium text-sm">
            @{profile.username}
          </p>
        </div>

        {profile.bio ? (
          <p className="text-blue-900/70 text-sm leading-relaxed mb-8 italic">
            &quot;{profile.bio}&quot;
          </p>
        ) : (
          <p className="text-blue-900/30 text-sm leading-relaxed mb-8 italic">
            No bio provided yet...
          </p>
        )}

        {/* Trust Score Integration */}
        <div className="mb-8 p-4 rounded-2xl bg-blue-50/30 border border-blue-100/20">
          <TrustScore breakdown={trustBreakdown} showBreakdown={false} />
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-blue-50">
          <div className="flex items-center gap-2 text-blue-900/50 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>Joined {joinedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-blue-900/50 text-xs font-semibold uppercase tracking-wider">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{profile.successful_interactions} Successes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
