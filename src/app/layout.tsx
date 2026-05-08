import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "サブスク管理",
  description: "個人用サブスクリプション管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
