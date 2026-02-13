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
    <main className="min-h-screen max-w-2xl mx-auto px-4 md:px-6 py-12">
      <header className="mb-12 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <Link href="/" className="text-gray-400 hover:text-white">home</Link>
          <span>/</span>
          <span>archive</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Archive</h1>
        <p className="text-gray-500 mt-2">{allPosts.length} posts</p>
      </header>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-gray-500 mb-4">
              {year} <span className="text-gray-600">({postsByYear[year].length})</span>
            </h2>
            <ul className="space-y-2">
              {postsByYear[year].map((post) => (
                <li key={post._meta.fileName}>
                  <Link
                    href={`/${post._meta.fileName}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {post.title}
                  </Link>
                  <span className="text-gray-600 text-sm ml-2">
                    {post.category} · {post.formattedDate.slice(6)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
