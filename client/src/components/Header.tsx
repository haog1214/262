import { Link } from "wouter";

const navItems = [
  { href: "/#courses", label: "課程" },
  { href: "/schedule", label: "開課日期" },
  { href: "/instructor", label: "講師介紹" },
  { href: "/faq", label: "課前準備" },
];

/**
 * Header Component - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：簡潔導航、品牌突出、清晰視覺層級
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/40 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-[80px]">
        {/* 品牌Logo */}
        <Link href="/">
          <a className="flex w-[135px] items-center justify-start hover:opacity-80 transition-opacity translate-y-[50px] scale-[1.08] -translate-x-[25px]">
            <img
              src="/logo.png"
              alt="262學院 Logo"
              className="block w-[135px] h-auto"
            />
          </a>
        </Link>

        {/* 導航連結 */}
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
      </div>
    </header>
  );
}
