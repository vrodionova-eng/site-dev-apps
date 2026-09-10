"use client";

import { useMemo, useState } from "react";

// Кастомное демо «Учет часов в задачах»: выбор периода, KPI, часы по
// сотрудникам с фильтрами и сортировкой, разрез по грейдам.

type PeriodPreset = "7" | "30" | "90" | "custom";

interface Employee {
  name: string;
  grade: "Junior" | "Middle" | "Senior";
  hours: number; // базовые часы за месяц
  norm: number; // норма часов за месяц
  rate: number; // ставка, тыс. BYN за месяц
}

const EMPLOYEES: Employee[] = [
  { name: "Анна К.", grade: "Senior", hours: 168, norm: 160, rate: 92 },
  { name: "Дмитрий С.", grade: "Middle", hours: 172, norm: 160, rate: 68 },
  { name: "Мария Л.", grade: "Middle", hours: 154, norm: 160, rate: 66 },
  { name: "Игорь Н.", grade: "Junior", hours: 160, norm: 160, rate: 27 },
  { name: "Олег С.", grade: "Senior", hours: 186, norm: 160, rate: 95 },
  { name: "Елена К.", grade: "Middle", hours: 148, norm: 160, rate: 64 },
  { name: "Павел М.", grade: "Junior", hours: 162, norm: 160, rate: 28 },
  { name: "Ольга В.", grade: "Middle", hours: 155, norm: 160, rate: 67 },
];

const FILTERS = ["Все", "норма", "переработка", "недоработка"];

function daysFor(preset: PeriodPreset, from: string, to: string): number {
  if (preset === "7") return 7;
  if (preset === "30") return 30;
  if (preset === "90") return 90;
  return Math.max(
    1,
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24))
  );
}

export default function TimepayDemo() {
  const [preset, setPreset] = useState<PeriodPreset>("30");
  const [customFrom, setCustomFrom] = useState("2026-08-01");
  const [customTo, setCustomTo] = useState("2026-08-24");
  const [activeKpi, setActiveKpi] = useState(0);
  const [filter, setFilter] = useState("Все");
  const [sortDesc, setSortDesc] = useState(false);

  const days = daysFor(preset, customFrom, customTo);
  const mult = days / 30; // масштаб часов относительно месяца

  const rows = useMemo(
    () =>
      EMPLOYEES.map((e) => {
        const hours = Math.round(e.hours * mult);
        const norm = Math.round(e.norm * mult);
        const delta = hours - norm;
        const status =
          delta > norm * 0.05 ? "переработка" : delta < -norm * 0.05 ? "недоработка" : "норма";
        const pay = (e.rate * 1000 * mult) / 1; // BYN
        return { ...e, hours, norm, status, pay };
      }),
    [mult]
  );

  const filtered = useMemo(() => {
    let r = filter === "Все" ? rows : rows.filter((x) => x.status === filter);
    if (sortDesc) r = [...r].sort((a, b) => b.hours - a.hours);
    return r;
  }, [rows, filter, sortDesc]);

  const totalHours = rows.reduce((a, b) => a + b.hours, 0);
  const totalPay = rows.reduce((a, b) => a + b.pay, 0);
  const overtime = rows.reduce((a, b) => a + Math.max(0, b.hours - b.norm), 0);
  const avgGrade = "Middle";

  const byGrade = useMemo(() => {
    const g: Record<string, { count: number; hours: number; pay: number }> = {};
    for (const r of rows) {
      g[r.grade] ??= { count: 0, hours: 0, pay: 0 };
      g[r.grade].count += 1;
      g[r.grade].hours += r.hours;
      g[r.grade].pay += r.pay;
    }
    return Object.entries(g).map(([grade, v]) => ({ grade, ...v }));
  }, [rows]);

  const fmtPay = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",")} К` : `${Math.round(n)}`;

  const kpis = [
    { label: "Списано часов", value: totalHours.toLocaleString("ru-RU").replace(/,/g, " "), delta: "+4%", up: true },
    { label: "ФОТ", value: `${fmtPay(totalPay)} BYN`, delta: "+6%", up: true },
    { label: "Переработки", value: `${overtime} ч`, delta: "+18%", up: false },
    { label: "Средний грейд", value: avgGrade, up: true },
  ];

  return (
    <div className="space-y-5">
      {/* Выбор периода */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">Период:</span>
        {(["7", "30", "90"] as PeriodPreset[]).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              preset === p
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {p === "7" ? "7 дней" : p === "30" ? "30 дней" : "90 дней"}
          </button>
        ))}
        <button
          onClick={() => setPreset("custom")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            preset === "custom"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          📅 Свой
        </button>

        {preset === "custom" && (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
            />
            <span className="text-slate-400">—</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
            />
          </div>
        )}

        <span className="ml-auto text-xs text-slate-400">
          {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"}
        </span>
      </div>

      {/* KPI — кликабельные */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <button
            key={k.label}
            onClick={() => setActiveKpi(i)}
            className={`text-left rounded-2xl bg-white border p-4 sm:p-5 transition-all ${
              activeKpi === i
                ? "border-sky-500 shadow-md shadow-sky-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
            {k.delta && (
              <p className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                {k.up ? "↑" : "↓"} {k.delta}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Панели */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Часы по сотрудникам */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-sm truncate">Часы по сотрудникам</h3>
            <button
              onClick={() => setSortDesc((v) => !v)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
                sortDesc
                  ? "bg-sky-50 border-sky-300 text-sky-700"
                  : "border-slate-200 text-slate-400 hover:border-slate-300"
              }`}
              title="Сортировать по значению"
            >
              {sortDesc ? "↓ по убыванию" : "⇅ сортировка"}
            </button>
          </div>

          <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-700 truncate">
                  {r.name} ({r.grade})
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-slate-900">{r.hours} ч</span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      r.status === "норма"
                        ? "bg-emerald-50 text-emerald-700"
                        : r.status === "переработка"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">Ничего не найдено</p>
            )}
          </div>
        </div>

        {/* По грейдам */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">По грейдам</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {byGrade.map((g) => (
              <div
                key={g.grade}
                className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-700">
                  {g.grade} × {g.count}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-slate-900">{fmtPay(g.pay)} BYN</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {g.hours} ч
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: выбирайте период, кликайте по KPI, табам и сортировке — данные перестраиваются
      </p>
    </div>
  );
}
