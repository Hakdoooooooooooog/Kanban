import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kanban App",
    short_name: "Kanban",
    description: "A Kanban board application built with React and TypeScript.",
    start_url: "/",
    theme_color: "#635fc7",
    background_color: "#a8a4ff",
    display: "standalone",
    icons: [
      {
        src: "/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
