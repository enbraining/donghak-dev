"use client";

import { allPosts } from "content-collections";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((post) => post.category));
    return Array.from(cats);
  }, []);

  const projects = useMemo(() => {
    const uniqueProjects = Array.from(
      new Map(
        allPosts
          .filter((post) => post.type === "project")
          .map((post) => [post._meta.fileName, post])
      ).values()
    );
    
    return uniqueProjects
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

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

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-5 py-12">
      {/* Header */}
      <header className="mb-12 pb-8 border-b border-gray-800">
        <h1 className="text-3xl font-semibold text-white mb-2">Donghak Kim</h1>
        <p className="text-gray-500">
          Software & Cloud Architect ·
          <Link href="/archive" className="text-gray-400 hover:text-white"> archive</Link> ·
          <Link href="/feed.xml" className="text-gray-400 hover:text-white"> rss</Link>
        </p>
      </header>

      {/* About */}
      <section className="mb-12 text-[17px] leading-relaxed text-gray-400">
        <p>
          제공하는 사람과 제공받는 사람의 이해 관계, 그 사이에서 심리학과 소프트웨어 공학을 통해
          유연한 상호작용을 만듭니다. 현재{" "}
          <span className="text-gray-200">으뜸정보기술</span>에서 솔루션 아키텍트로 일하고 있습니다.
        </p>
      </section>

      {/* Info Grid */}
      <section className="grid grid-cols-2 gap-x-12 gap-y-10 mb-14">
        <div>
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">자격증</h2>
          <ul className="space-y-2 text-gray-400">
            <li><span className="text-orange-400/90 font-medium">AWS</span> <span className="text-gray-300">Solutions Architect Associate</span></li>
            <li><span className="text-blue-400/90 font-medium">NHN</span> <span className="text-gray-300">Cloud Essentials</span></li>
            <li className="text-sm text-gray-500 leading-snug pt-1">정보처리산업기사 · 전자산업기사 · 전기기능사</li>
          </ul>
        </div>
        <div>
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">기술 스택</h2>
          <p className="text-gray-300 leading-relaxed">
            React · Next.js · TypeScript <br />
            Spring Boot · gRPC · WebSocket <br />
            AWS · NCP · KT Cloud
          </p>
        </div>
        <div>
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">관심사</h2>
          <p className="text-gray-400 leading-relaxed">
            마인크래프트 플러그인 · 아마추어 무선 · 기타 연주
          </p>
        </div>
        <div>
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">연락처</h2>
          <div className="flex gap-4">
            <a 
              href="mailto:enbraining@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/enbraining" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://youtube.com/@enbraining" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Projects Carousel */}
      {projects.length > 0 && (
        <section className="mb-14">
          <h2 className="text-gray-500 mb-4">Projects</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 scrollbar-hide">
            {projects.map((project) => (
              <Link
                key={project._meta.fileName}
                href={project._meta.fileName}
                className="snap-center shrink-0 w-[280px] flex flex-col justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all group"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-200 group-hover:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <div className="flex items-baseline gap-4 mb-8">
        <input
          type="text"
          placeholder="검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-48 px-2 py-1 bg-transparent border-b border-gray-800 focus:outline-none focus:border-gray-600 text-white placeholder-gray-600"
        />
        {categories.length > 0 && (
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "text-white" : "text-gray-600 hover:text-gray-400"}
            >
              all
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "text-white" : "text-gray-600 hover:text-gray-400"}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Articles - 의미있는 글 */}
      <section className="mb-12">
        <h2 className="text-gray-500 mb-4">글</h2>
        <ul className="space-y-2">
          {articles.length > 0 ? (
            articles.map((post) => (
              <li key={post._meta.fileName}>
                <Link
                  href={post._meta.fileName}
                  className="text-gray-300 hover:text-white"
                >
                  {post.title}
                </Link>
                <span className="text-gray-600 text-sm ml-2">
                  {post.category} · {post.formattedDate}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-600">
              {searchQuery || selectedCategory ? "검색 결과 없음" : "글 준비 중"}
            </li>
          )}
        </ul>
      </section>

      {/* Essays - Musings */}
      <section>
        <h2 className="text-gray-500 mb-4">뻘글</h2>
        <ul className="space-y-2">
          {essays.length > 0 ? (
            essays.map((post) => (
              <li key={post._meta.fileName}>
                <Link
                  href={post._meta.fileName}
                  className="text-gray-300 hover:text-white"
                >
                  {post.title}
                </Link>
                <span className="text-gray-600 text-sm ml-2">
                  {post.category} · {post.formattedDate}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-600">
              {searchQuery || selectedCategory ? "검색 결과 없음" : "musings 준비 중"}
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
