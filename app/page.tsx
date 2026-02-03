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

  const { essays, articles } = useMemo(() => {
    const filtered = allPosts
      .filter((post) => {
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
      <section className="grid grid-cols-2 gap-x-12 gap-y-8 mb-14">
        <div>
          <h2 className="text-gray-500 mb-3">자격증</h2>
          <ul className="space-y-1.5 text-gray-400">
            <li><span className="text-orange-400/90">AWS</span> SAA</li>
            <li><span className="text-blue-400/90">NHN</span> Essentials</li>
            <li>정보처리산업기사, 전자산업기사, 전기기능사</li>
          </ul>
        </div>
        <div>
          <h2 className="text-gray-500 mb-3">기술</h2>
          <p className="text-gray-400">
            React · Spring · gRPC · WebSocket · AWS
          </p>
        </div>
        <div>
          <h2 className="text-gray-500 mb-3">관심사</h2>
          <p className="text-gray-400">
            마인크래프트 플러그인 · 아마추어 무선 · 기타 · 믹싱
          </p>
        </div>
      </section>

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
