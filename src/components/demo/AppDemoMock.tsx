"use client";

import { useMemo, useState } from "react";
import { DemoMock } from "@/lib/demo-mocks";

// Универсальный интерактивный мокап: кликабельные KPI, табы-фильтры
// внутри панелей (по badge), сортировка по значению.
export default function AppDemoMock({ mock }: { mock: DemoMock }) {
  const [activeKpi, setActiveKpi] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortDesc, setSortDesc] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      {/* KPI — кликабельные */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mock.kpis.map((k, i) => (
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
              <p
                className={`mt-1 text-xs font-semibold ${
                  k.up ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {k.up ? "↑" : "↓"} {k.delta}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Панели с табами и сортировкой */}
      <div className="grid md:grid-cols-2 gap-4">
        {mock.panels.map((panel) => (
          <Panel
            key={panel.title}
            panel={panel}
            filter={filters[panel.title] ?? "Все"}
            onFilter={(f) => setFilters((s) => ({ ...s, [panel.title]: f }))}
            sortDesc={sortDesc[panel.title] ?? false}
            onToggleSort={() =>
              setSortDesc((s) => ({ ...s, [panel.title]: !s[panel.title] }))
            }
          />
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: кликайте по KPI, табам и заголовкам — данные перестраиваются
      </p>
    </div>
  );
}

function Panel({
  panel,
  filter,
  onFilter,
  sortDesc,
  onToggleSort,
}: {
  panel: DemoMock["panels"][number];
  filter: string;
  onFilter: (f: string) => void;
  sortDesc: boolean;
  onToggleSort: () => void;
}) {
  const badges = useMemo(
    () => Array.from(new Set(panel.rows.map((r) => r.badge).filter(Boolean) as string[])),
    [panel.rows]
  );

  const rows = useMemo(() => {
    let r = filter === "Все" ? panel.rows : panel.rows.filter((x) => x.badge === filter);
    if (sortDesc) {
      r = [...r].sort((a, b) => numeric(b.value) - numeric(a.value));
    }
    return r;
  }, [panel.rows, filter, sortDesc]);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 text-sm truncate">{panel.title}</h3>
        <button
          onClick={onToggleSort}
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

      {badges.length > 1 && (
        <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
          {["Все", ...badges].map((b) => (
            <button
              key={b}
              onClick={() => onFilter(b)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                filter === b
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm text-slate-700 truncate">{row.label}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-slate-900">{row.value}</span>
              {row.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    row.tone === "up"
                      ? "bg-emerald-50 text-emerald-700"
                      : row.tone === "down"
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {row.badge}
                </span>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-6">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
}

function numeric(v: string): number {
  const n = parseFloat(v.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, ""));
  if (isNaN(n)) return 0;
  if (/М/.test(v)) return n * 1_000_000;
  if (/К/.test(v)) return n * 1_000;
  return n;
}
