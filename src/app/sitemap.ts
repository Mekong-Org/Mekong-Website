import type { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";
import { BASE_URL } from "@/constants/site";

const PAGES_DIR = path.join(process.cwd(), "src", "app", "(pages)");

type ContentFile = { slug: string[]; file: string };

// Walks the co-located (pages) tree, collecting one entry per folder that
// has a content.json. Route groups "(name)" don't contribute a URL segment;
// private folders "_name" are skipped, matching Next.js routing conventions.
async function collectContentFiles(
  dir: string,
  slugPrefix: string[],
): Promise<ContentFile[]> {
  let entries: import("fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: ContentFile[] = [];

  if (
    entries.some((entry) => entry.isFile() && entry.name === "content.json")
  ) {
    results.push({ slug: slugPrefix, file: path.join(dir, "content.json") });
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
    const nextPrefix = isRouteGroup ? slugPrefix : [...slugPrefix, entry.name];
    results.push(
      ...(await collectContentFiles(path.join(dir, entry.name), nextPrefix)),
    );
  }

  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    changeFrequency: "weekly",
    priority: 1,
  };

  const contentFiles = await collectContentFiles(PAGES_DIR, []);

  const pages = await Promise.all(
    contentFiles.map(async ({ slug, file }) => {
      let lastModified: Date | undefined;
      try {
        lastModified = (await fs.stat(file)).mtime;
      } catch {
        lastModified = undefined;
      }
      return {
        url: `${BASE_URL}/${slug.join("/")}`,
        lastModified,
        changeFrequency: "monthly" as const,
        // Top-level pages outrank their nested children.
        priority: slug.length > 1 ? 0.6 : 0.8,
      };
    }),
  );

  return [home, ...pages];
}
