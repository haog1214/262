import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { image: "/hero-1.jpg" },
  { image: "/hero-2.jpg" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((index + slides.length) % slides.length);
        setTransitioning(false);
      }, 300);
    },
    [transitioning]
  );

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[520px]">
        <img
          key={slide.image}
          src={slide.image}
          alt={`banner-${current + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* 左箭頭 */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/20 backdrop-blur-sm transition-colors"
        aria-label="上一張"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* 右箭頭 */}
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/20 backdrop-blur-sm transition-colors"
        aria-label="下一張"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* 圓點指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-[#D4AF37]"
                : "w-2 h-2 bg-white/40 hover:bg-[#D4AF37]/70"
            }`}
            aria-label={`第 ${i + 1} 張`}
          />
        ))}
      </div>

    </section>
  );
}
