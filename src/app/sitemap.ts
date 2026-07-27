import type { MetadataRoute } from "next";
import { LIVE_PRODUCTS } from "@/config/products";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...LIVE_PRODUCTS.map((product) => ({
      url: `${siteConfig.baseUrl}${product.route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
