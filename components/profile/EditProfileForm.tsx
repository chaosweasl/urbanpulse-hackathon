"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, UserCog } from "lucide-react";
import type { Profile } from "@/types";

interface EditProfileFormProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export function EditProfileForm({ profile, onSave }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isSaving, setIsSaving] = useState(false);

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