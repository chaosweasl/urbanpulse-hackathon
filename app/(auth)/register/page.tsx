"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { registerSchema } from "@/lib/validators";

/**
 * RegisterPage — User registration page.
 * Features a high-fidelity form for joining the UrbanPulse neighborhood.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate inputs
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push("/feed");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
            U
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Join the Pulse</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Create an account to join your neighborhood community.</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                  required
                />
              </div>
            </div>
          </form>

          <Button
            form="register-form"
            type="submit"
            disabled={isLoading}
            className="mt-6 h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold uppercase tracking-wide transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
