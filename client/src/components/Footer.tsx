import { Link } from "wouter";

const navItems = [
  { href: "/#courses", label: "課程" },
  { href: "/schedule", label: "開課日期" },
  { href: "/instructor", label: "講師介紹" },
  { href: "/faq", label: "課前準備" },
  { href: "/about", label: "關於我們" },
];

export default function Footer() {
  return (
    <footer className="border-t text-foreground pt-12 pb-8" style={{ backgroundColor: "#1B3A6B" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span className="text-lg font-bold" style={{ color: "#F5F0E8" }}>262 培訓學院</span>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.5)" }}>
              傳啓資訊打造的專業課程教學平台<br />
              讓專業被看見、讓經驗被傳承
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {navItems.map((item) =>
              item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                <Link key={item.href} href={item.href}>
                  <a className="transition-colors hover:opacity-100" style={{ color: "rgba(245,240,232,0.65)" }}>
                    {item.label}
                  </a>
                </Link>
              ) : (
                <a key={item.href} href={item.href} className="transition-colors hover:opacity-100" style={{ color: "rgba(245,240,232,0.65)" }}>
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Company info */}
          <div className="flex flex-col gap-1.5 text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>
            <p className="font-semibold text-sm" style={{ color: "rgba(245,240,232,0.75)" }}>二六二有限公司</p>
            <p>統一編號：60357703</p>
            <p>台中市西屯區河南路二段262號3樓之11</p>
          </div>
        </div>

        <div className="border-t mt-2 pt-6 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.35)" }}>
            © 2026 262培訓學院 · 二六二有限公司. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
            由傳啓資訊股份有限公司提供技術支援
          </p>
        </div>
      </div>
    </footer>
  );
}
