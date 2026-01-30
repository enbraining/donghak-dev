"use client";

import { useEffect, useState, useMemo } from "react";
import { allPosts, Post } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import Giscus from "../components/Giscus";
import CodeBlock from "../components/CodeBlock";
import Callout from "../components/Callout";
import ReadingProgress from "../components/ReadingProgress";
import ScrollToTop from "../components/ScrollToTop";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchId = async () => {
      const { id } = await params;
      const decodedId = decodeURIComponent(id);
      setId(decodedId);
    };

    fetchId();
  }, [params]);

  useEffect(() => {
    const fetchPost = () => {
      const currentPost = allPosts.find(
        (post) => post._meta.fileName === id
      );
      currentPost && setPost(currentPost);
    };

    fetchPost();
  }, [id]);

  // 이전/다음 글
  const { prevPost, nextPost } = useMemo(() => {
    if (!post) return { prevPost: null, nextPost: null };

    const sortedPosts = [...allPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const currentIndex = sortedPosts.findIndex(
      (p) => p._meta.fileName === post._meta.fileName
    );

    return {
      prevPost: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null,
      nextPost: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
    };
  }, [post]);

  // 관련 글 (같은 카테고리)
  const relatedPosts = useMemo(() => {
    if (!post) return [];

    return allPosts
      .filter(
        (p) =>
          p.category === post.category && p._meta.fileName !== post._meta.fileName
      )
      .slice(0, 3);
  }, [post]);

  // 공유 기능
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다.");
    }
  };

  if (!post) {
    return (
      <main className="min-h-screen max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-400">로딩 중...</p>
      </main>
    );
  }

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-16">
      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
        <div className="max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
          >
            <span>&larr;</span>
            <span>돌아가기</span>
          </Link>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readingTime}분</span>
                {post.series && (
                  <span className="px-2 py-0.5 text-xs bg-blue-900 text-blue-300 rounded">
                    {post.series}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-100">{post.title}</h1>
              {post.description && (
                <p className="text-gray-400 mb-3">{post.description}</p>
              )}
              <div className="flex items-center justify-between">
                <time className="text-sm text-gray-400">{post.formattedDate}</time>
                <button
                  onClick={handleShare}
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  공유
                </button>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 before:content-['#']"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="prose max-w-none">
              <MDXContent code={post.mdx} components={{ pre: CodeBlock, Callout }} />
            </div>
          </article>

          {/* 이전/다음 글 */}
          <nav className="mt-16 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={prevPost._meta.fileName}
                  className="p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  <span className="text-xs text-gray-500">이전 글</span>
                  <p className="text-gray-300 font-medium mt-1 line-clamp-1">
                    {prevPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={nextPost._meta.fileName}
                  className="p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-right"
                >
                  <span className="text-xs text-gray-500">다음 글</span>
                  <p className="text-gray-300 font-medium mt-1 line-clamp-1">
                    {nextPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>

          {/* 관련 글 */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-semibold mb-4 text-gray-200">관련 글</h2>
              <div className="space-y-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._meta.fileName}
                    href={relatedPost._meta.fileName}
                    className="block p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                  >
                    <p className="text-gray-300 font-medium">{relatedPost.title}</p>
                    <span className="text-xs text-gray-500">{relatedPost.formattedDate}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 댓글 */}
          <Giscus />
        </div>

        {/* TOC */}
        {post.headings && post.headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">목차</h3>
              <nav className="space-y-2">
                {post.headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-sm text-gray-500 hover:text-gray-300 transition-colors ${
                      heading.level === 3 ? "pl-4" : ""
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </main>
    </>
  );
}
