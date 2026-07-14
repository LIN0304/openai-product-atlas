import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAI Product Atlas | Walk the release history",
  description: "A playable, English-language ASCII atlas of 326 official-source OpenAI product events from ChatGPT to GPT-5.6 Sol.",
  metadataBase: new URL("https://openai-product-atlas.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "OpenAI Product Atlas",
    description: "Move NOVA through 326 source-linked events and decode the history of OpenAI products.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "OpenAI Product Atlas",
    description: "Walk an ASCII release map from ChatGPT to GPT-5.6 Sol.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
