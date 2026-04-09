"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
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
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl mb-6 shadow-lg shadow-primary/20">
            U
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Sign in to your neighborhood</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-bold flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border/50 rounded-xl focus:ring-primary focus:border-primary font-medium text-foreground h-12"
                required
              />
            </div>
          </form>

          <Button
            form="login-form"
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-xl transition-all active:scale-95 disabled:opacity-50 tracking-wide uppercase mt-6"
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
