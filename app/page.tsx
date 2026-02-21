"use client";

import { allPosts } from "content-collections";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Line = { text: string; href?: string; blank?: boolean };

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"NORMAL" | "INSERT">("NORMAL");
  const searchRef = useRef<HTMLInputElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseBlocked = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((post) => post.category));
    return Array.from(cats);
  }, []);

  const projects = useMemo(() => {
    const uniqueProjects = Array.from(
      new Map(
        allPosts
          .filter((post) => {
            if (post.type !== "project") return false;
            const matchesSearch =
              searchQuery === "" ||
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
              selectedCategory === null || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
          })
          .map((post) => [post._meta.fileName, post])
      ).values()
    );
    return uniqueProjects.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [searchQuery, selectedCategory]);

  const { essays, articles } = useMemo(() => {
    const filtered = allPosts
      .filter((post) => {
        if (post.type === "project") return false;
        const matchesSearch =
          searchQuery === "" ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === null || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      essays: filtered.filter((post) => post.type === "essay"),
      articles: filtered.filter((post) => post.type !== "essay"),
    };
  }, [searchQuery, selectedCategory]);

  const lines: Line[] = useMemo(() => {
    const l: Line[] = [];
    l.push({ text: "김동학" });
    l.push({ text: "소프트웨어 & 클라우드 아키텍트" });
    l.push({ text: "" , blank: true });
    l.push({ text: "제공하는 사람과 제공받는 사람의 이해 관계, 그 사이에서" });
    l.push({ text: "심리학과 소프트웨어 공학을 통해 유연한 상호작용을 만듭니다." });
    l.push({ text: "현재 으뜸정보기술에서 솔루션 아키텍트로 일하고 있습니다." });
    l.push({ text: "", blank: true });
    // 이력
    l.push({ text: "# 이력" });
    l.push({ text: "2026 ~       서울사이버대학교 심리학과" });
    l.push({ text: "2025 ~       으뜸정보기술" });
    l.push({ text: "2023 ~ 2026  광주소프트웨어마이스터고등학교 스마트IoT과" });
    l.push({ text: "2017 ~ 2022  가야금" });
    l.push({ text: "", blank: true });
    // 자격증
    l.push({ text: "# 자격증" });
    l.push({ text: "AWS Solutions Architect Associate" });
    l.push({ text: "NHN Cloud Essentials" });
    l.push({ text: "정보처리산업기사" });
    l.push({ text: "전자산업기사" });
    l.push({ text: "전기기능사" });
    l.push({ text: "아마추어무선기사 4급" });
    l.push({ text: "", blank: true });
    // 링크
    l.push({ text: "# 링크" });
    l.push({ text: "email", href: "mailto:enbraining@gmail.com" });
    l.push({ text: "github", href: "https://github.com/enbraining" });
    l.push({ text: "youtube", href: "https://youtube.com/@enbraining" });
    l.push({ text: "archive", href: "/archive" });
    l.push({ text: "rss", href: "/feed.xml" });
    l.push({ text: "", blank: true });
    // 프로젝트
    if (projects.length > 0) {
      l.push({ text: "# 프로젝트" });
      projects.forEach((p) =>
        l.push({ text: p.title, href: p._meta.fileName })
      );
      l.push({ text: "", blank: true });
    }
    // 글
    l.push({ text: "# 글" });
    if (articles.length > 0) {
      articles.forEach((p) =>
        l.push({ text: `${p.title}  ${p.formattedDate}`, href: p._meta.fileName })
      );
    } else {
      l.push({ text: searchQuery || selectedCategory ? "검색 결과 없음" : "글 준비 중" });
    }
    l.push({ text: "", blank: true });
    // 뻘글
    l.push({ text: "# 뻘글" });
    if (essays.length > 0) {
      essays.forEach((p) =>
        l.push({ text: `${p.title}  ${p.formattedDate}`, href: p._meta.fileName })
      );
    } else {
      l.push({ text: searchQuery || selectedCategory ? "검색 결과 없음" : "musings 준비 중" });
    }
    return l;
  }, [projects, articles, essays, searchQuery, selectedCategory]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(lines.length - 1, 0)));
  }, [lines.length]);

  useEffect(() => {
    if (!mouseBlocked.current) return;
    const el = lineRefs.current[cursor];
    if (el) {
      const rect = el.getBoundingClientRect();
      const margin = window.innerHeight * 0.15;
      if (rect.bottom > window.innerHeight - margin) {
        window.scrollBy({ top: rect.bottom - (window.innerHeight - margin) });
      } else if (rect.top < margin) {
        window.scrollBy({ top: rect.top - margin });
      }
    }
  }, [cursor]);

  useEffect(() => {
    const unblock = (e: MouseEvent) => {
      if (Math.abs(e.clientX - lastMousePos.current.x) > 3 || Math.abs(e.clientY - lastMousePos.current.y) > 3) {
        mouseBlocked.current = false;
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", unblock);
    return () => window.removeEventListener("mousemove", unblock);
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (mode === "INSERT") {
        if (e.key === "Escape") {
          e.preventDefault();
          setMode("NORMAL");
          setSearchQuery("");
          searchRef.current?.blur();
        }
        return;
      }

      const len = lines.length;
      if (len === 0) return;

      switch (e.key) {
        case "j":
          e.preventDefault();
          mouseBlocked.current = true;
          setCursor((c) => Math.min(c + 1, len - 1));
          break;
        case "k":
          e.preventDefault();
          mouseBlocked.current = true;
          setCursor((c) => Math.max(c - 1, 0));
          break;
        case "g":
          e.preventDefault();
          mouseBlocked.current = true;
          setCursor(0);
          break;
        case "G":
          e.preventDefault();
          mouseBlocked.current = true;
          setCursor(len - 1);
          break;
        case "Enter": {
          e.preventDefault();
          const item = lines[cursor];
          if (item?.href) {
            if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
              window.open(item.href, "_blank");
            } else {
              router.push(item.href);
            }
          }
          break;
        }
        case "/":
          e.preventDefault();
          setMode("INSERT");
          searchRef.current?.focus();
          break;
        case "Escape":
          e.preventDefault();
          setSearchQuery("");
          setSelectedCategory(null);
          break;
      }
    },
    [mode, lines, cursor, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <main className="min-h-screen font-mono text-[13px] leading-[1.6] pb-12 break-words">
      {/* Search bar (hidden until / pressed) */}
      <input
        ref={searchRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setMode("INSERT")}
        onBlur={() => { setMode("NORMAL"); setSearchQuery(""); }}
        className="sr-only"
      />

      {/* Lines */}
      <div className="py-6 px-4 md:px-6">
        {lines.map((line, i) => {
          const selected = cursor === i;
          return (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              onMouseEnter={() => { if (!mouseBlocked.current) setCursor(i); }}
              onClick={() => {
                setCursor(i);
                if (line.href) {
                  if (line.href.startsWith("http") || line.href.startsWith("mailto:")) {
                    window.open(line.href, "_blank");
                  } else {
                    router.push(line.href);
                  }
                }
              }}
              className={selected ? "bg-green-900/40 text-green-400" : "text-neutral-400"}
            >
              <span className="select-none">{selected ? "+" : " "} </span>
              {line.blank ? "\u00A0" : line.href ? <span className={selected ? "" : "text-teal-400"}>{`[[${line.text}]]`}</span> : line.text}
            </div>
          );
        })}
      </div>

      {/* Statusline */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-1 flex items-center justify-between text-[12px] font-mono">
        <div className="flex items-center gap-3">
          <span className={`px-1.5 py-0.5 font-bold ${
            mode === "NORMAL"
              ? "bg-neutral-100 text-neutral-900"
              : "bg-green-500 text-neutral-900"
          }`}>
            {mode}
          </span>
          <span className="text-neutral-500 truncate max-w-xs">
            {mode === "INSERT" ? `/${searchQuery}` : lines[cursor]?.text || ""}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-600">
          <span>j/k</span>
          <span>Enter</span>
          <span>/</span>
          <span>g/G</span>
          <span>{lines.length > 0 ? `${cursor + 1}:${lines.length}` : "0:0"}</span>
        </div>
        <div className="sm:hidden text-neutral-600">
          <span>{lines.length > 0 ? `${cursor + 1}:${lines.length}` : "0:0"}</span>
        </div>
      </div>
    </main>
  );
}
