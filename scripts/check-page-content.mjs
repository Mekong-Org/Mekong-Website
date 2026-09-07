// Scans src/app/(pages) for content.json files and flags:
//   - missing/empty `title` or `metaDescription`
//   - metaDescription outside the ~120-160 char SEO guideline
//   - exact-match duplicate metaDescription across pages
import { promises as fs } from "fs";
import path from "path";

const PAGES_DIR = path.join(process.cwd(), "src", "app", "(pages)");

async function collectContentFiles(dir, slugPrefix) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results = [];

  if (entries.some((entry) => entry.isFile() && entry.name === "content.json")) {
    results.push({ slug: slugPrefix, file: path.join(dir, "content.json") });
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
    const nextPrefix = isRouteGroup ? slugPrefix : [...slugPrefix, entry.name];
    results.push(...(await collectContentFiles(path.join(dir, entry.name), nextPrefix)));
  }

  return results;
}

async function main() {
  const files = await collectContentFiles(PAGES_DIR, []);
  const errors = [];
  const warnings = [];
  const byMetaDescription = new Map();

  for (const { slug, file } of files) {
    const route = "/" + slug.join("/");
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw);

    if (!data.title) errors.push(`${route}: missing "title"`);
    if (!data.metaDescription) {
      errors.push(`${route}: missing "metaDescription"`);
    } else {
      const len = data.metaDescription.length;
      if (len < 120 || len > 160) {
        warnings.push(`${route}: metaDescription is ${len} chars (recommended ~120-160)`);
      }
      const existing = byMetaDescription.get(data.metaDescription);
      if (existing) {
        errors.push(`${route}: metaDescription duplicates ${existing}`);
      } else {
        byMetaDescription.set(data.metaDescription, route);
      }
    }
  }

  for (const warning of warnings) console.warn(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) found across ${files.length} page(s).`);
    process.exit(1);
  }

  console.log(`OK: ${files.length} page(s) checked, no missing/duplicate metaDescription.`);
}

main();
