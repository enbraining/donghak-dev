import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>블로그 공사 예정</p>

      <div className="my-12">
        <p>2026년 1월 7일 광주소프트웨어마이스터고등학교 졸업</p>
      </div>

      <div className="my-12">
        <p>AWS SAA</p>
        <p>NHN Essentials</p>
        <p>정보처리산업기사</p>
        <p>전자산업기사</p>
        <p>전기기능사</p>
        <p></p>
      </div>

      <div className="my-12">
        <p>React 계열 프론트엔드 개발</p>
        <p>Spring Framework 게열 백엔드 개발</p>
        <p>gRPC, WebSocket, TCP 등 다양한 프로토콜 사용 경험</p>
        <p>클라우드 아키텍쳐 설계 경험</p>
      </div>

      {allPosts.map(post => <Link key={post._meta.fileName} href={post._meta.fileName}>{post.title}</Link>)}
    </div>
  );
}
