"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
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
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl mb-6 shadow-lg shadow-primary/20">
            U
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Join the Pulse</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Create an account to join your neighborhood community.</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-bold flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                  required
                />
              </div>
            </div>
          </form>

          <Button
            form="register-form"
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50 tracking-wide uppercase mt-6"
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
