"use client";

import { useMemo, useState } from "react";

type Stage = "new" | "progress" | "rework" | "approved" | "rejected";

interface Request {
  id: number;
  title: string;
  type: string;
  author: string;
  amount?: string;
  date: string;
  stage: Stage;
}

const STAGES: { id: Stage; name: string; color: string; dot: string }[] = [
  { id: "new", name: "Новая", color: "bg-sky-50 border-sky-200", dot: "bg-sky-500" },
  { id: "progress", name: "На согласовании", color: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  { id: "rework", name: "Доработка", color: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  { id: "approved", name: "Утверждено", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  { id: "rejected", name: "Отклонено", color: "bg-red-50 border-red-200", dot: "bg-red-500" },
];

const TYPES = ["Все", "Закупка", "Договор", "Отпуск", "Командировка"];

const INITIAL: Request[] = [
  { id: 118, title: "Закупка ноутбуков для отдела продаж", type: "Закупка", author: "Иван Петров", amount: "48 000 ₽", date: "20.08", stage: "new" },
  { id: 117, title: "Договор с ООО «Вектор»", type: "Договор", author: "Мария Соколова", date: "19.08", stage: "new" },
  { id: 115, title: "Отпуск Дмитрия Карпова", type: "Отпуск", author: "Дмитрий Карпов", date: "18.08", stage: "progress" },
  { id: 114, title: "Закупка офисной мебели", type: "Закупка", author: "Анна Лебедева", amount: "125 000 ₽", date: "17.08", stage: "progress" },
  { id: 113, title: "Командировка в Минск", type: "Командировка", author: "Игорь Новиков", amount: "1 800 ₽", date: "17.08", stage: "progress" },
  { id: 112, title: "Договор аренды склада", type: "Договор", author: "Мария Соколова", date: "15.08", stage: "rework" },
  { id: 110, title: "Закупка ПО (лицензии)", type: "Закупка", author: "Иван Петров", amount: "32 500 ₽", date: "14.08", stage: "rework" },
  { id: 108, title: "Отпуск Анны Лебедевой", type: "Отпуск", author: "Анна Лебедева", date: "12.08", stage: "approved" },
  { id: 107, title: "Договор с «Балтика»", type: "Договор", author: "Дмитрий Карпов", date: "11.08", stage: "approved" },
  { id: 105, title: "Командировка в Гродно", type: "Командировка", author: "Игорь Новиков", amount: "950 ₽", date: "10.08", stage: "approved" },
  { id: 103, title: "Закупка канцелярии", type: "Закупка", author: "Мария Соколова", amount: "2 400 ₽", date: "08.08", stage: "rejected" },
  { id: 101, title: "Отпуск Ивана Петрова", type: "Отпуск", author: "Иван Петров", date: "05.08", stage: "approved" },
];

const TYPE_STYLE: Record<string, string> = {
  "Закупка": "bg-sky-50 text-sky-700",
  "Договор": "bg-violet-50 text-violet-700",
  "Отпуск": "bg-emerald-50 text-emerald-700",
  "Командировка": "bg-amber-50 text-amber-700",
};

export default function SoglasovanieDemo() {
  const [requests, setRequests] = useState<Request[]>(INITIAL);
  const [typeFilter, setTypeFilter] = useState("Все");
  const [activeId, setActiveId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (typeFilter === "Все" ? requests : requests.filter((r) => r.type === typeFilter)),
    [requests, typeFilter]
  );

  const kpis = useMemo(() => {
    const total = requests.length;
    const inWork = requests.filter((r) => r.stage === "new" || r.stage === "progress").length;
    const approved = requests.filter((r) => r.stage === "approved").length;
    const overdue = requests.filter((r) => r.stage === "rework").length;
    return { total, inWork, approved, overdue };
  }, [requests]);

  const move = (id: number, stage: Stage) => {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, stage } : r)));
    setActiveId(null);
  };

  const active = requests.find((r) => r.id === activeId) ?? null;

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего заявок", value: String(kpis.total), delta: "+3", up: true },
          { label: "В работе", value: String(kpis.inWork), delta: "+2", up: true },
          { label: "Утверждено", value: String(kpis.approved), delta: "+12", up: true },
          { label: "На доработке", value: String(kpis.overdue), delta: "−2", up: false },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
            <p className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
              {k.up ? "↑" : "↓"} {k.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Фильтр по типу */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === t
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Канбан */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="grid grid-cols-5 gap-3 min-w-[1000px]">
          {STAGES.map((stage) => {
            const cards = filtered.filter((r) => r.stage === stage.id);
            return (
              <div key={stage.id} className={`rounded-2xl border p-3 ${stage.color}`}>
                <div className="flex items-center gap-2 px-1 pb-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <p className="text-xs font-semibold text-slate-700">{stage.name}</p>
                  <span className="ml-auto text-[10px] text-slate-500">{cards.length}</span>
                </div>
                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {cards.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveId(r.id)}
                      className={`w-full text-left rounded-xl border p-3 bg-white transition-all ${
                        activeId === r.id
                          ? "border-sky-500 shadow-md shadow-sky-100"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <p className="text-[10px] text-slate-400">#{r.id} · {r.date}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                        {r.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TYPE_STYLE[r.type] ?? "bg-slate-100 text-slate-600"}`}>
                          {r.type}
                        </span>
                        {r.amount && (
                          <span className="text-[11px] font-semibold text-slate-900">{r.amount}</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[10px] text-slate-500 truncate">{r.author}</p>
                    </button>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-6">Пусто</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Детали заявки */}
      {active && (
        <div className="rounded-2xl bg-white border border-sky-200 p-5 shadow-lg shadow-sky-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400">Заявка #{active.id} · подана {active.date}</p>
              <h3 className="mt-1 font-bold text-slate-900">{active.title}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>Тип: <b>{active.type}</b></span>
                <span>Автор: <b>{active.author}</b></span>
                {active.amount && <span>Сумма: <b>{active.amount}</b></span>}
                <span>Стадия: <b>{STAGES.find((s) => s.id === active.stage)?.name}</b></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {active.stage !== "approved" && (
                <button
                  onClick={() => move(active.id, "approved")}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
                >
                  ✓ Согласовать
                </button>
              )}
              {active.stage !== "rework" && active.stage !== "approved" && active.stage !== "rejected" && (
                <button
                  onClick={() => move(active.id, "rework")}
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
                >
                  ↺ На доработку
                </button>
              )}
              {active.stage !== "rejected" && (
                <button
                  onClick={() => move(active.id, "rejected")}
                  className="rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
                >
                  ✕ Отклонить
                </button>
              )}
              <button
                onClick={() => setActiveId(null)}
                className="rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: кликните по заявке, чтобы согласовать или отклонить её
      </p>
    </div>
  );
}
