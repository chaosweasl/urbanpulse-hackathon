"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { SkillTagList } from "@/components/profile/SkillTagList";
import { ResourceList } from "@/components/profile/ResourceList";
import { QuietHoursSettings } from "@/components/profile/QuietHoursSettings";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Profile, Resource, ResourceStatus } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete account data");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete account data";
      setDeleteError(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Accessing your profile...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      <section className="overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
        <div className="h-44 border-b border-white/8 bg-zinc-900 md:h-56" />
        <div className="relative -mt-14 px-6 pb-8 md:-mt-16 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-900 md:h-28 md:w-28">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-xl font-bold">
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pb-1">
                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  {profile.full_name || profile.username}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs font-medium uppercase tracking-wider">
              <div className="rounded-md border border-white/8 bg-zinc-800 px-4 py-2 text-center">
                <p className="text-[10px] text-muted-foreground">Trust</p>
                <p className="mt-1 text-base text-foreground">{profile.trust_score}</p>
              </div>
              <div className="rounded-md border border-white/8 bg-zinc-800 px-4 py-2 text-center">
                <p className="text-[10px] text-muted-foreground">Resources</p>
                <p className="mt-1 text-base text-foreground">{resources.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-4">
          <ProfileCard profile={profile} />
          <EditProfileForm profile={profile} onSave={handleUpdateProfile} />
          <SkillTagList
            initialTags={profile.skill_tags || []}
            onSave={(tags) => handleUpdateProfile({ skill_tags: tags })}
          />
          <QuietHoursSettings
            profile={profile}
            onSave={handleUpdateProfile}
          />
        </div>

        <div className="space-y-8 lg:col-span-8">
          <div className="rounded-lg border border-white/8 bg-zinc-900 p-8">
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              Resource Management
            </h3>
            <p className="font-medium text-muted-foreground">
              List the tools, items, or skills you are willing to share with your neighbors.
            </p>
          </div>

          <ResourceList
            initialResources={resources}
            onAdd={handleAddResource}
            onToggleStatus={handleToggleResource}
            onRemove={handleRemoveResource}
          />

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Danger zone
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">Delete My Account Data</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  This removes your UrbanPulse profile and all app data linked to it, including pulses, resources, and interactions.
                </p>
              </div>

              <Button
                variant="destructive"
                className="h-11 rounded-full px-6 font-bold"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? "Deleting..." : "Delete Account Data"}
              </Button>
            </div>

            {deleteError && <p className="mt-4 text-sm font-semibold text-destructive">{deleteError}</p>}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account data?"
        message="This action permanently removes your profile and app data from UrbanPulse. This cannot be undone."
        confirmLabel="Delete permanently"
        cancelLabel="Keep my account"
        variant="danger"
      />
    </div>
  );
}
