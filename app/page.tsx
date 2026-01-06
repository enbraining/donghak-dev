import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {allPosts.map(post => <Link key={post._meta.fileName} href={post._meta.fileName}>{post.title}</Link>)}
    </div>
  );
}
