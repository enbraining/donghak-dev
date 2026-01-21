import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-2">Donghak Kim</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          UX Engineer
        </p>

        <p className="mt-8">보통 사용자가 없는 것을 서비스라고 하진 않습니다. 대부분의 것들은 제공하는 사람과 제공받는 사람의 이해 관계로 엮어져있고, 저는 그 사이에서 심리학과 소프트웨어 공학을 통해 유연한 상호작용을 만들어냅니다.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              경력
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>2025.11 ~ 현재 으뜸정보기술 재직 중</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>~ 2026.01 광주소프트웨어마이스터고등학교 스마트IoT과 졸업</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>2026.01 ~ 현재 서울사이버대학교 심리학과 재학</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              자격증
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
                  AWS
                </span>
                Solutions Architect Associate
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  NHN
                </span>
                Essentials
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                  국가
                </span>
                정보처리산업기사
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                  국가
                </span>
                전자산업기사
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                  국가
                </span>
                전기기능사
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              기술
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>React 계열 프론트엔드 개발</li>
              <li>Spring Framework 백엔드 개발</li>
              <li>gRPC, WebSocket, TCP 프로토콜</li>
              <li>클라우드 아키텍처 설계</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            관심사
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>마인크래프트 플러그인 개발</li>
            <li>아마추어 무선</li>
            <li>일렉트릭 기타</li>
            <li>음원 믹싱</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          블로그
        </h2>
        <div className="space-y-4">
          {allPosts.length > 0 ? (
            allPosts
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((post) => (
              <Link
                key={post._meta.fileName}
                href={post._meta.fileName}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-lg">{post.title}</h3>
                  <time className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                    {post.date}
                  </time>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              블로그 공사 예정
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
