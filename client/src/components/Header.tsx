import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/#courses", label: "課程" },
  { href: "/schedule", label: "開課日期" },
  { href: "/instructor", label: "講師介紹" },
  { href: "/faq", label: "課前準備" },
  { href: "/about", label: "關於我們" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.65)",
        borderColor: "rgba(27,58,107,0.08)",
        boxShadow: "0 1px 24px rgba(27,58,107,0.06)",
      }}
    >
      <div className="container flex items-center justify-between h-[80px]">
        {/* 品牌Logo */}
        <Link href="/">
          <a className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="傳啓資訊 Logo"
              className="block w-[243px] h-auto"
            />
          </a>
        </Link>

        {/* 桌機導航 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href}>
                <a className="text-[18px] font-medium text-foreground/70 hover:text-foreground transition-colors">
                  {item.label}
                </a>
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-[18px] font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        {/* 手機漢堡選單按鈕 */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="開啟選單"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 手機下拉選單 */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-border/40 px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href}>
                <a
                  className="text-[17px] font-medium text-foreground/70 hover:text-foreground transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-[17px] font-medium text-foreground/70 hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            )
          )}
        </nav>
      )}
    </header>
  );
}
