"use client";

import { useEffect, useRef } from "react";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // giscus 설정 - GitHub repo 설정 필요
    // https://giscus.app 에서 설정 후 아래 값들을 변경하세요
    script.setAttribute("data-repo", "enbraining/donghak-dev");
    script.setAttribute("data-repo-id", ""); // repo id 입력
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", ""); // category id 입력
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "ko");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="mt-16 pt-8 border-t border-gray-700" />;
}
