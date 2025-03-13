import { Blockquote, Code, Text, Title } from "@mantine/core";
import React from "react";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";

interface CustomTinaMarkdownProps {
  content: TinaMarkdownContent;
}

export const CustomTinaMarkdown: React.FC<CustomTinaMarkdownProps> = ({
  content,
}) => {
  return <TinaMarkdown content={content} components={components} />;
};

const components = {
  h1: (props: any) => <Title order={1} mb="md" {...props} />,
  h2: (props: any) => <Title order={2} mb="md" {...props} />,
  h3: (props: any) => <Title order={3} mb="sm" {...props} />,
  h4: (props: any) => <Title order={4} mb="sm" {...props} />,
  h5: (props: any) => <Title order={5} mb="xs" {...props} />,
  h6: (props: any) => <Title order={6} mb="xs" {...props} />,
  p: (props: any) => <Text mb="md" {...props} />,
  ul: (props: any) => (
    <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }} {...props} />
  ),
  ol: (props: any) => (
    <ol style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }} {...props} />
  ),
  li: (props: any) => <li style={{ marginBottom: "0.25rem" }} {...props} />,
  blockquote: (props: any) => <Blockquote color="blue" mb="md" {...props} />,
  code_block: (props: any) => {
    return (
      <Code block lang={props.language} mb="md">
        {props.value}
      </Code>
    );
  },
};
