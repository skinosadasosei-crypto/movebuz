import { GoogleAuth } from "google-auth-library";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";
const INDEXNOW_KEY = "fe39ac4954bec833c5e01f217de6861a";

async function submitSitemapToGoogle() {
  const credentialsJson = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    console.log("[Google] GA4_SERVICE_ACCOUNT_JSON not set, skipping");
    return;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/webmasters"],
    });
    const client = await auth.getClient();

    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const encodedSiteUrl = encodeURIComponent(SITE_URL + "/");
    const encodedSitemapUrl = encodeURIComponent(sitemapUrl);
    const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemapUrl}`;

    const res = await client.request({ url: apiUrl, method: "PUT" });
    console.log(`[Google] Sitemap submitted: ${sitemapUrl} (status: ${res.status})`);
  } catch (err) {
    console.log(`[Google] Sitemap submission failed: ${err.message}`);
    console.log("[Google] Ensure the service account is added as a user in Search Console");
  }
}

function getAllPublishedSlugs() {
  const articlesDir = join(process.cwd(), "content", "articles");
  try {
    return readdirSync(articlesDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", ""));
  } catch {
    return [];
  }
}

async function notifyIndexNow() {
  const slugs = getAllPublishedSlugs();
  if (slugs.length === 0) {
    console.log("[IndexNow] No articles found, skipping");
    return;
  }

  const urlList = [
    SITE_URL,
    `${SITE_URL}/blog`,
    ...slugs.map((s) => `${SITE_URL}/blog/${s}`),
  ];

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
    console.log(`[IndexNow] Notified ${urlList.length} URLs (status: ${res.status})`);
  } catch (err) {
    console.log(`[IndexNow] Notification failed: ${err.message}`);
  }
}

async function main() {
  console.log("=== Search Engine Notification ===");
  console.log(`Site: ${SITE_URL}`);

  await Promise.all([submitSitemapToGoogle(), notifyIndexNow()]);

  console.log("=== Done ===");
}

main().catch(console.error);
