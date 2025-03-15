import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link, redirect, useLoaderData } from "react-router";
import { client } from "tina/__generated__/client";
import { getPostUrl, parseFilename } from "~/file-helper";
import { LANGUAGE_CONFIG } from "~/language-config";
import type { Route } from "./+types/home";

interface Post {
  slug: string;
  title: string;
}

// Define the type for our loader data
interface LoaderData {
  posts: Post[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog Posts" },
    {
      name: "description",
      content: "Browse our collection of blog posts",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { language = LANGUAGE_CONFIG.DEFAULT_LANGUAGE } = params;
  const postsResponse = await client.queries.postConnection();

  if (!LANGUAGE_CONFIG.SUPPORTED_LANGUAGES.includes(language)) {
    redirect("/404", {
      status: 404,
    });
    return { posts: {} };
  }

  return {
    posts:
      postsResponse.data.postConnection.edges
        ?.filter((edge) => {
          if (!edge?.node) return false;

          const filename = edge.node._sys.filename;
          const { language: _language } = parseFilename(filename);
          return _language === language;
        })
        ?.map((edge) => {
          const filename = edge?.node?._sys.filename ?? "";
          const { baseName, language } = parseFilename(filename);

          return {
            slug: getPostUrl(baseName, language),
            title: edge?.node?.title || edge?.node?._sys.filename,
          };
        }) ?? [],
  };
}

export default function BlogsRoute() {
  const { posts } = useLoaderData() as LoaderData;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1}>Blog Posts</Title>
        <Text c="dimmed" size="lg">
          Browse our latest articles and insights
        </Text>

        <Grid>
          {posts.map((post) => (
            <Grid.Col key={post.slug} span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>{post.title}</Title>

                  <Button
                    component={Link}
                    to={post.slug}
                    variant="light"
                    color="blue"
                    fullWidth
                  >
                    Read Article
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {posts.length === 0 && (
          <Text ta="center" mt="xl">
            No blog posts available. Check back soon!
          </Text>
        )}
      </Stack>
    </Container>
  );
}
