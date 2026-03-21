import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: env.APP_NAME,
        short_name: env.APP_NAME,
        description: "An app to help you build systems for success.",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
