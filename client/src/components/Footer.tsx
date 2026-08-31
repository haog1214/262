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
          {/* Brand — 放大20% */}
          <div className="flex flex-col gap-3 max-w-sm">
            <span className="text-[21.6px] font-bold" style={{ color: "#F5F0E8" }}>傳啓資訊股份有限公司</span>
            <p className="text-[14.4px] leading-relaxed" style={{ color: "rgba(245,240,232,0.5)" }}>
              上課地點：台中市西屯區河南路二段262號7樓3
            </p>
          </div>

          {/* Company info */}
          <div className="flex flex-col gap-1.5 text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>
            <p className="font-semibold text-sm" style={{ color: "rgba(245,240,232,0.75)" }}>傳啓資訊</p>
            <p>統一編號：60357703</p>
            <p>服務電話：04-24529252</p>
            <p>台中市西屯區河南路二段262號3樓之11</p>
          </div>
        </div>

        <div className="border-t mt-2 pt-6 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.35)" }}>
            © 2026 傳啓資訊. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
            由傳啓資訊股份有限公司提供技術支援
          </p>
        </div>
      </div>
    </footer>
  );
}
