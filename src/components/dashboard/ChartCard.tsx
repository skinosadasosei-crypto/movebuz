"use client";

export default function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
          {title}
        </h3>
        {subtitle && (
          <span className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
