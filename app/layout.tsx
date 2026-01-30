import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "donghak.dev",
  description: "소프트웨어 엔지니어, 김동학입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="donghak.dev RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
