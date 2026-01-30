import { allPosts } from "content-collections";
import Link from "next/link";

export default function ArchivePage() {
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 연도별로 그룹화
  const postsByYear = sortedPosts.reduce(
    (acc, post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, typeof sortedPosts>
  );

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
      >
        <span>&larr;</span>
        <span>돌아가기</span>
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-gray-100">아카이브</h1>

      <p className="text-gray-400 mb-12">총 {allPosts.length}개의 글</p>

      <div className="space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
              {year}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({postsByYear[year].length})
              </span>
            </h2>
            <div className="space-y-4">
              {postsByYear[year].map((post) => (
                <Link
                  key={post._meta.fileName}
                  href={`/${post._meta.fileName}`}
                  className="flex items-start gap-4 group"
                >
                  <time className="text-sm text-gray-500 shrink-0 w-24">
                    {post.formattedDate.slice(6)}
                  </time>
                  <div className="flex-1">
                    <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded mr-2">
                      {post.category}
                    </span>
                    <span className="text-gray-300 group-hover:text-gray-100 transition-colors">
                      {post.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
