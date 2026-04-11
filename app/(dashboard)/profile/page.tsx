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
import { useTranslations } from "next-intl";

/**
 * MyProfilePage — Current user's private profile and settings view.
 * Allows managing personal info, expertise tags, shared resources, and preferences.
 */
export default function MyProfilePage() {
  const t = useTranslations("Profile");
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
        const response = await fetch(`/api/resources?owner_id=${user.id}&status=all&per_page=200`);
        const data = await response.json();
        setResources(data.success ? data.data || [] : []);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchMyResources();
    } else if (!authLoading && !user) {
      setIsLoading(false);
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
          {t("accessing")}
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-20">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_46%)]" />

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-900 shadow-xl md:h-28 md:w-28">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-xl font-bold">
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pb-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{t("controlCenter")}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  {profile.full_name || profile.username}
                </h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground">@{profile.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-medium uppercase tracking-wider sm:min-w-[18rem]">
              <div className="rounded-xl border border-white/10 bg-zinc-800/85 px-4 py-3 text-center backdrop-blur">
                <p className="text-[10px] text-zinc-400">{t("trust")}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{profile.trust_score}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-800/85 px-4 py-3 text-center backdrop-blur">
                <p className="text-[10px] text-zinc-400">{t("resources")}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{resources.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <aside className="space-y-8 xl:sticky xl:top-24">
          <ProfileCard profile={profile} className="max-w-none" />
          <QuietHoursSettings
            profile={profile}
            onSave={handleUpdateProfile}
          />
        </aside>

        <div className="space-y-8">
          <EditProfileForm profile={profile} onSave={handleUpdateProfile} />

          <SkillTagList
            initialTags={profile.skill_tags || []}
            onSave={(tags) => handleUpdateProfile({ skill_tags: tags })}
            className="max-w-none"
          />

          <section className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900 p-6 md:p-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{t("resourceManagement")}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {t("resourceManagementSubtitle")}
              </p>
            </div>

            <ResourceList
              initialResources={resources}
              onAdd={handleAddResource}
              onToggleStatus={handleToggleResource}
              onRemove={handleRemoveResource}
            />
          </section>

          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {t("dangerZone")}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{t("deleteAccount")}</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("deleteAccountSubtitle")}
                </p>
              </div>

              <Button
                variant="destructive"
                className="h-11 rounded-full px-6 font-bold"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? t("deleting") : t("deleteAccount")}
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
        title={t("deleteDialogTitle")}
        message={t("deleteDialogMessage")}
        confirmLabel={t("deletePermanently")}
        cancelLabel={t("keepAccount")}
        variant="danger"
      />
    </div>
  );
}
