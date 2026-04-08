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
      <Card className="w-full max-w-md border-2 border-blue-100 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 bg-blue-50/50 border-b border-blue-100/50 pb-8 pt-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              <UserPlus className="text-white h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-blue-950 tracking-tight">
            Join the Pulse
          </CardTitle>
          <CardDescription className="text-blue-900/60 font-medium italic">
            Create an account to join your neighborhood community.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-xs font-black uppercase tracking-widest text-blue-900/40 px-1">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-blue-900/40 px-1">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-blue-900/40 px-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-blue-900/40 px-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-blue-50/20 border-blue-100/50 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium text-blue-950 h-12"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 bg-blue-50/20 border-t border-blue-100/50 p-6">
          <Button
            form="register-form"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 tracking-wide uppercase"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-blue-900/50 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors underline decoration-blue-200 underline-offset-4"
              >
                Log in here
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
