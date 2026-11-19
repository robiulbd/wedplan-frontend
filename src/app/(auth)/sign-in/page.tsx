"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/utils/roleRedirect";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (error || !data) {
        throw new Error(error?.message || "Invalid email or password");
      }

      let resolvedRole = "customer";
      const tokenRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/jwt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData.token) {
          localStorage.setItem("wedplan_jwt", tokenData.token);
        }
        if (tokenData.user?.role) {
          resolvedRole = tokenData.user.role;
        }
      }

      toast.success("Signed in successfully!");

      // Support "/sign-in?redirect=/services/<id>" used by ServiceCard.
      const redirectParam = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      const destination =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : getDashboardPathByRole(resolvedRole);

      router.push(destination);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer/overview",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-rose-50/40">
      <div className="w-full max-w-md bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Welcome Back to WedPlan
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Sign in to manage your wedding plans or services
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="sign-in-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="sign-in-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="sign-in-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="sign-in-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-medium text-sm transition cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-medium text-sm transition cursor-pointer"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-5">
          New to WedPlan?{" "}
          <Link href="/sign-up" className="text-rose-600 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}