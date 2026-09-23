"use client";

import { App } from "@/types";
import { APPS } from "@/lib/apps";
import { useOrderModal } from "./OrderModal";
import Reveal from "./Reveal";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

function AppCard({ app }: { app: App }) {
  const { openOrder } = useOrderModal();

  return (
    <div className="row-span-6 grid grid-rows-subgrid gap-y-0 rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-xl hover:shadow-slate-100 hover:border-sky-200 transition-all">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-block rounded-full bg-sky-50 text-sky-700 text-xs font-medium px-3 py-1">
          {app.category}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-slate-900 text-lg leading-snug">
        {app.name}
      </h3>
      <p className="mt-2 mb-4 text-sm text-slate-600 leading-relaxed">
        {app.tagline}
      </p>

      <ul className="space-y-1.5 self-start">
        {app.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
            <span className="shrink-0 text-emerald-500">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Срок реализации</span>
          <span className="font-medium text-slate-700">{app.duration}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Трудозатраты</span>
          <span className="font-medium text-slate-700">{app.hours}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Стоимость</span>
          <span className="font-semibold text-slate-900">{app.price}</span>
        </div>
        <p className="text-[10px] text-slate-400 pt-1">
          Точная стоимость рассчитывается индивидуально после выявления
          требований и оценки трудозатрат.
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        {app.demoUnavailable ? (
          <span
            className="flex-1 rounded-lg bg-slate-100 text-slate-400 text-sm font-semibold py-2.5 text-center cursor-not-allowed select-none"
            title="Демо готовится"
          >
            Демо скоро
          </span>
        ) : (
          <a
            href={`${PREFIX}/demo/${app.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 text-center transition-colors"
          >
            Демо →
          </a>
        )}
        <button
          onClick={() => openOrder(app.name)}
          className="flex-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 transition-colors"
        >
          Заказать
        </button>
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <section id="catalog" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            Готовые приложения
          </h2>
          <p className="mt-3 text-slate-500 text-center max-w-2xl mx-auto">
            Внедряем на вашем портале за считанные дни. Ваши данные, ваш фирменный стиль.
          </p>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {APPS.map((app, i) => (
            <Reveal key={app.id} delay={(i % 3) * 0.07} className="row-span-6 grid grid-rows-subgrid gap-y-0">
              <AppCard app={app} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
