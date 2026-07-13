import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "家庭碳循环食谱助手",
  description: "为三人家庭规划今天和明天的碳循环晚餐、做法与合并采购清单。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
