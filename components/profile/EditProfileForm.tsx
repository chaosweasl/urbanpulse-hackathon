"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, UserCog } from "lucide-react";
import type { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { AvatarWithBadge } from "@/components/shared/AvatarWithBadge";
import { prepareImageForUpload } from "@/lib/image-upload";
import { useTranslations } from "next-intl";

interface EditProfileFormProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export function EditProfileForm({ profile, onSave }: EditProfileFormProps) {
  const t = useTranslations("Profile");
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();

  const uploadAvatar = async (file: File) => {
    setIsUploadingAvatar(true);
    setAvatarError(null);

    try {
      const prepared = await prepareImageForUpload(file);
      if (!prepared.file || prepared.error) {
        throw new Error(prepared.error || "Invalid image file");
      }

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        throw new Error("Not authenticated");
      }

      const uploadFile = prepared.file;
      const ext = uploadFile.name.split(".").pop() || "jpg";
      const random = Math.random().toString(36).substring(2, 15);
      const filePath = `${profile.id}-${random}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, uploadFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await onSave({ avatar_url: data.publicUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload avatar";
      setAvatarError(message);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void uploadAvatar(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ full_name: fullName, bio });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
      <CardHeader className="border-b border-white/8 bg-zinc-800 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2.5">
            <UserCog className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {t("editProfile")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-xs font-bold text-foreground px-1">{t("avatar")}</Label>
          <div className="flex flex-col items-start gap-3 rounded-lg border border-white/8 bg-zinc-800 p-4">
            <div className="relative">
              <AvatarWithBadge
                src={profile.avatar_url}
                fallback={profile.full_name || profile.username}
                isVerified={profile.is_verified_neighbor}
                size="lg"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70 backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="rounded-lg font-bold"
              >
                {isUploadingAvatar ? t("uploading") : t("edit")}
              </Button>
              <p className="text-xs text-muted-foreground font-medium">{t("uploadHint")}</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          {avatarError && <p className="text-xs font-semibold text-destructive px-1">{avatarError}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground px-1">{t("displayName")}</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            className="rounded-lg border border-white/10 bg-zinc-900 font-medium"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground px-1">{t("bio")}</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("bioPlaceholder")}
            className="min-h-[80px] rounded-lg border border-white/10 bg-zinc-900"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/8 bg-zinc-800 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 w-full rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? t("saving") : t("saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}