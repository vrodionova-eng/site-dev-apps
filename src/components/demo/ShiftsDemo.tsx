"use client";

import { useMemo, useState } from "react";

// Кастомное демо «График смен и автораспределение сделок».
// Календарь на 2 недели: у каждого менеджера паттерн (5/2, 2/2, выходные),
// точечные перерывы, кнопка «Отпуск» (исключение из графика).
// Сделки автораспределяются только по тем, кто в смене.

type PatternId = "5/2" | "2/2" | "weekends";
type DayMark = "work" | "off" | "vacation" | "break";
type DayException =
  | { type: "vacation" }
  | { type: "break" }
  | { type: "hours"; from: string; to: string; breakFrom?: string; breakTo?: string };

interface Manager {
  id: number;
  name: string;
  pattern: PatternId;
  // Якорная дата для экстраполяции паттерна: 25.08.2026 — индекс в цикле
  anchorIndex: number;
}

const MANAGERS_INIT: Manager[] = [
  { id: 1, name: "Анна К.", pattern: "5/2", anchorIndex: 0 },
  { id: 2, name: "Дмитрий С.", pattern: "5/2", anchorIndex: 1 },
  { id: 3, name: "Мария Л.", pattern: "2/2", anchorIndex: 0 },
  { id: 4, name: "Игорь Н.", pattern: "2/2", anchorIndex: 2 },
  { id: 5, name: "Олег С.", pattern: "5/2", anchorIndex: 0 },
  { id: 6, name: "Елена К.", pattern: "2/2", anchorIndex: 1 },
  { id: 7, name: "Павел М.", pattern: "weekends", anchorIndex: 0 },
  { id: 8, name: "Ольга В.", pattern: "2/2", anchorIndex: 3 },
];

const PATTERNS: Record<PatternId, { label: string; cycle: ("W" | "O")[] }> = {
  "5/2": { label: "5 через 2", cycle: ["W", "W", "W", "W", "W", "O", "O"] },
  "2/2": { label: "2 через 2", cycle: ["W", "W", "O", "O"] },
  weekends: { label: "только выходные", cycle: ["O", "O", "O", "O", "O", "W", "W"] },
};

// Неделя с 24.08.2026 (пн) — 14 дней
const DAYS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 7, 24 + i);
  return {
    index: i,
    date: d,
    label: `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`,
    dow: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()],
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
  };
});

const DAY_STYLE: Record<DayMark, string> = {
  work: "bg-emerald-400 hover:bg-emerald-500",
  off: "bg-slate-100 hover:bg-slate-200",
  vacation: "bg-amber-300 hover:bg-amber-400",
  break: "bg-sky-300 hover:bg-sky-400",
};

const DAY_TITLE: Record<DayMark, string> = {
  work: "Смена",
  off: "Выходной",
  vacation: "Отпуск",
  break: "Перерыв",
};

// День с индивидуальным временем работы — подсвечиваем рамкой
const HOURS_STYLE = "ring-2 ring-inset ring-white/70";

// "09:00" → минуты от полуночи
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

// Чистое рабочее время за вычетом перерыва, в часах (дробное)
function netWorkHours(ex: { from: string; to: string; breakFrom?: string; breakTo?: string }): number {
  let mins = toMin(ex.to) - toMin(ex.from);
  if (ex.breakFrom && ex.breakTo) mins -= toMin(ex.breakTo) - toMin(ex.breakFrom);
  return Math.max(0, mins / 60);
}

