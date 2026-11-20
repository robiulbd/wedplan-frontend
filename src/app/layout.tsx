import type { Metadata } from "next";
import { Toaster } from "sonner";
import AuthSync from "@/components/shared/AuthSync";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "WedPlan — Wedding Planning Platform",
  description:
    "Discover wedding services, book trusted vendors, and plan your special day with WedPlan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <AuthSync />
        {children}
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}