import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string | string[];
}

interface FaqCategory {
  id: string;
  en: string;
  zh: string;
  items: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    id: "preparation",
    en: "Before the Course",
    zh: "課前準備",
    items: [
      {
        q: "上課需要準備什麼設備？",
        a: ["可上網的筆電或平板（建議使用筆電，操作更方便）", "確保設備電量充足或攜帶充電器", "耳機（部分課程會播放影音範例）"],
      },
      {
        q: "需要先有 Google 帳號嗎？",
        a: "是的，課程會使用 Gemini、Google Docs 等 Google 生態工具，請事先準備好一組 Google 帳號並確認可以正常登入。",
      },
      {
        q: "沒有 AI 使用基礎可以上課嗎？",
        a: "完全可以！所有課程均從零開始教學，不需要任何 AI 或程式背景。課程設計以「當天學、當天用」為原則，帶你一步步完成實際任務。",
      },
      {
        q: "上課前需要安裝任何軟體嗎？",
        a: "不需要安裝特定軟體，所有工具皆為網頁版，只需瀏覽器即可操作。建議使用 Google Chrome 或 Microsoft Edge。",
      },
      {
        q: "建議帶工作素材來嗎？",
        a: "強烈建議！帶著真實的工作素材（如報告、簡報草稿、產品資料）或你想解決的問題，課堂上可以直接練習，學習效果更佳。",
      },
    ],
  },
  {
    id: "course",
    en: "About Courses",
    zh: "課程相關",
    items: [
      {
        q: "課程是實體還是線上上課？",
        a: "目前開設實體課程為主，上課地點詳見各場次公告。部分課程未來也會推出線上版本，歡迎關注開課資訊。",
      },
      {
        q: "一堂課有多少人？",
        a: "為確保每位學員都能得到充分的練習與互動，每場次人數控制在 15 人以內，採小班制教學。",
      },
      {
        q: "課程結束後可以複習嗎？",
        a: "課程結束後會提供講義與課程重點整理，部分課程另附操作示範影片供學員複習。",
      },
      {
        q: "課程內容會更新嗎？",
        a: "會！AI 工具更新速度很快，講師會定期追蹤最新功能，並在課程中同步最新操作方法，確保內容與時俱進。",
      },
      {
        q: "上完一門課後，建議接著上哪門課？",
        a: ["初學者建議從「讓手機搞定大小事」入門", "有基礎後可選「Gemini讓工作快一倍」深化 Google 生態工具", "有創作需求者推薦「AI短影音即戰班」或「AI社群經營班」", "需要整理大量資料的朋友適合「資料太多卻用不起來」"],
      },
    ],
  },
  {
    id: "enroll",
    en: "Registration & Payment",
    zh: "報名與付款",
    items: [
      {
        q: "如何完成報名？",
        a: ["在開課行事曆或課程頁面點擊「立即報名」", "填寫姓名、電話、Email 等基本資料", "送出後系統會產生報名確認信，我們會在 24 小時內回覆確認與付款方式"],
      },
      {
        q: "支援哪些付款方式？",
        a: "目前支援銀行轉帳與街口支付，確認報名後專員會透過 Email 提供付款資訊。",
      },
      {
        q: "可以開立公司發票嗎？",
        a: "可以，報名時填寫統一編號即可開立三聯式發票。若未填寫，一律開立二聯式電子發票。",
      },
      {
        q: "名額額滿可以候補嗎？",
        a: "可以，填寫報名資料並備註「候補」，若有名額釋出將優先通知候補學員。",
      },
      {
        q: "可以退費或換場次嗎？",
        a: ["開課前 7 天（含）以上提出：可全額退費或免費換場次", "開課前 3–6 天提出：可換場次或退 50% 費用", "開課前 2 天（含）以內：恕無法退費，但可轉讓名額給他人"],
      },
    ],
  },
  {
    id: "enterprise",
    en: "Enterprise",
    zh: "企業包班",
    items: [
      {
        q: "企業包班是什麼？",
        a: "針對企業內訓需求，提供客製化課程規劃與專屬場次，人數達 10 人以上即可洽談包班方案，時間與地點皆可彈性安排。",
      },
      {
        q: "企業包班可以客製化課程內容嗎？",
        a: "可以，講師會依據企業的行業特性、員工背景與學習目標，調整課程內容與案例，讓培訓效果最大化。",
      },
      {
        q: "如何詢問企業包班？",
        a: "請透過報名頁面選擇「企業包班專案」，或直接寄信至 liangchiahao1214@gmail.com，專員會在 1–2 個工作天內與您聯繫。",
      },
    ],
  },
];

