import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-registry";

const BASE_URL = "https://tinyclaw.dev";
const LOCALES = ["zh", "zh-tw", "es", "ja", "ko", "de", "fr", "pt", "ru", "ar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date("2026-02-20"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", BASE_URL],
          ["en", BASE_URL],
          ...LOCALES.map((l) => [l, `${BASE_URL}/${l}`]),
        ]),
      },
    },
  ];

  for (const locale of LOCALES) {
    pages.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date("2026-02-20"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", BASE_URL],
          ["en", BASE_URL],
          ...LOCALES.map((l) => [l, `${BASE_URL}/${l}`]),
        ]),
      },
    });
  }

  pages.push({
    url: `${BASE_URL}/tools`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  for (const tool of TOOLS) {
    pages.push({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  pages.push(
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-02-09"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2026-02-09"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  );

  return pages;
}
