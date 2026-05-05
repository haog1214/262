import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "帶上可上網的設備",
    desc: "筆電或平板皆可，課堂上會直接操作 AI 工具完成任務。",
  },
  {
    num: "02",
    title: "準備 Google 帳號",
    desc: "課程使用 Gemini 等 Google 生態工具，登入即可免費體驗。",
  },
  {
    num: "03",
    title: "帶著你的工作問題",
    desc: "有真實的工作素材或題目更好，課堂上可直接練習解決。",
  },
];

export default function PreparationSection() {
  const sectionRef = useScrollReveal();

  return (
    <section id="preparation" className="py-20 bg-gray-50" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
            <div className="scroll-reveal-left">
              <p className="text-sm font-semibold text-primary mb-3">課前準備</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-snug">
                三件事準備好，
                <br />
                課堂直接做出成果
              </h2>
              <p className="mt-5 text-base leading-8 text-foreground/55">
                不需要任何 AI 基礎，只要帶著設備與想解決的問題，當天就能完成真實可用的 AI 工作成果。
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step.num} className="scroll-reveal flex gap-5 items-start" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <span
                    className="flex-shrink-0 font-black text-foreground/10 leading-none select-none"
                    style={{ fontSize: "36px", lineHeight: 1 }}
                  >
                    {step.num}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm leading-7 text-foreground/55">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
