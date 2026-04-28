const navItems = [
  { href: "#courses", label: "課程" },
  { href: "#schedule", label: "開課日期" },
  { href: "#instructors", label: "講師介紹" },
  { href: "#preparation", label: "課前準備" },
];

/**
 * Footer Component - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：簡潔設計、版權信息、品牌一致性
 */
export default function Footer() {
  return (
    <footer className="border-t text-foreground py-12" style={{ backgroundColor: "#1B3A6B" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* 導航連結 */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors" style={{ color: "rgba(245,240,232,0.7)" }}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* 版權信息 */}
          <div className="text-sm" style={{ color: "rgba(245,240,232,0.6)" }}>
            © 2026 262學院. All rights reserved.
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <p className="text-center text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>
            由 262學院 提供的AI實戰課程平台
          </p>
        </div>
      </div>
    </footer>
  );
}
