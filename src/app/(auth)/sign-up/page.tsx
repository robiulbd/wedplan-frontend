"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { getDashboardPathByRole } from "@/utils/roleRedirect";
import { SignupRole, UserRole } from "@/types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

interface JwtEndpointResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    role?: UserRole;
  };
}

function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  return null;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<SignupRole>("customer");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        uploadedImageUrl = await uploadImageToImgBB(imageFile);
      }

      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await signUp.email({
        name: name.trim(),
        email: normalizedEmail,
        password,
        image: uploadedImageUrl || undefined,
      });

      if (error || !data) {
        throw new Error(error?.message || "Registration failed");
      }

      // ব্যাকএন্ডে রোল সিঙ্ক ও JWT টোকেন সংগ্রহ
      const tokenRes = await fetch(`${API_BASE_URL}/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          role,
        }),
      });

      const tokenData = (await tokenRes.json()) as JwtEndpointResponse;

      if (!tokenRes.ok || !tokenData.success || !tokenData.token) {
        throw new Error(
          tokenData.message ||
            "Your account was created, but the session token could not be initialized. Please sign in."
        );
      }

      localStorage.setItem("wedplan_jwt", tokenData.token);

      const finalRole: UserRole = tokenData.user?.role || role;

      toast.success("Account created successfully!");
      router.push(getDashboardPathByRole(finalRole));
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register account";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
          Create Your WedPlan Account
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Join as a Customer or Wedding Vendor
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="sign-up-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="sign-up-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="sign-up-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="sign-up-email"
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
              htmlFor="sign-up-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="sign-up-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
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

          <div>
            <label
              htmlFor="sign-up-role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Role
            </label>
            <select
              id="sign-up-role"
              value={role}
              onChange={(e) => setRole(e.target.value as SignupRole)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sign-up-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Image (Optional)
            </label>
            <input
              id="sign-up-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-medium text-sm transition cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-medium text-sm transition cursor-pointer"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-rose-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}