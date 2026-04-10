"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PetImageUpload } from "./PetImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useLocation } from "@/hooks/use-location";
import { createPetReportSchema } from "@/lib/validators";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function PetForm() {
  const router = useRouter();
  const { latitude, longitude, error: locationError } = useLocation();
  const [photoUrl, setPhotoUrl] = useState("");
  const [type, setType] = useState<"lost" | "found">("lost");
  const [species, setSpecies] = useState("dog");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!latitude || !longitude) {
      setError("Waiting for location... Please allow location access to continue.");
      setIsSubmitting(false);
      return;
    }

    const reportData = {
      type,
      species,
      name: name || undefined,
      breed: breed || undefined,
      color,
      description,
      photo_url: photoUrl || undefined,
      lat: latitude!,
      lng: longitude!,
    };

    const result = createPetReportSchema.safeParse(reportData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create report");
      }

      setSuccessId(data.data.id);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Report Submitted Successfully</h3>
          {type === "found" && (
            <p className="text-muted-foreground mb-4">
              We're checking our lost pet database for matches. Check back on the pet detail page!
            </p>
          )}
        </div>
        <Button asChild className="rounded-2xl shadow-lg w-full">
          <Link href={`/pets/${successId}`}>View Report Details</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-900/40 bg-zinc-900 p-3 text-sm font-medium text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Report Type</Label>
        <RadioGroup value={type} onValueChange={(v: "lost" | "found") => setType(v)} className="flex gap-4">
          <div className="flex flex-1 cursor-pointer items-center space-x-2 rounded-lg border border-white/10 bg-zinc-900 p-3" onClick={() => setType("lost")}>
            <RadioGroupItem value="lost" id="lost" />
            <Label htmlFor="lost" className="font-bold cursor-pointer">I lost a pet</Label>
          </div>
          <div className="flex flex-1 cursor-pointer items-center space-x-2 rounded-lg border border-white/10 bg-zinc-900 p-3" onClick={() => setType("found")}>
            <RadioGroupItem value="found" id="found" />
            <Label htmlFor="found" className="font-bold cursor-pointer">I found a pet</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Photo</Label>
        <PetImageUpload onUpload={setPhotoUrl} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Species</Label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="flex h-12 w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-0 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Color *</Label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} required placeholder="e.g. Black and white" className="h-12 rounded-lg border border-white/10 bg-zinc-900" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Name (if known)</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet's name" className="h-12 rounded-lg border border-white/10 bg-zinc-900" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Breed (optional)</Label>
          <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Golden Retriever" className="h-12 rounded-lg border border-white/10 bg-zinc-900" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Description *</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe distinctive features, where it was last seen, collar details, etc."
          className="min-h-[100px] rounded-lg border border-white/10 bg-zinc-900"
        />
      </div>

      {locationError && (
        <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
          We need your location to create this report. Please enable location permissions.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !latitude || !longitude}
        className="h-12 w-full rounded-lg text-lg font-bold uppercase tracking-wide"
      >
        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Report"}
      </Button>
    </form>
  );
}
