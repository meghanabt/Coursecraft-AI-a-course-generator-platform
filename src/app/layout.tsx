import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans  } from "next/font/google";
import { Provider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";


const lexend = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseCraft-AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(lexend.className, "antialiased min-h-screen pt-16")}>
        <Provider>
          <Navbar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}