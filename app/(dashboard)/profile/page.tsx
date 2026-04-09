"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { SkillTagList } from "@/components/profile/SkillTagList";
import { ResourceList } from "@/components/profile/ResourceList";
import { QuietHoursSettings } from "@/components/profile/QuietHoursSettings";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserCog } from "lucide-react";
import type { Profile, Resource, ResourceStatus } from "@/types";

/**
 * MyProfilePage — Current user's private profile and settings view.
 * Allows managing personal info, expertise tags, shared resources, and preferences.
 */
export default function MyProfilePage() {
  const router = useRouter();
  const { user, profile: initialProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile state with auth hook
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  useEffect(() => {
    async function fetchMyResources() {
      if (!user) return;
      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/resources?owner_id=${user.id}&status=available`),
          fetch(`/api/resources?owner_id=${user.id}&status=unavailable`)
        ]);
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
        
        const combined = [
          ...(data1.success ? data1.data || [] : []),
          ...(data2.success ? data2.data || [] : [])
        ];
        setResources(combined);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchMyResources();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleAddResource = async (resource: Omit<Resource, "id" | "created_at" | "updated_at" | "owner_id">) => {
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resource),
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.error);
  };

  const handleToggleResource = async (id: string, status: ResourceStatus) => {
    const response = await fetch(`/api/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.error);
  };

  const handleRemoveResource = async (id: string) => {
    const response = await fetch(`/api/resources/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-blue-900/40 font-bold uppercase tracking-widest text-xs">
          Accessing your profile...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-600/20">
            <UserCog className="text-white h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-blue-950 tracking-tight leading-none">
              My Profile
            </h1>
            <p className="text-blue-600/60 font-medium text-base mt-2">
              Manage your community presence and preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Summary & Tags */}
        <div className="lg:col-span-4 space-y-10">
          <ProfileCard profile={profile} />

          <SkillTagList
            initialTags={profile.skill_tags || []}
            onSave={(tags) => handleUpdateProfile({ skill_tags: tags })}
          />

          <QuietHoursSettings
            profile={profile}
            onSave={handleUpdateProfile}
          />
        </div>

        {/* Right Column: Resource Management */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50">
            <h3 className="text-xl font-black text-blue-950 uppercase tracking-[0.15em] mb-2">
              Resource Management
            </h3>
            <p className="text-blue-600/60 font-medium">
              List the tools, items, or skills you are willing to share with your neighbors.
            </p>
          </div>

          <ResourceList
            initialResources={resources}
            onAdd={handleAddResource}
            onToggleStatus={handleToggleResource}
            onRemove={handleRemoveResource}
          />
        </div>
      </div>
    </div>
  );
}
