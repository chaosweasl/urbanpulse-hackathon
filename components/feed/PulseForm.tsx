"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { createPulseSchema, updatePulseSchema } from "@/lib/validators";
import type { Pulse, PulseCategory, PulseUrgency } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface PulseFormProps {
  pulse?: Pulse; // Optional pulse for edit mode
  onSuccess?: () => void;
}

export function PulseForm({ pulse, onSuccess }: PulseFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const supabase = createClient();

  const isEditMode = !!pulse;

  const [formData, setFormData] = useState({
    title: pulse?.title || "",
    description: pulse?.description || "",
    category: pulse?.category || "item" as PulseCategory,
    urgency: pulse?.urgency || "low" as PulseUrgency,
    lat: pulse?.location?.lat || 0,
    lng: pulse?.location?.lng || 0,
    photo_url: pulse?.photo_url || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [manuallySetUrgency, setManuallySetUrgency] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `pulse-photos/${fileName}`;

      const { error } = await supabase.storage
        .from('pulses')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pulses')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setErrors(prev => ({ ...prev, photo: message }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const schema = isEditMode ? updatePulseSchema : createPulseSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditMode ? `/api/pulses/${pulse?.id}` : "/api/pulses";
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setErrors({ form: data.error || "Something went wrong" });
        setIsSubmitting(false);
        return;
      }

      router.refresh();
      if (onSuccess) onSuccess();
      if (!isEditMode) router.push("/feed");
    } catch (err) {
      setErrors({ form: "Failed to connect to the server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set initial location from browser if not in edit mode
  useEffect(() => {
    if (!isEditMode && latitude && longitude && formData.lat === 0) {
      setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
    }
  }, [latitude, longitude, isEditMode, formData.lat]);

  // Urgency auto-highlight
  useEffect(() => {
    if (manuallySetUrgency) return;

    const urgentWords = ["emergency", "urgent"];
    const hasUrgentWord = urgentWords.some(word =>
      formData.description.toLowerCase().includes(word)
    );

    if (hasUrgentWord && formData.urgency !== "high" && formData.urgency !== "critical") {
      setFormData(prev => ({ ...prev, urgency: "high" }));
    }
  }, [formData.description, formData.urgency, manuallySetUrgency]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Pulse" : "Create a Pulse"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="pulse-form" onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.form}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's happening?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell your neighbors more..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as PulseCategory })}
              >
                <option value="emergency">Emergency</option>
                <option value="skill">Skill</option>
                <option value="item">Item</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => {
                  setFormData({ ...formData, urgency: e.target.value as PulseUrgency });
                  setManuallySetUrgency(true);
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start overflow-hidden"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {formData.lat !== 0
                    ? `${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`
                    : "Pick Location"}
                </span>
              </Button>
              {showMap && (
                <div className="p-4 border rounded-xl bg-muted/50 text-xs text-center">
                  <p className="mb-2 font-medium">Map Picker Simulation</p>
                  <p className="text-muted-foreground mb-4">In a real app, clicking the map would set coordinates.</p>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, lat: 40.7128, lng: -74.0060 }));
                      setShowMap(false);
                    }}
                  >
                    Simulate New York Selection
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="mr-2 h-4 w-4" />
                    )}
                    <span className="truncate">
                      {formData.photo_url ? "Photo Added" : "Add Photo"}
                    </span>
                  </label>
                </Button>
              </div>
              {formData.photo_url && (
                <div className="relative aspect-video rounded-xl overflow-hidden border">
                  <Image
                    src={formData.photo_url}
                    alt="Pulse preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    size="icon-xs"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, photo_url: "" }))}
                  >
                    ×
                  </Button>
                </div>
              )}
              {errors.photo && <p className="text-xs text-destructive">{errors.photo}</p>}
            </div>
          </div>

        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button form="pulse-form" type="submit" disabled={isSubmitting || !user}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Update Pulse" : "Post Pulse"}
        </Button>
      </CardFooter>
    </Card>
  );
}
