"use client";

import LeadForm from "./LeadForm";
import Reveal from "./Reveal";
import { BITRIX_FORM_ENABLED } from "@/lib/config";
import { useOrderModal } from "./OrderModal";

// CTA-секция с формой заявки.
// Если задана BITRIX_FORM_URL — по кнопке открываем модалку с CRM-формой
// Битрикс24. Иначе показываем внутреннюю форму прямо на странице.
export default function Cta() {
  const { openOrder } = useOrderModal();

  return (
    <section id="cta" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Обсудить проект с экспертом
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
              Расскажем, как это работает на ваших данных. Бесплатная
              консультация — 30 минут.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Разберём вашу воронку и процессы",
                "Оценим сроки и трудозатраты",
                "Реализуем решение",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-8">
              {BITRIX_FORM_ENABLED ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-6">
                    Заполните короткую форму — менеджер свяжется с вами в
                    течение рабочего дня.
                  </p>
                  <button
                    onClick={() => openOrder()}
                    className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3.5 transition-colors"
                  >
                    Отправить заявку
                  </button>
                </div>
              ) : (
                <LeadForm />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