function FaqCard({ item, isOpen, onToggle, index }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: isOpen
          ? "linear-gradient(135deg, rgba(27,58,107,0.06) 0%, rgba(255,255,255,1) 40%)"
          : "#ffffff",
        boxShadow: isOpen
          ? "0 4px 24px rgba(27,58,107,0.10), 0 1px 0 rgba(27,58,107,0.08)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        border: isOpen ? "1.5px solid rgba(27,58,107,0.18)" : "1.5px solid transparent",
      }}
      onClick={onToggle}
    >
      {/* Question row */}
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="flex items-start gap-4 min-w-0">
          {/* Index badge */}
          <span
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
            style={{
              background: isOpen ? "#1B3A6B" : "#f0f2f5",
              color: isOpen ? "#fff" : "#9ca3af",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="font-semibold leading-relaxed"
            style={{
              fontSize: "17.25px",
              color: isOpen ? "#1B3A6B" : "#1f2937",
            }}
          >
            {item.q}
          </span>
        </div>

        {/* Toggle icon */}
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200"
          style={{
            background: isOpen ? "#1B3A6B" : "#f0f2f5",
          }}
        >
          {isOpen
            ? <Minus className="w-3.5 h-3.5 text-white" />
            : <Plus className="w-3.5 h-3.5 text-gray-400" />
          }
        </span>
      </div>

      {/* Answer */}
      {isOpen && (
        <div
          className="px-6 pb-6"
          style={{ paddingLeft: "calc(1.5rem + 1.75rem + 1rem)" }}
        >
          <div
            className="h-px mb-4"
            style={{ background: "rgba(27,58,107,0.1)" }}
          />
          {Array.isArray(item.a) ? (
            <ul className="space-y-2.5">
              {item.a.map((line, i) => (
                <li key={i} className="flex items-start gap-3" style={{ fontSize: "15.95px", color: "#4b5563", lineHeight: "1.75" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                    style={{ background: "#1B3A6B", opacity: 0.5 }}
                  />
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "15.95px", color: "#4b5563", lineHeight: "1.85" }}>{item.a}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("preparation");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = categories.find((c) => c.id === activeCategory)!;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f0f2f7 0%, #f2f2f2 50%, #eef0f5 100%)",
      }}
    >
      <Header />

      <main className="flex-1 py-14 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Heading */}
          <div className="mb-12">
            <p
              className="text-xs font-black tracking-[0.35em] uppercase mb-3"
              style={{ color: "#1B3A6B", opacity: 0.6 }}
            >
              FAQ
            </p>
            <h1
              className="font-bold text-gray-900"
              style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              常見問題
            </h1>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="px-5 py-2 rounded-full font-semibold transition-all duration-200"
                style={
                  activeCategory === cat.id
                    ? {
                        background: "#1B3A6B",
                        color: "#fff",
                        fontSize: "14.95px",
                        boxShadow: "0 4px 14px rgba(27,58,107,0.3)",
                      }
                    : {
                        background: "#fff",
                        color: "#6b7280",
                        fontSize: "14.95px",
                        border: "1.5px solid #e5e7eb",
                      }
                }
              >
                {cat.zh}
              </button>
            ))}
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-5">
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: "#1B3A6B", opacity: 0.4 }}
            >
              {current.en}
            </p>
            <div className="flex-1 h-px" style={{ background: "rgba(27,58,107,0.1)" }} />
          </div>

          {/* FAQ cards — each item is its own block */}
          <div className="space-y-3">
            {current.items.map((item, i) => (
              <FaqCard
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* Contact block */}
          <div
            className="mt-10 rounded-2xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, #1B3A6B 0%, #243f72 100%)",
              boxShadow: "0 8px 32px rgba(27,58,107,0.2)",
            }}
          >
            <div>
              <p className="text-white font-bold" style={{ fontSize: "17.25px" }}>還有其他問題？</p>
              <p className="text-white/50 mt-1" style={{ fontSize: "13.8px" }}>我們會在 1–2 個工作天內回覆您</p>
            </div>
            <a
              href="mailto:liangchiahao1214@gmail.com"
              className="flex-shrink-0 px-6 py-2.5 rounded-full font-bold bg-white transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{ color: "#1B3A6B", fontSize: "14.95px" }}
            >
              聯絡我們
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
