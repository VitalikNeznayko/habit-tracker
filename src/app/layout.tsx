import LayoutComponent from "@/components/Layout/LayoutComponent/LayoutComponent";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A focused habit tracker for daily routines and streaks.",
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="flex min-h-screen flex-col antialiased">
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}

export default Layout;
