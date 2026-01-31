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

async function analyzeTitle(koreanText) {
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
          content: `Analyze this Korean blog post title and return a JSON object with:
1. "folder": broad topic category in English lowercase (e.g., "kubernetes", "react", "essay", "poetry"). Use null if it's a standalone post.
2. "slug": English filename slug (lowercase, hyphens, no special chars)

Return ONLY valid JSON, no markdown or explanation.

Korean title: "${koreanText}"

JSON:`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();

    // JSON 파싱 시도
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        folder: parsed.folder ? slugify(parsed.folder) : null,
        slug: parsed.slug ? slugify(parsed.slug) : null,
      };
    }
  } catch (error) {
    console.log("⚠️  분석 실패:", error.message);
  }

  return null;
}

function getNextNumber(folderPath) {
  if (!fs.existsSync(folderPath)) return 1;

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".mdx"));
  const numbers = files
    .map(f => parseInt(f.match(/^(\d+)-/)?.[1] || "0"))
    .filter(n => n > 0);

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

async function main() {
  console.log("\n📝 새 블로그 글 생성\n");

  const title = await question("제목: ");
  if (!title.trim()) {
    console.log("❌ 제목을 입력해주세요.");
    rl.close();
    return;
  }

  console.log("🔄 분석 중...");
  const analysis = await analyzeTitle(title);

  let folder = null;
  let slug = null;

  if (analysis) {
    // 폴더 제안
    if (analysis.folder) {
      console.log(`📁 추천 폴더: ${analysis.folder}`);
      const folderConfirm = await question("폴더에 저장할까요? (Y/n/직접입력): ");

      if (folderConfirm.toLowerCase() === "n") {
        folder = null;
      } else if (folderConfirm.toLowerCase() === "y" || folderConfirm === "") {
        folder = analysis.folder;
      } else {
        folder = slugify(folderConfirm);
      }
    } else {
      const useFolder = await question("폴더에 저장할까요? (폴더명 입력 또는 Enter로 건너뛰기): ");
      if (useFolder.trim()) {
        folder = slugify(useFolder);
      }
    }

    // 파일명 제안
    if (analysis.slug) {
      let suggestedSlug = analysis.slug;

      // 폴더 사용 시 번호 붙이기
      if (folder) {
        const folderPath = path.join(process.cwd(), "app", "content", folder);
        const nextNum = getNextNumber(folderPath);
        suggestedSlug = `${nextNum}-${analysis.slug}`;
      }

      console.log(`💡 추천 파일명: ${suggestedSlug}`);
      const slugConfirm = await question("사용할까요? (Y/n): ");

      if (slugConfirm.toLowerCase() === "n") {
        const manualSlug = await question("파일명 (영문): ");
        slug = slugify(manualSlug);
      } else {
        slug = suggestedSlug;
      }
    }
  }

  // 수동 입력 폴백
  if (!slug) {
    const manualSlug = await question("파일명 (영문): ");
    slug = slugify(manualSlug);
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

  // 경로 설정
  const contentDir = path.join(process.cwd(), "app", "content");
  const targetDir = folder ? path.join(contentDir, folder) : contentDir;
  const filePath = path.join(targetDir, fileName);
  const relativePath = folder ? `app/content/${folder}/${fileName}` : `app/content/${fileName}`;

  // 폴더 생성
  if (folder && !fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    console.log(`❌ 이미 존재하는 파일입니다: ${relativePath}`);
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

  console.log(`\n✅ 생성 완료: ${relativePath}`);
  console.log(`📅 날짜: ${date}`);
  console.log(`🏷️  카테고리: ${category}`);
  if (folder) console.log(`📁 폴더: ${folder}`);
  if (tags.length > 0) console.log(`🔖 태그: ${tags.join(", ")}`);
  if (series) console.log(`📚 시리즈: ${series}`);

  rl.close();
}

main().catch((err) => {
  console.error("오류:", err);
  rl.close();
  process.exit(1);
});
