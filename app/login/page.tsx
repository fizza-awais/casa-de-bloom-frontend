"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Invalid email or password.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans selection:bg-brand-primary/20 overflow-x-hidden px-4 py-8">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/bg_image.png"
          alt="Casa de Bloom Backdrop"
          fill
          priority
          className="object-cover object-center pointer-events-none brightness-[0.7] scale-105"
        />
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 mix-blend-multiply" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[28px] p-6 md:p-8 shadow-[0_24px_50px_rgba(31,27,36,0.15)] border border-white/60">
        
        {/* Sunshine Accent Tag */}
        <div className="flex justify-center">
          <span className="text-[11px] font-bold text-ui-text-main uppercase tracking-widest bg-brand-sunshine px-3 py-1 rounded-full inline-block mb-4 shadow-sm">
            Welcome Back
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-ui-text-main tracking-tight">
            Login
          </h1>
          <p className="text-xs text-ui-text-muted mt-1">
            Access your dashboard and register for upcoming events
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="relative border-b border-ui-border py-1 flex items-center group transition-colors focus-within:border-brand-primary">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-5 pb-1 placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-5 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary"
            >
              Email Address
            </label>
            <span className="w-4 h-4 text-ui-text-muted absolute right-1 bottom-1.5 group-focus-within:text-brand-primary transition-colors flex items-center justify-center">
              <Mail size={16} />
            </span>
          </div>

          {/* Password field */}
          <div className="relative border-b border-ui-border py-1 flex items-center group transition-colors focus-within:border-brand-primary">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-12 pt-5 pb-1 placeholder-transparent"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-5 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="w-8 h-8 text-ui-text-muted absolute right-0 bottom-0.5 hover:text-brand-primary transition-colors flex items-center justify-center cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              rounded="xl"
              fullWidth
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 text-xs text-ui-text-muted">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-brand-primary font-bold hover:underline cursor-pointer"
          >
            Register here
          </button>
        </div>
      </div>
    </main>
  );
}
