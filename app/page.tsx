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

  const filteredPosts = useMemo(() => {
    return allPosts
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
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-2">Donghak Kim</h1>
        <p className="text-lg text-gray-400">Software & Cloud Architect</p>

        <p className="mt-8 text-gray-300">
          보통 사용자가 없는 것을 서비스라고 하진 않습니다. 대부분의 것들은
          제공하는 사람과 제공받는 사람의 이해 관계로 엮어져있고, 저는 그 사이에서
          심리학과 소프트웨어 공학을 통해 유연한 상호작용을 만들어냅니다.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              경력
            </h2>
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-gray-700">
                <div className="absolute -left-2.25 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900" />
                <p className="text-xs text-gray-400 mb-1">2025.11 ~ 현재</p>
                <p className="font-medium text-gray-100">으뜸정보기술</p>
                <p className="text-sm text-gray-400">솔루션 아키텍트</p>
              </div>
              <div className="relative pl-6 border-l-2 border-gray-700">
                <div className="absolute -left-2.25 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                <p className="text-xs text-gray-400 mb-1">2026.01 ~ 현재</p>
                <p className="font-medium text-gray-100">서울사이버대학교</p>
                <p className="text-sm text-gray-400">심리학과 재학</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-2.25 top-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-900" />
                <p className="text-xs text-gray-400 mb-1">~ 2026.01</p>
                <p className="font-medium text-gray-100">
                  광주소프트웨어마이스터고등학교
                </p>
                <p className="text-sm text-gray-400">스마트IoT과 졸업</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              자격증
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-orange-900 text-orange-300 rounded">
                  AWS
                </span>
                Solutions Architect Associate
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-blue-900 text-blue-300 rounded">
                  NHN
                </span>
                Essentials
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded">
                  국가
                </span>
                정보처리산업기사
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded">
                  국가
                </span>
                전자산업기사
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded">
                  국가
                </span>
                전기기능사
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              기술
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li>React 계열 프론트엔드 개발</li>
              <li>Spring Framework 백엔드 개발</li>
              <li>gRPC, WebSocket, TCP 프로토콜</li>
              <li>클라우드 아키텍처 설계</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            관심사
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>마인크래프트 플러그인 개발</li>
            <li>아마추어 무선</li>
            <li>일렉트릭 기타</li>
            <li>음원 믹싱</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold">블로그</h2>
          <div className="flex items-center gap-4">
            <Link href="/archive" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              아카이브
            </Link>
            <Link href="/feed.xml" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              RSS
            </Link>
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 placeholder-gray-500"
          />
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                key={post._meta.fileName}
                href={post._meta.fileName}
                className="block p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {post.readingTime}분
                      </span>
                    </div>
                    <h3 className="font-medium text-lg text-gray-100">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {post.description}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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
                  </div>
                  <time className="text-sm text-gray-400 shrink-0">
                    {post.formattedDate}
                  </time>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 italic">
              {searchQuery || selectedCategory
                ? "검색 결과가 없습니다."
                : "블로그 공사 예정"}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
