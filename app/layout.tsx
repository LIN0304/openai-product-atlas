import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAI Product Atlas — 產品時間線 v0.1",
  description: "從 ChatGPT 發布到 GPT-5.6 Sol：以 Godot 像素／ASCII 世界呈現的 OpenAI 官方產品時間線。",
  metadataBase: new URL("https://openai-product-atlas.vercel.app"),
  openGraph: { title: "OpenAI Product Atlas", description: "326 個可探索、可搜尋、可追溯官方來源的 OpenAI 產品事件節點。", type: "website" },
  icons: { icon: "/godot/index.icon.png", apple: "/godot/index.apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
