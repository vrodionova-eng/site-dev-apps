"use client";

import { useMemo, useState } from "react";
import {
  DEMO_KPIS,
  DEMO_MANAGERS,
  DEMO_DEALS,
  DEMO_REVENUE,
  DEMO_FUNNEL,
} from "@/lib/demo-data";

type PeriodPreset = "7" | "30" | "90" | "custom";
type PrevMode = "auto" | "7" | "30" | "90" | "custom";
type Metric = "revenue" | "deals";

// Дни в периоде-пресете
function presetDays(p: PeriodPreset, from: string, to: string): number {
  if (p === "7") return 7;
  if (p === "30") return 30;
  if (p === "90") return 90;
  const days = Math.max(
    1,
    Math.round(
      (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  return days;
}

// Сколько точек DEMO_REVENUE показываем для данного числа дней
function pointsForDays(days: number): number {
  if (days <= 7) return 2;
  if (days <= 30) return 6;
  return 12;
}

// Множитель KPI для периода относительно «месячных» базовых значений
function kpiMultForDays(days: number): number {
  if (days <= 7) return 0.25;
  if (days <= 30) return 1;
  if (days >= 90) return 2.8;
  return Math.min(2.8, pointsForDays(days) / 4);
}

// Интерактивный макет «Пульта руководителя» — без recharts (через прокси
// не отрисовывался), чистый SVG.
export default function PultDemo() {
  const [preset, setPreset] = useState<PeriodPreset>("30");
  const [customFrom, setCustomFrom] = useState("2026-08-01");
  const [customTo, setCustomTo] = useState("2026-08-24");
  const [metric, setMetric] = useState<Metric>("revenue");
  const [comparePrev, setComparePrev] = useState(false);
  const [prevMode, setPrevMode] = useState<PrevMode>("auto");
  const [prevFrom, setPrevFrom] = useState("2026-07-02");
  const [prevTo, setPrevTo] = useState("2026-07-31");
  const [activeManager, setActiveManager] = useState<string | null>(null);
  const [funnelStage, setFunnelStage] = useState<string | null>(null);

  // Текущий период в днях → точки на графике
  const curDays = presetDays(preset, customFrom, customTo);
  const points = pointsForDays(curDays);

  // Прошлый период в днях: auto = столько же, сколько текущий
  const prevDays = useMemo(() => {
    if (prevMode === "auto") return curDays;
    return presetDays(prevMode, prevFrom, prevTo);
  }, [prevMode, curDays, prevFrom, prevTo]);

  // Данные графика: текущий — конец ряда, прошлый — сдвинутый на длину текущего
  const revenueData = useMemo(() => {
    const cur = DEMO_REVENUE.slice(-points);
    const prev = DEMO_REVENUE.slice(-points * 2, -points);
    return cur.map((d, i) => ({
      ...d,
      prevRevenue: prev[i]?.revenue ?? d.prevRevenue,
      prevDeals: prev[i]?.deals ?? d.prevDeals,
    }));
  }, [points]);

  // Множители KPI для текущего и прошлого периодов
  const curMult = kpiMultForDays(curDays);
  // прошлый период чуть слабее текущего (~85%), чтобы % был осмысленным
  const prevMult = kpiMultForDays(prevDays) * 0.85;

  // Парсер "1 071 000" -> 1071000 для вычисления % к прошлому периоду
  const parseNum = (s: string) => Number(s.replace(/[\s ]/g, "").replace(",", "."));

  const kpis = useMemo(
    () =>
      DEMO_KPIS.map((k) => {
        const build = (mult: number) =>
          k.label === "Выручка за месяц"
            ? formatNum(Math.round(128_400 * mult))
            : k.label === "Сделок в работе"
              ? String(Math.round(27 * mult))
              : k.label === "Средний чек"
                ? formatNum(Math.round(4_850 * (mult < 1 ? 0.98 : mult > 1.5 ? 1.04 : 1)))
                : k.value;
        const displayValue = build(curMult);
        const displayPrev = build(prevMult);
        const cur = parseNum(displayValue);
        const prv = parseNum(displayPrev);
        const pct = prv > 0 ? ((cur - prv) / prv) * 100 : 0;
        return { ...k, displayValue, displayPrev, pct };
      }),
    [curMult, prevMult]
  );

  const managers = useMemo(() => {
    if (!activeManager) return DEMO_MANAGERS;
    return DEMO_MANAGERS.filter((m) => m.name === activeManager);
  }, [activeManager]);

  const deals = useMemo(() => {
    if (!funnelStage) return DEMO_DEALS;
    return DEMO_DEALS.filter((d) => d.stage === funnelStage);
  }, [funnelStage]);

  return (
    <div className="space-y-5">
      {/* Переключатель периода */}
      <div className="space-y-2">
        {/* Текущий период */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 w-24 shrink-0">Текущий период:</span>
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

          {(activeManager || funnelStage) && (
            <button
              onClick={() => {
                setActiveManager(null);
                setFunnelStage(null);
              }}
              className="ml-auto rounded-full px-4 py-1.5 text-sm font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              ✕ Сбросить фильтры
            </button>
          )}
        </div>

        {/* Прошлый период */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 w-24 shrink-0 flex items-center gap-1.5">
            <button
              onClick={() => setComparePrev((v) => !v)}
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] transition-colors ${
                comparePrev
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "border-slate-300 text-transparent hover:border-slate-400"
              }`}
              aria-label="Включить сравнение с прошлым периодом"
            >
              ✓
            </button>
            Прошлый период:
          </span>

          {comparePrev ? (
            <>
              {(["auto", "7", "30", "90"] as PrevMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPrevMode(m)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    prevMode === m
                      ? "bg-amber-500 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {m === "auto" ? "Такой же" : m === "7" ? "7 дней" : m === "30" ? "30 дней" : "90 дней"}
                </button>
              ))}
              <button
                onClick={() => setPrevMode("custom")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  prevMode === "custom"
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                📅 Свой
              </button>

              {prevMode === "custom" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={prevFrom}
                    onChange={(e) => setPrevFrom(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="date"
                    value={prevTo}
                    onChange={(e) => setPrevTo(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
                  />
                </div>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400">выключен — нажмите чекбокс для сравнения</span>
          )}
        </div>
      </div>

      {/* KPI-панель */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5"
          >
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {kpi.displayValue}
              </span>
              {kpi.unit && <span className="text-xs text-slate-400">{kpi.unit}</span>}
            </div>
            <p
              className={`mt-1 text-xs font-semibold ${
                kpi.pct >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {kpi.pct >= 0 ? "↑" : "↓"} {Math.abs(kpi.pct).toFixed(1).replace(".", ",")}%
              <span className="text-slate-400 font-normal">
                {comparePrev ? " к прошлому периоду" : " за период"}
              </span>
            </p>
            {comparePrev && (
              <p className="mt-1.5 text-xs text-slate-500 border-t border-dashed border-slate-200 pt-1.5">
                Прошлый период:{" "}
                <span className="font-semibold text-slate-700">{kpi.displayPrev}</span>
                {kpi.unit && <span className="text-slate-400"> {kpi.unit}</span>}
              </p>
            )}
            <div className="mt-3 flex items-end gap-0.5 h-8">
              {kpi.spark.map((v, j) => {
                const max = Math.max(...kpi.spark);
                const h = Math.round((v / max) * 100);
                return (
                  <div
                    key={j}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm ${
                      kpi.pct >= 0 ? "bg-emerald-200" : "bg-red-200"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Графики */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-sm">Динамика</h3>
            <div className="flex gap-1.5">
              {(["revenue", "deals"] as Metric[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    metric === m
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {m === "revenue" ? "Выручка" : "Сделки"}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={revenueData} metric={metric} comparePrev={comparePrev} />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="font-semibold text-slate-900 text-sm">Воронка продаж</h3>
            <span className="text-xs text-slate-400">
              {funnelStage ? `этап: ${funnelStage}` : "кликните по этапу"}
            </span>
          </div>
          <FunnelChart
            selected={funnelStage}
            comparePrev={comparePrev}
            prevScale={prevDays / Math.max(1, curDays)}
            onSelect={(stage) =>
              setFunnelStage((s) => (s === stage ? null : stage))
            }
          />
        </div>
      </div>

      {/* Рейтинг менеджеров + последние сделки */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-4">
            Рейтинг менеджеров
            {activeManager && (
              <span className="ml-2 text-xs font-normal text-sky-600">
                · {activeManager}
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {managers.map((m, i) => {
              const prevRev = m.prevRevenue * (prevDays / Math.max(1, curDays));
              const growth = ((m.revenue - prevRev) / prevRev) * 100;
              return (
              <button
                key={m.name}
                onClick={() =>
                  setActiveManager((s) => (s === m.name ? null : m.name))
                }
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors text-left ${
                  activeManager === m.name
                    ? "bg-sky-50 border border-sky-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                    i === 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {m.name}
                  </p>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${m.conversion * 2}%` }}
                      className="h-full rounded-full bg-sky-500"
                    />
                  </div>
                  {comparePrev && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      прошлый: {prevRev.toFixed(1).replace(".", ",")} тыс.
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {m.revenue.toFixed(1).replace(".", ",")} тыс.
                  </p>
                  <p className="text-xs text-slate-400">
                    {m.deals} сделок · {m.conversion}%
                  </p>
                  {comparePrev && (
                    <p
                      className={`text-[11px] font-semibold ${
                        growth >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {growth >= 0 ? "+" : ""}
                      {growth.toFixed(1).replace(".", ",")}%
                    </p>
                  )}
                </div>
                <span className={m.trend === "up" ? "text-emerald-500" : "text-red-400"}>
                  {m.trend === "up" ? "↑" : "↓"}
                </span>
              </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-4">
            {funnelStage ? `Сделки: ${funnelStage}` : "Последние сделки"}
          </h3>
          <div className="space-y-2.5">
            {deals.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                Нет сделок на этом этапе
              </p>
            )}
            {deals.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {d.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    #{d.id} · {d.manager} · {d.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {d.amount} BYN
                  </p>
                  <span
                    className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      d.stage === "Оплата"
                        ? "bg-emerald-50 text-emerald-700"
                        : d.stage === "Счёт выставлен"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {d.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: переключайте период, включайте сравнение с прошлым, кликайте по менеджерам и этапам воронки
      </p>
    </div>
  );
}

// --- Чистый SVG-график динамики ---
function AreaChart({
  data,
  metric,
  comparePrev,
}: {
  data: typeof DEMO_REVENUE;
  metric: Metric;
  comparePrev: boolean;
}) {
  const W = 600;
  const H = 240;
  const PAD = { top: 12, right: 12, bottom: 28, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const key = metric === "revenue" ? "revenue" : "deals";
  const prevKey = metric === "revenue" ? "prevRevenue" : "prevDeals";

  const values = data.map((d) => d[key]);
  const prevValues = data.map((d) => d[prevKey]);
  const all = comparePrev ? [...values, ...prevValues] : values;
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const span = max - min || 1;

  const pts = data.map((d, i) => {
    const x = PAD.left + (i / Math.max(1, data.length - 1)) * innerW;
    const y = PAD.top + innerH - ((d[key] - min) / span) * innerH;
    const yPrev = PAD.top + innerH - ((d[prevKey] - min) / span) * innerH;
    return { x, y, yPrev, d };
  });

  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const prevPath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.yPrev.toFixed(1)}`)
    .join(" ");
  const area = `${path} L${pts[pts.length - 1].x.toFixed(1)},${PAD.top + innerH} L${pts[0].x.toFixed(1)},${PAD.top + innerH} Z`;

  const color = metric === "revenue" ? "#3b82f6" : "#0ea5e9";
  const prevColor = "#94a3b8";

  const totalCur = values.reduce((a, b) => a + b, 0);
  const totalPrev = prevValues.reduce((a, b) => a + b, 0);
  const totalPct = totalPrev > 0 ? ((totalCur - totalPrev) / totalPrev) * 100 : 0;

  return (
    <div>
      {comparePrev && (
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
            Текущий период
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="w-3 h-0.5 rounded-full"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${prevColor} 0 3px, transparent 3px 6px)`,
              }}
            />
            Прошлый период
          </span>
          <span
            className={`ml-auto text-xs font-semibold ${
              totalPct >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {totalPct >= 0 ? "+" : ""}
            {totalPct.toFixed(1).replace(".", ",")}%
          </span>
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* сетка */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD.top + innerH - t * innerH;
          const v = min + t * span;
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {metric === "revenue" ? `${(v * 1000).toFixed(0)}К` : Math.round(v)}
              </text>
            </g>
          );
        })}

        {/* прошлый период — пунктир */}
        {comparePrev && (
          <>
            <path
              d={prevPath}
              fill="none"
              stroke={prevColor}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            {pts.map((p, i) => (
              <circle
                key={`prev-${i}`}
                cx={p.x}
                cy={p.yPrev}
                r={2.5}
                fill="#fff"
                stroke={prevColor}
                strokeWidth={1.5}
              />
            ))}
          </>
        )}

        <path d={area} fill="url(#areaGrad)" />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} />

        {/* точки */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={color} />
            <text
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {p.d.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// --- Чистый SVG-воронка ---
function FunnelChart({
  selected,
  comparePrev,
  prevScale,
  onSelect,
}: {
  selected: string | null;
  comparePrev: boolean;
  prevScale: number;
  onSelect: (stage: string) => void;
}) {
  const max = Math.max(
    ...DEMO_FUNNEL.flatMap((s) =>
      comparePrev ? [s.count, Math.round(s.prevCount * prevScale)] : [s.count]
    )
  );
  return (
    <div className="space-y-2.5">
      {DEMO_FUNNEL.map((s) => {
        const prevCount = Math.round(s.prevCount * prevScale);
        const pct = (s.count / max) * 100;
        const prevPct = (prevCount / max) * 100;
        const stagePct = prevCount > 0 ? ((s.count - prevCount) / prevCount) * 100 : 0;
        const isActive = selected === s.stage;
        return (
          <button
            key={s.stage}
            onClick={() => onSelect(s.stage)}
            className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
              isActive ? "bg-sky-50 border border-sky-300" : "hover:bg-slate-50 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-slate-700">{s.stage}</span>
              <span className="flex items-center gap-2">
                {comparePrev && (
                  <span
                    className={`text-[11px] font-semibold ${
                      stagePct >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {stagePct >= 0 ? "+" : ""}
                    {stagePct.toFixed(1).replace(".", ",")}%
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-900">{s.count}</span>
              </span>
            </div>
            <div className="h-5 rounded-md bg-slate-100 overflow-hidden">
              <div
                style={{ width: `${pct}%`, backgroundColor: s.fill }}
                className="h-full rounded-md transition-all"
              />
            </div>
            {comparePrev && (
              <div className="mt-1 h-2 rounded-sm bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${prevPct}%` }}
                  className="h-full rounded-sm bg-slate-300"
                  title={`Прошлый период: ${prevCount}`}
                />
              </div>
            )}
          </button>
        );
      })}
      {comparePrev && (
        <p className="text-[11px] text-slate-400 pt-1">
          Цветная полоса — текущий период, серая — прошлый
        </p>
      )}
    </div>
  );
}

function formatNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
