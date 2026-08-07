import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutoBrowse",
    short_name: "AutoBrowse",
    description:
      "Build and run AI-powered browser automation workflows on a visual canvas.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/assets/auto_browse_fav.jpeg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  }
}
