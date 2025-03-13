import { Container, Paper, Stack, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { client } from "tina/__generated__/client";
import type { Post } from "tina/__generated__/types";
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

export async function loader() {
  const postData = await client.queries.post({
    relativePath: "hello-world.md",
  });

  return { post: postData.data.post };
}

export default function HelloWorldRoute() {
  const { post } = useLoaderData<{ post: Post }>();
  const { title, body } = post;

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
