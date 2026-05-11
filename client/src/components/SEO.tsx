import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  schema?: object | object[];
}

const SITE_NAME = "262學習基地";
const BASE_URL = "https://www.262.yc311.com.tw";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_DESC =
  "262學習基地｜台中 AI 實戰課程平台，提供 Gemini、AI 知識管理、AI 短影音、AI 生活應用、AI 簡報等課程，幫助你用 AI 提升工作效率。";

export default function SEO({
  title,
  description = DEFAULT_DESC,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = "website",
  schema,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | 台中 AI 實戰課程`;

  const schemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="zh_TW" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
