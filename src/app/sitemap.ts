import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://helora.vercel.app";
  return ["", "/dentists", "/restaurants", "/hotels", "/templates", "/demo"].map(
    (path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );
}
