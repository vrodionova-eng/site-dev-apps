"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { DEMO_KPIS, DEMO_MANAGERS } from "@/lib/demo-data";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

// Мини-превью для карусели «Живое демо»: у каждого приложения свой виджет
interface Slide {
  id: string;
  name: string;
  desc: string;
  url: string;
  preview: React.ReactNode;
}

function PultPreview() {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5">
        {DEMO_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-[10px] text-slate-400 truncate">{k.label}</p>
            <p className="text-sm font-bold text-white mt-1">{k.value}</p>
            <p
              className={`text-[10px] font-medium mt-0.5 ${
                k.change >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {k.change >= 0 ? "↑" : "↓"} {Math.abs(k.change)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-4">
        <p className="text-xs text-slate-400 mb-3">Рейтинг менеджеров</p>
        <div className="space-y-2.5">
          {DEMO_MANAGERS.slice(0, 3).map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="text-xs text-slate-300 w-28 truncate">{m.name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${m.conversion * 2}%` }} />
              </div>
              <span className="text-xs font-semibold text-white w-14 text-right">{m.revenue} тыс.</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ShiftsPreview() {
  const row = ["bg-emerald-400", "bg-emerald-400", "bg-slate-600", "bg-emerald-400", "bg-amber-300", "bg-slate-600", "bg-sky-300"];
  const row2 = ["bg-emerald-400", "bg-sky-300", "bg-emerald-400", "bg-slate-600", "bg-emerald-400", "bg-emerald-400", "bg-slate-600"];
  const row3 = ["bg-slate-600", "bg-emerald-400", "bg-emerald-400", "bg-amber-300", "bg-slate-600", "bg-emerald-400", "bg-emerald-400"];
  const names = ["Анна К.", "Дмитрий С.", "Мария Л."];
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs text-slate-400 mb-3">График смен на неделю</p>
      <div className="space-y-2">
        {[row, row2, row3].map((cells, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 w-16 truncate">{names[i]}</span>
            {cells.map((c, j) => (
              <span key={j} className={`w-6 h-6 rounded ${c}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400" />смена</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-sky-300" />перерыв</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-300" />отпуск</span>
      </div>
    </div>
  );
}

function TimepayPreview() {
  const rows = [
    { n: "Анна К. (Senior)", h: 168, pct: 100, c: "bg-emerald-400" },
    { n: "Дмитрий С. (Middle)", h: 172, pct: 96, c: "bg-sky-400" },
    { n: "Мария Л. (Middle)", h: 154, pct: 88, c: "bg-sky-400" },
    { n: "Олег С. (Senior)", h: 186, pct: 92, c: "bg-red-400" },
  ];
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs text-slate-400 mb-3">Часы по сотрудникам за месяц</p>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.n} className="flex items-center gap-3">
            <span className="text-xs text-slate-300 w-32 truncate">{r.n}</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-white w-12 text-right">{r.h} ч</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[["Списано", "1 884 ч"], ["ФОТ", "876 К"], ["Переработки", "42 ч"]].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
            <p className="text-[9px] text-slate-400">{l}</p>
            <p className="text-xs font-bold text-white">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsPreview() {
  const leads = [
    { n: "Сергей Климович", b: "250 000", s: 92 },
    { n: "Ольга Романова", b: "180 000", s: 78 },
    { n: "Пётр Васильев", b: "310 000", s: 64 },
  ];
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">Потенциальные клиенты · квартира</p>
        <span className="text-[10px] text-emerald-400 font-semibold">автоподбор</span>
      </div>
      <div className="space-y-2">
        {leads.map((l) => (
          <div key={l.n} className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <span className="w-7 h-7 rounded-full bg-sky-500/30 text-sky-300 text-[10px] font-bold flex items-center justify-center shrink-0">
              {l.n.split(" ").map((w) => w[0]).join("")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{l.n}</p>
              <p className="text-[10px] text-slate-400">бюджет {l.b} BYN</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 shrink-0">{l.s}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    id: "pult",
    name: "Пульт руководителя",
    desc: "Аналитика по менеджерам, сделкам и эффективности прямо в браузере. Тестовые данные.",
    url: "/demo/pult",
    preview: <PultPreview />,
  },
  {
    id: "shifts",
    name: "График смен",
    desc: "Календарь смен на каждого менеджера: любой график, перерывы, отпуска. Сделки автораспределяются по тем, кто в смене.",
    url: "/demo/shifts",
    preview: <ShiftsPreview />,
  },
  {
    id: "timepay",
    name: "Учет часов в задачах",
    desc: "Сколько часов команда списала, кто перегружен, зарплата по грейдам — автоматический отчёт без Excel.",
    url: "/demo/timepay",
    preview: <TimepayPreview />,
  },
  {
    id: "contacts",
    name: "Вкладка «Контакты»",
    desc: "Потенциальные клиенты прямо в карточке Битрикс24: быстрое добавление, автоподбор из базы, автообновление.",
    url: "/demo/contacts",
    preview: <ContactsPreview />,
  },
];

const AUTO_MS = 5000;

export default function LiveDemo() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTO_MS);
    return () => clearInterval(t);
  }, [paused]);

  const slide = SLIDES[index];
  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section id="live-demo" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid lg:grid-cols-5">
            {/* Левая часть — текст и управление */}
            <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center">
              <Reveal key={slide.id}>
                <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 w-fit">
                  Живое демо
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">{slide.name}</h2>
                <p className="mt-3 text-slate-600 leading-relaxed">{slide.desc}</p>
                <p className="mt-2 text-xs text-slate-400">apps.crmby.by{slide.url} · тестовые данные</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={`${PREFIX}${slide.url}`}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 text-sm transition-colors"
                  >
                    Подробнее
                  </a>
                  <a
                    href={`${PREFIX}${slide.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-6 py-3 text-sm transition-colors"
                  >
                    В новом окне ↗
                  </a>
                </div>
              </Reveal>

              {/* Управление каруселью */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => go(-1)}
                  aria-label="Предыдущее приложение"
                  className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors flex items-center justify-center"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Следующее приложение"
                  className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors flex items-center justify-center"
                >
                  →
                </button>
                <div className="flex items-center gap-1.5 ml-2">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setIndex(i)}
                      aria-label={s.name}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-auto text-[11px] text-slate-400">
                  {index + 1} / {SLIDES.length}
                </span>
              </div>
            </div>

            {/* Правая часть — мини-превью */}
            <div className="lg:col-span-3 bg-slate-900 p-6 sm:p-8 flex flex-col justify-center">
              <Reveal key={`preview-${slide.id}`} delay={0.1}>
                {slide.preview}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
