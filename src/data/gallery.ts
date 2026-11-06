import type { TextureCategory } from "@/types";

export type GalleryItem =
  | { id: string; type: "image"; src: string; title: string; location: string; category: TextureCategory }
  | {
      id: string;
      type: "video";
      /** Poster image shown in the grid and before playback */
      src: string;
      title: string;
      location: string;
      category: TextureCategory;
      /** Provide ONE of: a YouTube video id, or a path/URL to an mp4 file in /public/videos */
      youtubeId?: string;
      file?: string;
    };

/**
 * Project gallery. To add a video, append an entry like:
 *   { id: "v1", type: "video", src: "/images/proj-dha-villa42.jpg", title: "Villa 42 time-lapse",
 *     location: "DHA Phase 6", category: "Rockwall", youtubeId: "dQw4w9WgXcQ" }
 * To use a self-hosted file instead, drop it in /public/videos and set `file: "/videos/villa42.mp4"`.
 * Replace the (low-resolution) photos below with real project photos of the same names, or change `src`.
 */
export const galleryItems: GalleryItem[] = [
  { id: "g1", type: "image", src: "/images/proj-dha-villa42.jpg", title: "Villa 42 Facade Overhaul", location: "DHA Phase 6", category: "Rockwall" },
  { id: "g2", type: "image", src: "/images/after.jpg", title: "Italian Travertine Feature Wall", location: "DHA Phase 6", category: "Travertine" },
  { id: "g3", type: "image", src: "/images/rw-dha-villa42.jpg", title: "Villa 42 Main Elevation", location: "DHA Phase 6", category: "Rockwall" },
  { id: "g4", type: "image", src: "/images/proj-bahria-residence.jpg", title: "Contemporary Residence", location: "Bahria Town Sector C", category: "Graffiato" },
  { id: "g5", type: "image", src: "/images/rw-bahria-wall.jpg", title: "Boundary Perimeter Wall", location: "Bahria Town Sector C", category: "Rockwall" },
  { id: "g6", type: "image", src: "/images/proj-gulberg-penthouse.jpg", title: "Penthouse Accent Wall", location: "Gulberg III", category: "Microcement" },
  { id: "g7", type: "image", src: "/images/rw-gulberg-pillars.jpg", title: "Contemporary Porch Pillars", location: "Gulberg III", category: "Rockwall" },
  { id: "g8", type: "image", src: "/images/proj-johar-villa.jpg", title: "Modern Villa Elevation", location: "Johar Town Phase 2", category: "Rockwall" },
  { id: "g9", type: "image", src: "/images/rw-lake-city.jpg", title: "Modern Front Facade", location: "Lake City", category: "Rockwall" },
  { id: "g10", type: "image", src: "/images/proj-model-town-bungalow.jpg", title: "Executive Bungalow", location: "Model Town", category: "Stucco" },
  { id: "g11", type: "image", src: "/images/rw-model-town.jpg", title: "Perimeter Wall & Planters", location: "Model Town, Block G", category: "Rockwall" },
  { id: "g12", type: "image", src: "/images/proj-wapda-showroom.jpg", title: "Design Studio Gallery", location: "WAPDA Town", category: "Travertine" },
  { id: "g13", type: "image", src: "/images/rw-mm-alam.jpg", title: "Commercial Plaza Elevation", location: "MM Alam Road, Gulberg", category: "Rockwall" },
  { id: "g14", type: "image", src: "/images/tex-colorcrete.jpg", title: "Terracotta Microcement Bedroom", location: "Lahore", category: "Microcement" },
];
