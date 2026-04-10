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

interface EditProfileFormProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export function EditProfileForm({ profile, onSave }: EditProfileFormProps) {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const ext = file.name.split(".").pop() || "png";
      const random = Math.random().toString(36).substring(2, 15);
      const filePath = `${profile.id}-${random}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

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
    <Card className="w-full bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
      <CardHeader className="bg-muted/30 border-b border-border/50 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <UserCog className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-black text-foreground tracking-tight">
            Edit Profile
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <Label className="text-xs font-bold text-foreground px-1">Avatar</Label>
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4">
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
                className="rounded-xl font-bold"
              >
                {isUploadingAvatar ? "Uploading..." : "Edit"}
              </Button>
              <p className="text-xs text-muted-foreground font-medium">Upload a new profile photo.</p>
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
          <Label className="text-xs font-bold text-foreground px-1">Display Name</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="bg-muted/50 border-border/50 rounded-xl font-medium"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground px-1">Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your neighbors a bit about yourself..."
            className="rounded-xl min-h-[80px]"
          />
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t border-border/50 p-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}