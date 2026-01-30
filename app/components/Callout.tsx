interface CalloutProps {
  type?: "info" | "warning" | "error" | "tip";
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  tip: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
    </svg>
  ),
};

const styles = {
  info: "bg-blue-500/10 border-blue-500/50 text-blue-300",
  warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-300",
  error: "bg-red-500/10 border-red-500/50 text-red-300",
  tip: "bg-green-500/10 border-green-500/50 text-green-300",
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <div className={`my-6 p-4 rounded-lg border-l-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