export default function ShiftsDemo() {
  const [managers, setManagers] = useState<Manager[]>(MANAGERS_INIT);
  // исключения: ключ "managerId:dayIndex" → vacation | break | hours
  const [exceptions, setExceptions] = useState<Record<string, DayException>>({});
  const [selected, setSelected] = useState<number | null>(1);
  // выделенные дни (массовое назначение времени): "managerId:dayIndex"
  const [marked, setMarked] = useState<Set<string>>(new Set());

  const key = (m: number, d: number) => `${m}:${d}`;

  // Экстраполяция паттерна на конкретный день
  const baseMark = (m: Manager, dayIndex: number): DayMark => {
    const ex = exceptions[key(m.id, dayIndex)];
    if (ex) return ex.type === "hours" ? "work" : ex.type;
    const { cycle } = PATTERNS[m.pattern];
    const pos = (((m.anchorIndex + dayIndex) % cycle.length) + cycle.length) % cycle.length;
    return cycle[pos] === "W" ? "work" : "off";
  };

  const toggleDay = (m: Manager, dayIndex: number) => {
    const k = key(m.id, dayIndex);
    setExceptions((s) => {
      const next = { ...s };
      const cur = next[k];
      // перерыв → убрать → (дальше ничего; отпуск ставится кнопкой)
      if (cur?.type === "break") delete next[k];
      else if (!cur) next[k] = { type: "break" };
      // vacation и hours через клик по дню не снимаем — только из панели
      return next;
    });
  };

  // Клик с shift — выделить/снять выделение дня (для массового задания времени)
  const toggleMarked = (m: Manager, dayIndex: number) => {
    const k = key(m.id, dayIndex);
    setMarked((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const setVacation = (m: Manager, from: number, to: number, on: boolean) => {
    setExceptions((s) => {
      const next = { ...s };
      for (let d = from; d <= to; d++) {
        const k = key(m.id, d);
        if (on) next[k] = { type: "vacation" };
        else if (next[k]?.type === "vacation") delete next[k];
      }
      return next;
    });
  };

  // Назначить время работы (и опционально перерыв) всем выделенным дням
  const applyHours = (from: string, to: string, breakFrom?: string, breakTo?: string) => {
    setExceptions((s) => {
      const next = { ...s };
      for (const k of marked) next[k] = { type: "hours", from, to, breakFrom, breakTo };
      return next;
    });
    setMarked(new Set());
  };

  // Снять индивидуальные настройки (время работы / перерыв) со всех выделенных дней
  const clearHours = () => {
    setExceptions((s) => {
      const next = { ...s };
      for (const k of marked) {
        if (next[k]?.type === "hours") delete next[k];
      }
      return next;
    });
    setMarked(new Set());
  };

  const sel = managers.find((m) => m.id === selected) ?? null;

  // Настройки первого выделенного дня с заданным временем — чтобы панель
  // открывалась с уже заполненными значениями, а не с дефолтом
  const firstMarkedHours = useMemo(() => {
    for (const k of marked) {
      const ex = exceptions[k];
      if (ex?.type === "hours") return ex;
    }
    return undefined;
  }, [marked, exceptions]);

  // Статистика по каждому менеджеру за 14 дней
  const stats = useMemo(
    () =>
      managers.map((m) => {
        let work = 0,
          vac = 0,
          brk = 0;
        for (let d = 0; d < DAYS.length; d++) {
          const mk = baseMark(m, d);
          if (mk === "work") work++;
          else if (mk === "vacation") vac++;
          else if (mk === "break") brk++;
        }
        return { id: m.id, work, vac, brk };
      }),
    [managers, exceptions]
  );

  // Автораспределение сделок на сегодня (25.08, index=1)
  const todayIndex = 1;
  const workingToday = managers.filter((m) => baseMark(m, todayIndex) === "work");
  const NEW_DEALS = 7;
  const assignment = useMemo(() => {
    const res: Record<number, number> = {};
    workingToday.forEach((m, i) => {
      res[m.id] = Math.floor(NEW_DEALS / workingToday.length) + (i < NEW_DEALS % workingToday.length ? 1 : 0);
    });
    return res;
  }, [workingToday.length]);

  const kpis = [
    { label: "Менеджеров", value: String(managers.length) },
    { label: "В смене сегодня", value: String(workingToday.length) },
    { label: "В отпуске", value: String(managers.filter((m) => baseMark(m, todayIndex) === "vacation").length) },
    { label: "Сделок назначено", value: String(NEW_DEALS) },
  ];

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Календарь */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-sm">График на 2 недели</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <Legend cls="bg-emerald-400" label="смена" />
              <Legend cls="bg-sky-300" label="перерыв" />
              <Legend cls="bg-amber-300" label="отпуск" />
              <Legend cls="bg-slate-100 border border-slate-200" label="выходной" />
              <Legend cls={`bg-emerald-400 ${HOURS_STYLE} ring-slate-300`} label="время задано" />
            </div>
          </div>

          <table className="w-full border-separate" style={{ borderSpacing: "2px" }}>
            <thead>
              <tr>
                <th className="text-left text-[11px] font-medium text-slate-500 pr-2 py-1 sticky left-0 bg-white min-w-[110px]">
                  Менеджер
                </th>
                {DAYS.map((d) => (
                  <th key={d.index} className="text-center py-1 min-w-[34px]">
                    <div className={`text-[10px] font-medium ${d.isWeekend ? "text-red-400" : "text-slate-400"}`}>
                      {d.dow}
                    </div>
                    <div className={`text-[11px] font-semibold ${d.index === todayIndex ? "text-sky-600" : "text-slate-600"}`}>
                      {d.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.id}>
                  <td className="pr-2 py-0.5 sticky left-0 bg-white">
                    <button
                      onClick={() => setSelected((s) => (s === m.id ? null : m.id))}
                      className={`text-left text-xs font-medium truncate max-w-[110px] ${
                        selected === m.id ? "text-sky-600" : "text-slate-700 hover:text-slate-900"
                      }`}
                      title={m.name}
                    >
                      {m.name}
                    </button>
                  </td>
                  {DAYS.map((d) => {
                    const mk = baseMark(m, d.index);
                    const ex = exceptions[key(m.id, d.index)];
                    const isMarked = marked.has(key(m.id, d.index));
                    return (
                      <td key={d.index}>
                        <button
                          onClick={(e) => (e.shiftKey ? toggleMarked(m, d.index) : toggleDay(m, d.index))}
                          className={`w-8 h-8 rounded-md transition-colors flex items-center justify-center ${DAY_STYLE[mk]} ${
                            ex?.type === "hours" ? HOURS_STYLE : ""
                          } ${d.index === todayIndex ? "ring-2 ring-sky-500 ring-offset-1" : ""} ${
                            isMarked ? "outline-2 outline-offset-1 outline-slate-900" : ""
                          }`}
                          title={`${m.name} · ${d.dow} ${d.label} — ${DAY_TITLE[mk]}${
                            ex?.type === "hours"
                              ? ` ${ex.from}–${ex.to}${
                                  ex.breakFrom && ex.breakTo
                                    ? `, перерыв ${ex.breakFrom}–${ex.breakTo}, работа ${netWorkHours(ex)} ч`
                                    : ""
                                }`
                              : ""
                          } (Shift+клик — выделить)`}
                        >
                          {mk === "break" && <span className="text-[10px] text-white font-bold">Ⅱ</span>}
                          {mk === "vacation" && <span className="text-[10px] text-white font-bold">О</span>}
                          {ex?.type === "hours" && (
                            <span className="text-[8px] leading-none text-white font-bold">
                              {netWorkHours(ex)} ч
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 text-[11px] text-slate-400">
            Клик по дню — перерыв на весь день. Shift+клик — выделить дни, чтобы задать время работы.
            Клик по имени — настройки менеджера.
          </p>

          {/* Панель массового назначения времени */}
          {marked.size > 0 && (
            <HoursPanel
              // key заставляет панель перечитать настройки при смене выделения
              key={[...marked].sort().join(",")}
              count={marked.size}
              initial={firstMarkedHours}
              onApply={applyHours}
              onClearHours={clearHours}
              onCancel={() => setMarked(new Set())}
            />
          )}
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          {/* Настройки менеджера */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">
              {sel ? `Настройки: ${sel.name}` : "Настройки менеджера"}
            </h3>
            {!sel ? (
              <p className="text-xs text-slate-400">Выберите менеджера в таблице слева.</p>
            ) : (
              <ManagerPanel
                key={sel.id}
                manager={sel}
                stats={stats.find((s) => s.id === sel.id)!}
                onPattern={(p) =>
                  setManagers((ms) => ms.map((x) => (x.id === sel.id ? { ...x, pattern: p } : x)))
                }
                onVacation={(from, to) => setVacation(sel, from, to, true)}
                onClearVacation={() => setVacation(sel, 0, DAYS.length - 1, false)}
              />
            )}
          </div>

          {/* Автораспределение */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Автораспределение</h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Сегодня ({DAYS[todayIndex].dow} {DAYS[todayIndex].label}) новых сделок: {NEW_DEALS}.
              Назначаем только тем, кто в смене.
            </p>
            <div className="space-y-2">
              {workingToday.length === 0 && (
                <p className="text-xs text-red-500">Сегодня никто не работает — сделки в очереди!</p>
              )}
              {workingToday.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-700 w-24 truncate">{m.name}</span>
                  <div className="flex-1 h-4 rounded-md bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${((assignment[m.id] ?? 0) / NEW_DEALS) * 100}%` }}
                      className="h-full rounded-md bg-sky-500 transition-all"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 w-8 text-right">
                    {assignment[m.id] ?? 0}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              В отпуске и на перерыве менеджеры из распределения исключаются автоматически.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: кликайте по дням календаря, меняйте паттерны, отправляйте в отпуск — график и распределение пересчитаются
      </p>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-3 h-3 rounded ${cls}`} />
      {label}
    </span>
  );
}

// Панель массового назначения времени работы и перерыва выделенным дням.
// Всё накапливается локально и применяется одной кнопкой «Применить всё».
function HoursPanel({
  count,
  initial,
  onApply,
  onClearHours,
  onCancel,
}: {
  count: number;
  initial?: { from: string; to: string; breakFrom?: string; breakTo?: string };
  onApply: (from: string, to: string, breakFrom?: string, breakTo?: string) => void;
  onClearHours: () => void;
  onCancel: () => void;
}) {
  const [from, setFrom] = useState(initial?.from ?? "09:00");
  const [to, setTo] = useState(initial?.to ?? "18:00");
  const [withBreak, setWithBreak] = useState(!!(initial?.breakFrom && initial?.breakTo));
  const [breakFrom, setBreakFrom] = useState(initial?.breakFrom ?? "18:00");
  const [breakTo, setBreakTo] = useState(initial?.breakTo ?? "21:00");

  const workNet = netWorkHours(
    withBreak ? { from, to, breakFrom, breakTo } : { from, to }
  );

  return (
    <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 space-y-2">
      {/* Время работы */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-sky-900">
          Выделено дней: <b>{count}</b>
        </span>
        <span className="text-xs text-sky-700">время работы:</span>
        <input
          type="time"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-md border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
        />
        <span className="text-sky-400 text-xs">—</span>
        <input
          type="time"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
        />
        <span className="text-xs text-sky-700">
          итого: <b className="text-sky-900">{workNet} ч</b>
        </span>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-auto"
        >
          ✕ отмена
        </button>
      </div>

      {/* Перерыв */}
      <div className="flex items-center gap-2 flex-wrap">
        {!withBreak ? (
          <button
            onClick={() => setWithBreak(true)}
            className="rounded-md bg-white border border-sky-200 hover:border-sky-300 text-sky-700 text-xs font-medium px-3 py-1.5 transition-colors"
          >
            + добавить перерыв
          </button>
        ) : (
          <>
            <span className="text-xs text-sky-700">перерыв:</span>
            <input
              type="time"
              value={breakFrom}
              onChange={(e) => setBreakFrom(e.target.value)}
              className="rounded-md border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
            />
            <span className="text-sky-400 text-xs">—</span>
            <input
              type="time"
              value={breakTo}
              onChange={(e) => setBreakTo(e.target.value)}
              className="rounded-md border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
            />
            <button
              onClick={() => setWithBreak(false)}
              className="rounded-md bg-white border border-sky-200 hover:border-red-300 text-slate-500 hover:text-red-600 text-xs font-medium px-3 py-1.5 transition-colors"
            >
              ✕ снять перерыв
            </button>
          </>
        )}
      </div>

      {/* Действия */}
      <div className="flex items-center gap-2 pt-1 border-t border-sky-100">
        <button
          onClick={() =>
            onApply(from, to, withBreak ? breakFrom : undefined, withBreak ? breakTo : undefined)
          }
          className="rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-1.5 transition-colors"
        >
          Применить всё
        </button>
        <button
          onClick={onClearHours}
          className="rounded-md bg-white border border-sky-200 hover:border-sky-300 text-sky-700 text-xs font-medium px-3 py-1.5 transition-colors"
        >
          Снять время
        </button>
      </div>
    </div>
  );
}

function ManagerPanel({
  manager,
  stats,
  onPattern,
  onVacation,
  onClearVacation,
}: {
  manager: Manager;
  stats: { work: number; vac: number; brk: number };
  onPattern: (p: PatternId) => void;
  onVacation: (from: number, to: number) => void;
  onClearVacation: () => void;
}) {
  const [vacFrom, setVacFrom] = useState(0);
  const [vacTo, setVacTo] = useState(6);

  return (
    <div className="space-y-4">
      {/* Паттерн */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Типичный график
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(PATTERNS) as PatternId[]).map((p) => (
            <button
              key={p}
              onClick={() => onPattern(p)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                manager.pattern === p
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {PATTERNS[p].label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Переносится на все дни календаря автоматически.
        </p>
      </div>

      {/* Отпуск */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Отпуск (исключение из графика)
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <select
            value={vacFrom}
            onChange={(e) => setVacFrom(Number(e.target.value))}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            {DAYS.map((d) => (
              <option key={d.index} value={d.index}>
                {d.dow} {d.label}
              </option>
            ))}
          </select>
          <span className="text-slate-400 text-xs">—</span>
          <select
            value={vacTo}
            onChange={(e) => setVacTo(Number(e.target.value))}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            {DAYS.map((d) => (
              <option key={d.index} value={d.index}>
                {d.dow} {d.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onVacation(Math.min(vacFrom, vacTo), Math.max(vacFrom, vacTo))}
            className="rounded-md bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            🏖 Отпуск
          </button>
        </div>
        {stats.vac > 0 && (
          <button
            onClick={onClearVacation}
            className="mt-2 text-[11px] text-slate-400 hover:text-red-500 transition-colors"
          >
            ✕ убрать отпуск ({stats.vac} дн.)
          </button>
        )}
        <p className="mt-1.5 text-[11px] text-slate-400">
          Паттерн не меняется — менеджер просто уходит в исключение на эти дни.
        </p>
      </div>

      {/* Итог за 2 недели */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Смен: <b className="text-emerald-600">{stats.work}</b>
        </span>
        <span>
          Перерывов: <b className="text-sky-600">{stats.brk}</b>
        </span>
        <span>
          Отпуск: <b className="text-amber-600">{stats.vac}</b>
        </span>
      </div>
    </div>
  );
}
