import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const posts = defineCollection({
  name: "posts",
  directory: "app/content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    type: z.enum(["essay", "article", "project"]).default("article"),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            keepBackground: true,
          },
        ],
      ],
    });

    // 읽기 시간 계산 (한글 기준 분당 500자)
    const content = document.content;
    const charCount = content.replace(/\s/g, "").length;
    const readingTime = Math.max(1, Math.ceil(charCount / 500));

    // 날짜 형식 변환
    const dateObj = new Date(document.date);
    const formattedDate = `${dateObj.getFullYear()}년 ${String(dateObj.getMonth() + 1).padStart(2, "0")}월 ${String(dateObj.getDate()).padStart(2, "0")}일`;

    // 목차 추출
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ level, text, id });
    }

    return {
      ...document,
      mdx,
      readingTime,
      headings,
      formattedDate,
    };
  },
});

export default defineConfig({
  collections: [posts],
});