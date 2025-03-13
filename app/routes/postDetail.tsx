import { Container, Paper, Stack, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { client } from "tina/__generated__/client";
import type { PostQuery } from "tina/__generated__/types";
import { CustomTinaMarkdown } from "~/components/CustomTinaMarkdown";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hello world" },
    {
      name: "description",
      content: "Hello world content from content directory",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  const result = await client.queries.post({
    relativePath: `${slug}.md`,
  });

  return { ...result };
}

export default function BlogDetailRoute() {
  const { data } = useLoaderData<{
    data: PostQuery;
    variables: {
      relativePath: string;
    };
    query: string;
  }>();

  const { title, body } = data.post;

  return (
    <Container size="md" py="xl">
      <Paper p="lg" shadow="sm" withBorder>
        <Stack gap="md">
          <Title order={1}>{title}</Title>

          <div className="tina-content">
            <CustomTinaMarkdown content={body} />
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}
