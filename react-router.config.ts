import type { Config } from "@react-router/dev/config";
import { client } from "tina/__generated__/client";
import { LANGUAGE_CONFIG } from "./app/language-config";
import { parseFilename, getPostUrl } from "./app/file-helper";

// Destructure configuration
const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = LANGUAGE_CONFIG;

export default {
  // Config options...
  ssr: false,

  async prerender() {
    // Create an array to hold all routes
    const routes: string[] = [];

    // Add home route for default language (no prefix)
    routes.push("/");

    // Add home routes for non-default languages with language prefix
    SUPPORTED_LANGUAGES.filter((lang) => lang !== DEFAULT_LANGUAGE).forEach(
      (lang) => {
        routes.push(`/${lang}`);
      }
    );

    // Add posts index route for default language (no prefix)
    routes.push("/posts");

    // Add posts index routes for non-default languages with language prefix
    SUPPORTED_LANGUAGES.filter((lang) => lang !== DEFAULT_LANGUAGE).forEach(
      (lang) => {
        routes.push(`/${lang}/posts`);
      }
    );

    // Fetch all post slugs from Tina CMS
    try {
      const postsResponse = await client.queries.postConnection();

      // Process each post
      postsResponse.data.postConnection.edges?.forEach((edge) => {
        if (!edge?.node) return;

        const filename = edge.node._sys.filename;
        const { baseName, language } = parseFilename(filename);

        // Add route based on language and base name
        routes.push(getPostUrl(baseName, language));
      });
    } catch (error) {
      console.error("Error fetching posts for prerendering:", error);
    }

    return routes;
  },
} satisfies Config;
