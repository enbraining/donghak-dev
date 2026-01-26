import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
import rehypePrettyCode from "rehype-pretty-code";

const posts = defineCollection({
  name: "posts",
  directory: "app/content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            keepBackground: true,
          },
        ],
      ],
    });
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
