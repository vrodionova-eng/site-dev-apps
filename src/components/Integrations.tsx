"use client";

import { useOrderModal } from "./OrderModal";
import Reveal from "./Reveal";
import { TelegramIcon } from "./TelegramIcon";
import { Bitrix24Icon } from "./Bitrix24Icon";

const TECHS = [
  { name: "Битрикс24", icon: "b24" },
  { name: "Excel / Google Sheets", icon: "▦" },
  { name: "Telegram", icon: "tg" },
  { name: "REST API", icon: "⚡" },
];

export default function Integrations() {
  const { openOrder } = useOrderModal();

  return (
    <section id="custom" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-600/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Не нашли нужное решение?
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Мы делаем различные интеграции с Битрикс24, Excel-таблицами,
                Telegram и любыми другими приложениями. Готовы рассмотреть
                ваши индивидуальные предложения и доработать Битрикс24 по
                вашему запросу.
              </p>
              <button
                onClick={() => openOrder("Кастомная разработка")}
                className="mt-7 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3.5 transition-colors"
              >
                Обсудить задачу →
              </button>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                {TECHS.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur hover:bg-white/10 transition-colors"
                  >
                    <div className="text-2xl text-sky-400">
                      {t.icon === "tg" ? (
                        <TelegramIcon className="w-6 h-6" />
                      ) : t.icon === "b24" ? (
                        <Bitrix24Icon className="w-8 h-6" />
                      ) : (
                        t.icon
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-200">
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
