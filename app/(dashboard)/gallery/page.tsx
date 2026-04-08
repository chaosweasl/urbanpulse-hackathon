"use client";

import { HeroAlert } from "@/components/notifications/HeroAlert";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { TypingIndicator } from "@/components/messages/TypingIndicator";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { TrustScore } from "@/components/profile/TrustScore";
import { ResourceList } from "@/components/profile/ResourceList";
import { SkillTagList } from "@/components/profile/SkillTagList";
import { QuietHoursSettings } from "@/components/profile/QuietHoursSettings";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Palette, Box, MessageCircle, UserCircle, Layout } from "lucide-react";
import type { Profile, Resource } from "@/types";

export default function UIGalleryPage() {
  // Mock Data
  const mockProfile: Profile = {
    id: "user-1",
    username: "alex_neighbor",
    full_name: "Alex Neighbor",
    bio: "Always happy to help with gardening or tech issues. Been in the neighborhood for 5 years!",
    avatar_url: null,
    location: null,
    neighborhood: "Green Valley",
    neighborhood_radius_km: 5,
    skill_tags: ["Gardening", "JavaScript", "Plumbing"],
    trust_score: 85,
    successful_interactions: 12,
    is_verified_neighbor: true,
    is_admin: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockTrustBreakdown = {
    base_score: 50,
    successful_lends: 4,
    successful_helps: 8,
    positive_feedback_count: 12,
    negative_feedback_count: 0,
    verified_badge: true,
    computed_score: 85,
  };

  const mockResource: Resource & {
    owner: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      trust_score: number;
      is_verified_neighbor: boolean;
    };
  } = {
    id: "res-1",
    name: "Heavy Duty Drill",
    description: "Bosch professional drill, perfect for masonry work. Includes extra bits.",
    type: "item",
    status: "available",
    owner_id: "user-1",
    tags: ["tools"],
    location: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      username: "alex_neighbor",
      full_name: "Alex Neighbor",
      avatar_url: null,
      trust_score: 85,
      is_verified_neighbor: true,
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 px-4">
      {/* Page Header */}
      <div className="bg-blue-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <Palette size={32} className="text-amber-400" />
            <h1 className="text-5xl font-black tracking-tight">UI Component Gallery</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl font-medium">
            Review the cohesive design system implemented for UrbanPulse.
            Access this page anytime at <code className="bg-white/20 px-2 py-1 rounded">/gallery</code>.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl -ml-24 -mb-24" />
      </div>

      {/* 1. Notifications Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
          <Box className="text-blue-900" />
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-widest">Real-time Notifications</h2>
        </div>
        <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
          <p className="text-blue-900/60 font-bold text-xs uppercase tracking-widest mb-6">HeroAlert Component (Triggered by WebSocket)</p>
          <HeroAlert />
          <p className="text-[10px] text-blue-900/40 italic mt-4">Note: The alert above is responsive and matches the gold/blue palette.</p>
        </div>
      </section>

      {/* 2. Messaging Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
          <MessageCircle className="text-blue-900" />
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-widest">Messaging Suite</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-[2rem] border-2 border-blue-50 shadow-xl shadow-blue-900/5 space-y-6">
            <p className="text-blue-900/60 font-bold text-xs uppercase tracking-widest">Message Bubbles</p>
            <MessageBubble message="Hey! Do you still have that ladder I could borrow for an hour?" timestamp="14:20" isCurrentUser={false} />
            <MessageBubble message="Sure thing! It's in the garage, you can come pick it up whenever you're ready." timestamp="14:22" isCurrentUser={true} isRead={true} />
            <TypingIndicator username="Alex" />
          </div>
          <div className="p-8 bg-white rounded-[2rem] border-2 border-blue-50 shadow-xl shadow-blue-900/5 space-y-6">
            <p className="text-blue-900/60 font-bold text-xs uppercase tracking-widest">Search & Filtering</p>
            <SearchBar onSearch={(q) => console.log(q)} placeholder="Search for tools or skills..." />
          </div>
        </div>
      </section>

      {/* 3. Profile Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-l-4 border-indigo-600 pl-4">
          <UserCircle className="text-blue-900" />
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-widest">Neighbor Profiles</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ProfileCard profile={mockProfile} />
          <div className="space-y-8 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SkillTagList initialTags={mockProfile.skill_tags} onSave={async () => {}} />
               <QuietHoursSettings profile={mockProfile} onSave={async () => {}} />
            </div>
            <div className="p-8 bg-white rounded-[2rem] border-2 border-blue-50 shadow-xl shadow-blue-900/5">
              <p className="text-blue-900/60 font-bold text-xs uppercase tracking-widest mb-6">Detailed Trust Score</p>
              <TrustScore breakdown={mockTrustBreakdown} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Resources Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-l-4 border-green-600 pl-4">
          <Layout className="text-blue-900" />
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-widest">Library Components</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ResourceCard resource={mockResource} onAction={() => {}} />
          <div className="lg:col-span-2">
            <ResourceList initialResources={[mockResource]} onAdd={async () => {}} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pt-12 border-t border-blue-100 text-center">
        <p className="text-blue-900/40 font-black uppercase tracking-widest text-[10px]">UrbanPulse Hackathon - Prototype UI</p>
      </div>
    </div>
  );
}
