import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { shadcn } from "@clerk/themes";

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
    title: "Next Boiler",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: shadcn,
            }}
        >
            <html
                suppressHydrationWarning
                lang="en"
                className={figtree.variable}
            >
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider
                        enableSystem
                        disableTransitionOnChange
                        attribute="class"
                        defaultTheme="system"
                    >
                        <NextTopLoader showSpinner />
                        {children}
                        <Toaster closeButton position="top-center" />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
