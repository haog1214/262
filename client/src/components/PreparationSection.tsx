import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "基本設備",
    sub: "手機、筆電或平板",
    desc: "建議攜帶自己平常最常使用的設備，方便課堂中直接實作。",
  },
  {
    num: "02",
    title: "Google 帳號",
    sub: "請確認可正常登入 Gmail / Google 帳號",
    desc: "許多 AI 工具、雲端文件與課堂素材會使用 Google 服務。",
  },
  {
    num: "03",
    title: "Email 信箱",
    sub: "請準備常用 Email",
    desc: "用於註冊工具、接收課程資料、下載教材或登入平台。",
  },
  {
    num: "04",
    title: "帶著你的工作問題",
    sub: "",
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
                做好準備，讓學習真正落地
              </h2>
              <p className="mt-4 text-base font-medium text-foreground/70 leading-relaxed">
                課前完成帳號、設備與素材準備，課堂中就能直接操作、立即產出。
              </p>
              <p className="mt-4 text-sm leading-7 text-foreground/50">
                請攜帶常用設備，確認帳號可登入，並準備個人或公司素材，讓每一次學習都更貼近實際工作情境。
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
                    <h3 className="font-semibold text-foreground mb-0.5">{step.title}</h3>
                    {step.sub && (
                      <p className="text-xs font-medium text-foreground/50 mb-1">{step.sub}</p>
                    )}
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
