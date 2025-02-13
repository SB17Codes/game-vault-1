import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Providers } from "@/components/providers/QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Catalog & Recommendation Platform",
  description: "Discover and track your favorite games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Providers>
        <html lang="en" className="dark">
          <body className={`${inter.className} bg-black text-white`}>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
