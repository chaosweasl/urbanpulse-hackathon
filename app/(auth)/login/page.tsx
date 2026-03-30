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

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-blue-100 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 bg-blue-50/50 border-b border-blue-100/50 pb-8 pt-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              <LogIn className="text-white h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-blue-950 tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-blue-900/60 font-medium italic">
            Log in to connect with your neighbors.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-blue-900/40 px-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-blue-900/40">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 bg-blue-50/20 border-t border-blue-100/50 p-6">
          <Button
            form="login-form"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 tracking-wide uppercase"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-blue-900/50 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors underline decoration-blue-200 underline-offset-4"
              >
                Register here
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
