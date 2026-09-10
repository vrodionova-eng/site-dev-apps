"use client";

import Link from "next/link";
import { useOrderModal } from "@/components/OrderModal";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

// Шапка демо-страницы: возврат на сайт + кнопка заказа решения
export default function DemoHeader({ appName }: { appName: string }) {
  const { openOrder } = useOrderModal();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`${PREFIX}/`}
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            ← Вернуться на сайт
          </Link>
          <span className="text-slate-200 hidden sm:inline">|</span>
          <span className="text-sm font-semibold text-slate-900 truncate hidden sm:inline">
            {appName}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Демо
          </span>
        </div>
        <button
          onClick={() => openOrder(appName)}
          className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 transition-colors shrink-0"
        >
          Заказать это решение
        </button>
      </div>
    </header>
  );
}
