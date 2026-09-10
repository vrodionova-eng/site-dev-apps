"use client";

import { useState } from "react";

interface ImportRow {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: "ok" | "updated" | "error";
}

const PARSED: ImportRow[] = [
  { id: 1, name: "Ноутбук Lenovo ThinkPad E14", sku: "NB-14-001", price: "3 240 BYN", stock: 12, status: "updated" },
  { id: 2, name: "Монитор Dell 27″ U2722D", sku: "MN-27-104", price: "1 890 BYN", stock: 8, status: "updated" },
  { id: 3, name: "Клавиатура Logitech MX Keys", sku: "KB-MX-021", price: "485 BYN", stock: 24, status: "ok" },
  { id: 4, name: "Мышь Logitech MX Master 3S", sku: "MS-MX-045", price: "445 BYN", stock: 31, status: "ok" },
  { id: 5, name: "Док-станция Dell WD19", sku: "DK-WD-019", price: "890 BYN", stock: 5, status: "updated" },
  { id: 6, name: "Веб-камера Logitech Brio 500", sku: "WC-BR-500", price: "420 BYN", stock: 0, status: "error" },
  { id: 7, name: "Наушники Jabra Evolve2 65", sku: "HP-JB-065", price: "820 BYN", stock: 14, status: "ok" },
  { id: 8, name: "Принтер HP LaserJet Pro M404", sku: "PR-HP-404", price: "1 240 BYN", stock: 7, status: "updated" },
];

const STATUS = {
  ok: { label: "Без изменений", badge: "bg-slate-100 text-slate-600" },
  updated: { label: "Обновлён", badge: "bg-emerald-50 text-emerald-700" },
  error: { label: "Нет на складе", badge: "bg-red-50 text-red-600" },
};

export default function Parser1cDemo() {
  const [file, setFile] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState<"all" | "ok" | "updated" | "error">("all");

  const stats = {
    total: PARSED.length,
    updated: PARSED.filter((r) => r.status === "updated").length,
    ok: PARSED.filter((r) => r.status === "ok").length,
    error: PARSED.filter((r) => r.status === "error").length,
  };

  const rows = filter === "all" ? PARSED : PARSED.filter((r) => r.status === filter);

  const pickFile = (name?: string) => {
    setFile(name ?? "export_1c_2026-08-24.xlsx");
    setTimeout(() => setImported(true), 600);
  };

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Строк в файле", value: imported ? String(stats.total) : "—", delta: imported ? "+8" : "", up: true },
          { label: "Обновлено", value: imported ? String(stats.updated) : "—", delta: imported ? "+4" : "", up: true },
          { label: "Без изменений", value: imported ? String(stats.ok) : "—", delta: "0", up: true },
          { label: "Ошибок", value: imported ? String(stats.error) : "—", delta: imported ? "+1" : "", up: false },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
            {k.delta && (
              <p className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                {k.up ? "↑" : "↓"} {k.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Drop-зона */}
      {!imported ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            pickFile(f?.name);
          }}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            dragOver
              ? "border-sky-500 bg-sky-50"
              : "border-slate-300 bg-white hover:border-slate-400"
          }`}
        >
          <p className="text-3xl mb-2">📄</p>
          <p className="text-sm font-semibold text-slate-900">
            Перетащите xlsx сюда или
          </p>
          <button
            onClick={() => pickFile()}
            className="mt-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            Выбрать файл
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Демо: файл не загружается, просто имитация
          </p>
          {file && (
            <p className="mt-3 text-xs text-sky-600 font-medium">
              Загружаем {file}…
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                {file} обработан
              </p>
              <p className="text-xs text-emerald-700">
                {stats.updated} обновлено · {stats.ok} без изменений · {stats.error} ошибок
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setImported(false);
              setFile(null);
              setFilter("all");
            }}
            className="rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs font-medium px-3 py-1.5 transition-colors"
          >
            Загрузить другой файл
          </button>
        </div>
      )}

      {/* Результат */}
      {imported && (
        <>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, name: `Все (${stats.total})` },
              { id: "updated" as const, name: `Обновлено (${stats.updated})` },
              { id: "ok" as const, name: `Без изменений (${stats.ok})` },
              { id: "error" as const, name: `Ошибки (${stats.error})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">Импортированные товары</h3>
              <span className="text-[10px] text-slate-400">прокручивайте ↕</span>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.sku}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{r.price}</p>
                      <p className="text-[10px] text-slate-400">остаток: {r.stock}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS[r.status].badge}`}>
                      {STATUS[r.status].label}
                    </span>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">Ничего не найдено</p>
              )}
            </div>
          </div>
        </>
      )}

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: выберите файл, чтобы увидеть результат импорта
      </p>
    </div>
  );
}
