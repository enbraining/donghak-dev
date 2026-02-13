"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { allPosts, Post } from "content-collections";
import { useRouter } from "next/navigation";

type Line = { text: string; href?: string; nav?: boolean; jumpTo?: number };

function styleLine(text: string, selected: boolean): React.ReactNode {
  if (!text) return "\u00A0";

  const base = selected ? "" : "";

  // --- separator
  if (/^-{3,}$/.test(text.trim())) {
    return <span className={selected ? "" : "text-neutral-700"}>{"─".repeat(40)}</span>;
  }

  // headings
  const headingMatch = text.match(/^(#{1,4})\s+(.*)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const content = headingMatch[2];
    const colors = selected
      ? ""
      : level === 1
        ? "text-white font-bold"
        : level === 2
          ? "text-neutral-100"
          : "text-neutral-200";
    return (
      <>
        <span className={selected ? "" : "text-neutral-400"}>{headingMatch[1]} </span>
        <span className={colors}>{renderInline(content, selected)}</span>
      </>
    );
  }

  // code fence
  if (text.startsWith("```")) {
    return <span className={selected ? "" : "text-yellow-600"}>{text}</span>;
  }

  // blockquote
  if (text.startsWith(">")) {
    return (
      <>
        <span className={selected ? "" : "text-neutral-600"}>{">"}</span>
        <span className={selected ? "" : "text-neutral-400"}>{renderInline(text.slice(1), selected)}</span>
      </>
    );
  }

  // unordered list
  const ulMatch = text.match(/^(\s*)([-*])\s(.*)$/);
  if (ulMatch) {
    return (
      <>
        <span>{ulMatch[1]}</span>
        <span className={selected ? "" : "text-neutral-600"}>{ulMatch[2]} </span>
        <span>{renderInline(ulMatch[3], selected)}</span>
      </>
    );
  }

  // ordered list
  const olMatch = text.match(/^(\s*)(\d+\.)\s(.*)$/);
  if (olMatch) {
    return (
      <>
        <span>{olMatch[1]}</span>
        <span className={selected ? "" : "text-neutral-600"}>{olMatch[2]} </span>
        <span>{renderInline(olMatch[3], selected)}</span>
      </>
    );
  }

  return renderInline(text, selected);
}

function renderInline(text: string, selected: boolean): React.ReactNode {
  // Split by inline patterns: **bold**, `code`, [link](url)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // bold **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
    // inline code `text`
    const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/s);
    // link [text](url)
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)/s);

    // find earliest match
    let earliest: { type: string; idx: number; match: RegExpMatchArray } | null = null;

    if (boldMatch && boldMatch[1] !== undefined) {
      const idx = boldMatch[1].length;
      if (!earliest || idx < earliest.idx) earliest = { type: "bold", idx, match: boldMatch };
    }
    if (codeMatch && codeMatch[1] !== undefined) {
      const idx = codeMatch[1].length;
      if (!earliest || idx < earliest.idx) earliest = { type: "code", idx, match: codeMatch };
    }
    if (linkMatch && linkMatch[1] !== undefined) {
      const idx = linkMatch[1].length;
      if (!earliest || idx < earliest.idx) earliest = { type: "link", idx, match: linkMatch };
    }

    if (!earliest) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const m = earliest.match;

    if (earliest.type === "bold") {
      if (m[1]) parts.push(<span key={key++}>{m[1]}</span>);
      parts.push(
        <span key={key++} className={selected ? "font-bold" : "font-bold text-neutral-200"}>
          {m[2]}
        </span>
      );
      remaining = m[3];
    } else if (earliest.type === "code") {
      if (m[1]) parts.push(<span key={key++}>{m[1]}</span>);
      parts.push(
        <span key={key++} className={selected ? "" : "text-red-400"}>
          `{m[2]}`
        </span>
      );
      remaining = m[3];
    } else if (earliest.type === "link") {
      if (m[1]) parts.push(<span key={key++}>{m[1]}</span>);
      parts.push(
        <span key={key++} className={selected ? "" : "text-teal-400"}>
          {m[2]}
        </span>
      );
      remaining = m[4];
    }
  }

  return <>{parts}</>;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [cursor, setCursor] = useState(0);
  const [cmdBuf, setCmdBuf] = useState("");
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseBlocked = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    params.then(({ id }) => setId(decodeURIComponent(id)));
  }, [params]);

  useEffect(() => {
    if (id) {
      const found = allPosts.find((p) => p._meta.fileName === id);
      if (found) setPost(found);
    }
  }, [id]);

  const { prevPost, nextPost } = useMemo(() => {
    if (!post) return { prevPost: null, nextPost: null };
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const idx = sorted.findIndex((p) => p._meta.fileName === post._meta.fileName);
    return {
      prevPost: idx < sorted.length - 1 ? sorted[idx + 1] : null,
      nextPost: idx > 0 ? sorted[idx - 1] : null,
    };
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter((p) => p.category === post.category && p._meta.fileName !== post._meta.fileName)
      .slice(0, 3);
  }, [post]);

  const lines: Line[] = useMemo(() => {
    if (!post) return [];
    const l: Line[] = [];

    l.push({ text: "돌아가기", href: "/", nav: true });
    l.push({ text: "" });
    l.push({ text: `# ${post.title}` });
    l.push({ text: `${post.formattedDate}  ${post.category}  ${post.readingTime}분` });
    if (post.description) l.push({ text: post.description });
    if (post.tags && post.tags.length > 0) {
      l.push({ text: post.tags.map((t) => `#${t}`).join(" ") });
    }
    // ToC
    if (post.headings && post.headings.length > 0) {
      l.push({ text: "" });
      l.push({ text: "# 목차" });
      const tocStartIdx = l.length;
      // placeholder - jumpTo will be patched after content lines are added
      const minLevel = Math.min(...post.headings.map((h) => h.level));
      post.headings.forEach((h) => {
        const indent = "    ".repeat(h.level - minLevel);
        l.push({ text: `${indent}${h.text}`, jumpTo: -1 });
      });
    }

    l.push({ text: "" });
    l.push({ text: "---" });
    l.push({ text: "" });

    const contentStartIdx = l.length;
    const contentLines = post.content.split("\n");
    contentLines.forEach((line) => {
      const linkMatch = line.match(/\[.+?\]\((.+?)\)/);
      l.push({ text: line, href: linkMatch ? linkMatch[1] : undefined });
    });

    // Patch ToC jumpTo indices
    if (post.headings && post.headings.length > 0) {
      let headingIdx = 0;
      for (let ci = 0; ci < contentLines.length && headingIdx < post.headings.length; ci++) {
        const line = contentLines[ci];
        const hMatch = line.match(/^(#{1,4})\s+(.*)$/);
        if (hMatch && hMatch[2].trim() === post.headings[headingIdx].text.trim()) {
          // find the toc line for this heading
          const tocLine = l.find(
            (item) => item.jumpTo === -1 && item.text.trim() === post.headings[headingIdx].text.trim()
          );
          if (tocLine) tocLine.jumpTo = contentStartIdx + ci;
          headingIdx++;
        }
      }
    }

    l.push({ text: "" });
    l.push({ text: "---" });
    l.push({ text: "" });
    if (prevPost) l.push({ text: `이전: ${prevPost.title}`, href: prevPost._meta.fileName, nav: true });
    if (nextPost) l.push({ text: `다음: ${nextPost.title}`, href: nextPost._meta.fileName, nav: true });
    if (relatedPosts.length > 0) {
      l.push({ text: "" });
      l.push({ text: "# 관련 글" });
      relatedPosts.forEach((p) => l.push({ text: p.title, href: p._meta.fileName, nav: true }));
    }

    return l;
  }, [post, prevPost, nextPost, relatedPosts]);

  // Track code block state for styling
  const codeBlockRanges = useMemo(() => {
    const ranges = new Set<number>();
    let inside = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].text.startsWith("```")) {
        ranges.add(i);
        inside = !inside;
      } else if (inside) {
        ranges.add(i);
      }
    }
    return ranges;
  }, [lines]);

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
      // :q command
      if (cmdBuf === ":" && e.key === "q") {
        e.preventDefault();
        setCmdBuf("");
        router.push("/");
        return;
      }
      if (e.key === ":") {
        e.preventDefault();
        setCmdBuf(":");
        return;
      }
      if (cmdBuf) {
        setCmdBuf("");
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
          if (item?.jumpTo !== undefined && item.jumpTo >= 0) {
            mouseBlocked.current = true;
            setCursor(item.jumpTo);
          } else if (item?.href) {
            if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
              window.open(item.href, "_blank");
            } else {
              router.push(item.href);
            }
          }
          break;
        }
      }
    },
    [lines, cursor, router, cmdBuf]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!post) {
    return (
      <main className="min-h-screen font-mono text-[13px] leading-[1.6] py-6 px-6 text-neutral-500">
        로딩 중...
      </main>
    );
  }

  return (
    <main className="min-h-screen font-mono text-[13px] leading-[1.6] pb-12">
      <div className="py-6 px-6">
        {lines.map((line, i) => {
          const selected = cursor === i;
          const isEmpty = line.text === "";
          const isInCode = codeBlockRanges.has(i) && !line.text.startsWith("```");

          let content: React.ReactNode;
          if (isEmpty) {
            content = "\u00A0";
          } else if (line.nav) {
            content = (
              <span className={selected ? "" : "text-teal-400"}>{`[[${line.text}]]`}</span>
            );
          } else if (line.jumpTo !== undefined) {
            const trimmed = line.text.replace(/^\s+/, "");
            const indent = line.text.length - trimmed.length;
            content = (
              <>
                {indent > 0 && <span>{"\u00A0".repeat(indent)}</span>}
                <span className={selected ? "" : "text-teal-400"}>{`[[${trimmed}]]`}</span>
              </>
            );
          } else if (isInCode) {
            // code block body - yellow tinted
            content = <span className={selected ? "" : "text-yellow-500/80"}>{line.text}</span>;
          } else {
            content = styleLine(line.text, selected);
          }

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
              {content}
            </div>
          );
        })}
      </div>

      {/* Statusline */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-1 flex items-center justify-between text-[12px] font-mono">
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 font-bold bg-neutral-100 text-neutral-900">
            NORMAL
          </span>
          {cmdBuf ? (
            <span className="text-neutral-100">{cmdBuf}</span>
          ) : (
            <span className="text-neutral-500 truncate max-w-xs">
              {post.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-neutral-600">
          <span>j/k</span>
          <span>Enter</span>
          <span>:q</span>
          <span>g/G</span>
          <span>{lines.length > 0 ? `${cursor + 1}:${lines.length}` : "0:0"}</span>
        </div>
      </div>
    </main>
  );
}
