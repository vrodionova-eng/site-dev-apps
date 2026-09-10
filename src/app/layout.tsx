import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OrderModalProvider } from "@/components/OrderModal";
import BitrixFormLoader from "@/components/BitrixFormLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "CRMBY - Приложения и дашборды для вашего Битрикс24",
  description:
    "Готовые приложения и кастомная разработка для Битрикс24: дашборды, интеграции, автоматизация. Быстро, с поддержкой, на реальных данных.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <OrderModalProvider>{children}</OrderModalProvider>
        <BitrixFormLoader />
      </body>
    </html>
  );
}
