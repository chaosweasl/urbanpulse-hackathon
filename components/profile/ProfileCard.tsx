"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  className?: string;
}

/**
 * Profile: ProfileCard — user profile summary card.
 * Displays neighbor avatar, display name, bio, trust score badge, and joined date.
 * Styled with the HeroAlert blue/gold palette for a consistent neighborly feel.
 */
export function ProfileCard({ profile, className }: ProfileCardProps) {
  const joinedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto overflow-hidden border-2 border-blue-100/50 shadow-xl shadow-blue-900/5 bg-white rounded-3xl transition-all hover:shadow-2xl hover:shadow-blue-900/10",
        className
      )}
    >
      <CardHeader className="relative p-0 h-24 bg-linear-to-r from-blue-600 to-indigo-600">
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
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-blue-950 tracking-tight leading-none">
              {profile.full_name || profile.username}
            </h2>
            <p className="text-blue-600/60 font-medium text-sm mt-1">
              @{profile.username}
            </p>
          </div>

          <Badge
            variant="default"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-xl shadow-sm border-none flex items-center gap-1.5"
          >
            <Star className="h-3.5 w-3.5 fill-white" />
            {profile.trust_score}
          </Badge>
        </div>

        {profile.bio ? (
          <p className="text-blue-900/70 text-sm leading-relaxed mb-6 italic">
            &quot;{profile.bio}&quot;
          </p>
        ) : (
          <p className="text-blue-900/30 text-sm leading-relaxed mb-6 italic">
            No bio provided yet...
          </p>
        )}

        <div className="flex flex-wrap gap-4 pt-4 border-t border-blue-50">
          <div className="flex items-center gap-2 text-blue-900/50 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>Joined {joinedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-blue-900/50 text-xs font-semibold uppercase tracking-wider">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{profile.successful_interactions} Helps</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
