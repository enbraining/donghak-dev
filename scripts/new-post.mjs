#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import OpenAI from "openai";

// .env 파일 로드
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function translateToEnglish(koreanText) {
  if (!openai) {
    console.log("⚠️  OPENAI_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Translate this Korean blog post title to English. Return ONLY the translated title in lowercase, suitable for a URL slug (use hyphens instead of spaces, no special characters). Keep it concise.

Korean title: "${koreanText}"

English slug:`,
        },
      ],
    });

    const translated = response.choices[0]?.message?.content?.trim();

    if (translated) {
      return slugify(translated);
    }
  } catch (error) {
    console.log("⚠️  번역 실패:", error.message);
  }

  return null;
}

async function main() {
  console.log("\n📝 새 블로그 글 생성\n");

  const title = await question("제목: ");
  if (!title.trim()) {
    console.log("❌ 제목을 입력해주세요.");
    rl.close();
    return;
  }

  console.log("🔄 파일명 생성 중...");
  let slug = await translateToEnglish(title);

  if (!slug) {
    const manualSlug = await question("파일명 (영문): ");
    slug = slugify(manualSlug);
  } else {
    console.log(`💡 생성된 파일명: ${slug}`);
    const confirm = await question("사용할까요? (Y/n): ");
    if (confirm.toLowerCase() === "n") {
      const manualSlug = await question("파일명 (영문): ");
      slug = slugify(manualSlug);
    }
  }

  if (!slug) {
    console.log("❌ 파일명을 입력해주세요.");
    rl.close();
    return;
  }

  const category = await question("카테고리: ");
  if (!category.trim()) {
    console.log("❌ 카테고리를 입력해주세요.");
    rl.close();
    return;
  }

  const description = await question("설명 (선택): ");
  const tagsInput = await question("태그 (쉼표 구분, 선택): ");
  const series = await question("시리즈 (선택): ");

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const date = getToday();
  const fileName = `${slug}.mdx`;
  const filePath = path.join(process.cwd(), "app", "content", fileName);

  if (fs.existsSync(filePath)) {
    console.log(`❌ 이미 존재하는 파일입니다: ${fileName}`);
    rl.close();
    return;
  }

  let frontmatter = `---
title: "${title}"
category: "${category}"
date: "${date}"`;

  if (description) {
    frontmatter += `\ndescription: "${description}"`;
  }

  if (tags.length > 0) {
    frontmatter += `\ntags: [${tags.map((t) => `"${t}"`).join(", ")}]`;
  }

  if (series) {
    frontmatter += `\nseries: "${series}"`;
  }

  frontmatter += `\n---

# ${title}

여기에 내용을 작성하세요.
`;

  fs.writeFileSync(filePath, frontmatter, "utf-8");

  console.log(`\n✅ 생성 완료: app/content/${fileName}`);
  console.log(`📅 날짜: ${date}`);
  console.log(`🏷️  카테고리: ${category}`);
  if (tags.length > 0) console.log(`🔖 태그: ${tags.join(", ")}`);
  if (series) console.log(`📚 시리즈: ${series}`);

  rl.close();
}

main().catch((err) => {
  console.error("오류:", err);
  rl.close();
  process.exit(1);
});
