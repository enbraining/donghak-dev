import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>블로그 공사 예정</p>

      <section className="grid grid-cols-2">
        <div>
        <div className="my-12">
        <p>2025년 11월 21일 ~ 으뜸정보기술 재직 중</p>
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
      </div>

      <div>
        <div className="my-12">
        <p>마인크래프트 플러그인 개발</p>
        <p>아마추어 무선</p>
        <p>일렉트릭 기타</p>
        <p>음원 믹싱</p>
      </div>
      </div>
      </section>



      {allPosts.map(post => <Link key={post._meta.fileName} href={post._meta.fileName}>{post.title}</Link>)}
    </div>
  );
}
