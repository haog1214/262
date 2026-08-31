import { Target, Users2, TrendingUp, ArrowRight } from "lucide-react";

const highlights = [
  { icon: Target, label: "實戰教學" },
  { icon: Users2, label: "專案陪跑" },
  { icon: TrendingUp, label: "成果導向" },
];

export default function HeroSection() {
  return (
    <section className="w-full relative" style={{ background: "linear-gradient(180deg, #F5F0E8 0%, #ffffff 65%)" }}>
      <div className="w-full aspect-[16/9] relative overflow-hidden">
        <img src="/hero-1.jpg" alt="banner" className="w-full h-full object-cover" />
        {/* Subtle tech gradient fade at the base so the glass bar blends in */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(27,58,107,0) 0%, rgba(27,58,107,0.18) 100%)" }}
        />
      </div>

      {/* Floating glassmorphism CTA bar — overlaps the hero's bottom edge */}
      <div className="container relative z-10" style={{ marginTop: "-52px" }}>
        <div
          className="mx-auto max-w-4xl rounded-2xl px-6 py-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5"
          style={{
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 8px 32px rgba(27,58,107,0.18)",
          }}
        >
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2.5">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(27,58,107,0.1)", border: "1px solid rgba(27,58,107,0.12)" }}
                >
                  <h.icon className="w-4 h-4" style={{ color: "#1B3A6B" }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: "#1B3A6B" }}>{h.label}</span>
              </div>
            ))}
          </div>
          <a
            href="#courses"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #1B3A6B, #2C5490)", boxShadow: "0 4px 18px rgba(27,58,107,0.4)" }}
          >
            立即查看課程 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="h-10 md:h-14" />
    </section>
  );
}
