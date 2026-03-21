import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { InstantAuth } from "@/components/InstantAuth";
import { env } from "@/env";
import { Providers } from "./providers";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: env.APP_NAME,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning lang="en" className={figtree.variable}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <InstantAuth />
                    {children}
                    <Toaster closeButton richColors position="top-center" />
                </Providers>
            </body>
        </html>
    );
}
