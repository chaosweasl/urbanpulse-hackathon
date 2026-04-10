"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validators";

/**
 * LoginPage — User login page.
 * Features a clean, centered form for email and password authentication.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate inputs
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to log in");
        setIsLoading(false);
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
            U
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Sign in to your neighborhood</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="px-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border border-white/10 bg-zinc-900 font-medium text-foreground focus:ring-0 focus:border-primary/50"
                required
              />
            </div>
          </form>

          <Button
            form="login-form"
            type="submit"
            disabled={isLoading}
            className="mt-6 h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold uppercase tracking-wide transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              No account?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
