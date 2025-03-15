import { defineConfig } from "tinacms";
import { LANGUAGE_CONFIG } from "~/language-config";

const { DEFAULT_LANGUAGE, SUFFIX_SEPARATOR } = LANGUAGE_CONFIG;

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        ui: {
          router: (props) => {
            const filename = props.document._sys.filename;
            const suffixPattern = new RegExp(`${SUFFIX_SEPARATOR}(\\w{2})$`);
            const match = filename.match(suffixPattern);

            // Extract language from file suffix
            const lang = match ? match[1] : DEFAULT_LANGUAGE;

            // Extract base name without language suffix
            const baseName = match
              ? filename.slice(0, -(SUFFIX_SEPARATOR.length + 2))
              : filename;

            // For default language, don't include the language prefix
            if (lang === DEFAULT_LANGUAGE) {
              return `/posts/${baseName}`;
            }
            
            return `/${lang}/posts/${baseName}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
