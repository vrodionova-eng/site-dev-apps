"use client";

import { useMemo, useState } from "react";

// Кастомное демо «Личный кабинет партнёра / агента».
// Выбор партнёра из списка и месяца; клиенты, комиссии и KPI
// пересчитываются под выбранного партнёра и дату.

type DealStatus = "оплачено" | "в работе" | "переговоры";

interface ClientDeal {
  company: string;
  status: DealStatus;
  amountK: number; // комиссия по сделке, тыс. BYN
  // индекс месяца (0 = текущий/Август, 1 = Июль, ...) в котором сделка активна
  monthIdx: number;
}

interface Partner {
  id: string;
  name: string;
  ratePct: number; // ставка комиссии, %
  clients: ClientDeal[];
}

const MONTHS = [
  { idx: 0, name: "Август 2026", short: "Август" },
  { idx: 1, name: "Июль 2026", short: "Июль" },
  { idx: 2, name: "Июнь 2026", short: "Июнь" },
  { idx: 3, name: "Май 2026", short: "Май" },
];

const PARTNERS: Partner[] = [
  {
    id: "p1",
    name: "Алексей С.",
    ratePct: 20,
    clients: [
      { company: "ООО «Альфа»", status: "оплачено", amountK: 48, monthIdx: 0 },
      { company: "«ТехноСклад»", status: "в работе", amountK: 36, monthIdx: 0 },
      { company: "«Балтика»", status: "переговоры", amountK: 22, monthIdx: 0 },
      { company: "«Прагматика»", status: "в работе", amountK: 28, monthIdx: 1 },
      { company: "«Вектор»", status: "оплачено", amountK: 22, monthIdx: 1 },
      { company: "«Монолит»", status: "переговоры", amountK: 18, monthIdx: 2 },
      { company: "«СтройГрад»", status: "оплачено", amountK: 30, monthIdx: 2 },
      { company: "«Нордик»", status: "в работе", amountK: 15, monthIdx: 3 },
    ],
  },
  {
    id: "p2",
    name: "Марина В.",
    ratePct: 15,
    clients: [
      { company: "«Грант»", status: "оплачено", amountK: 40, monthIdx: 0 },
      { company: "«Логистика Плюс»", status: "в работе", amountK: 24, monthIdx: 0 },
      { company: "«Север»", status: "оплачено", amountK: 19, monthIdx: 1 },
      { company: "«Орбита»", status: "переговоры", amountK: 26, monthIdx: 1 },
      { company: "«Дельта»", status: "оплачено", amountK: 33, monthIdx: 2 },
      { company: "«Форсаж»", status: "в работе", amountK: 17, monthIdx: 3 },
    ],
  },
  {
    id: "p3",
    name: "Игорь Д.",
    ratePct: 25,
    clients: [
      { company: "«Титан»", status: "в работе", amountK: 52, monthIdx: 0 },
      { company: "«Атлант»", status: "оплачено", amountK: 44, monthIdx: 0 },
      { company: "«Рубин»", status: "переговоры", amountK: 20, monthIdx: 1 },
      { company: "«Сапфир»", status: "оплачено", amountK: 38, monthIdx: 2 },
      { company: "«Кварц»", status: "в работе", amountK: 21, monthIdx: 3 },
    ],
  },
];

const STATUS_STYLE: Record<DealStatus, { badge: string; tone: string }> = {
  оплачено: { badge: "bg-emerald-50 text-emerald-700", tone: "up" },
  "в работе": { badge: "bg-sky-50 text-sky-700", tone: "neutral" },
  переговоры: { badge: "bg-amber-50 text-amber-700", tone: "neutral" },
};

const fmtK = (n: number) => `${Math.round(n)} К`;

export default function PartnerLkDemo() {
  const [partnerId, setPartnerId] = useState(PARTNERS[0].id);
  const [monthIdx, setMonthIdx] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"Все" | DealStatus>("Все");

  const partner = PARTNERS.find((p) => p.id === partnerId)!;

  // Сделки выбранного партнёра за выбранный месяц
  const deals = useMemo(
    () => partner.clients.filter((c) => c.monthIdx === monthIdx),
    [partner, monthIdx]
  );

  const visible = useMemo(
    () => (statusFilter === "Все" ? deals : deals.filter((d) => d.status === statusFilter)),
    [deals, statusFilter]
  );

  // Комиссия — доля партнёра от суммы сделок
  const commission = (amountK: number) => (amountK * partner.ratePct) / 100;

  const paidSum = deals.filter((d) => d.status === "оплачено").reduce((a, d) => a + commission(d.amountK), 0);
  const inWorkCount = deals.filter((d) => d.status !== "оплачено").length;
  const totalAccrued = partner.clients
    .filter((c) => c.status === "оплачено" && c.monthIdx >= monthIdx)
    .reduce((a, d) => a + commission(d.amountK), 0);

  const kpis = [
    { label: "Клиентов в месяце", value: String(deals.length), delta: "+2", up: true },
    { label: "К выплате за месяц", value: fmtK(paidSum), delta: "+22%", up: true },
    { label: "Сделок в работе", value: String(inWorkCount), delta: "+1", up: true },
    { label: "Выплачено всего", value: fmtK(totalAccrued), delta: "+8%", up: true },
  ];

  // Комиссии по месяцам для выбранного партнёра
  const byMonth = useMemo(
    () =>
      MONTHS.map((m) => {
        const sum = partner.clients
          .filter((c) => c.monthIdx === m.idx && c.status === "оплачено")
          .reduce((a, d) => a + commission(d.amountK), 0);
        return { ...m, sum };
      }),
    [partner]
  );
  const maxSum = Math.max(...byMonth.map((m) => m.sum), 1);

  return (
    <div className="space-y-5">
      {/* Селекторы */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">Партнёр:</span>
        {PARTNERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPartnerId(p.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              partnerId === p.id
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {p.name}
          </button>
        ))}

        <span className="text-xs text-slate-500 ml-3">Месяц:</span>
        {MONTHS.map((m) => (
          <button
            key={m.idx}
            onClick={() => setMonthIdx(m.idx)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              monthIdx === m.idx
                ? "bg-sky-600 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {m.short}
          </button>
        ))}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
            <p className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
              {k.up ? "↑" : "↓"} {k.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Кабинет партнёра */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">
              Кабинет партнёра · {partner.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ставка {partner.ratePct}% · {MONTHS[monthIdx].name}
            </p>
          </div>

          <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
            {(["Все", "оплачено", "в работе", "переговоры"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                  statusFilter === f
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {visible.map((d) => (
              <div
                key={d.company}
                className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-700 truncate">{d.company}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-slate-900">{d.status}</span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[d.status].badge}`}
                  >
                    {d.status === "оплачено" ? `+${fmtK(commission(d.amountK))}` : fmtK(commission(d.amountK))}
                  </span>
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">
                В этом месяце сделок нет
              </p>
            )}
          </div>
        </div>

        {/* Комиссии по месяцам */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Комиссии по месяцам</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {byMonth.map((m) => (
              <button
                key={m.idx}
                onClick={() => setMonthIdx(m.idx)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                  monthIdx === m.idx ? "bg-sky-50/70" : "hover:bg-slate-50"
                }`}
              >
                <span className="text-sm text-slate-700 w-20 shrink-0">{m.short}</span>
                <div className="flex-1 h-4 rounded-md bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${(m.sum / maxSum) * 100}%` }}
                    className={`h-full rounded-md transition-all ${
                      monthIdx === m.idx ? "bg-sky-500" : "bg-slate-300"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-14 text-right shrink-0">
                  {fmtK(m.sum)}
                </span>
              </button>
            ))}
          </div>
          <p className="px-5 py-3 text-[11px] text-slate-400 border-t border-slate-100">
            Клик по месяцу — переключить кабинет на него.
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: выбирайте партнёра и месяц, фильтруйте сделки по статусу — данные пересчитываются
      </p>
    </div>
  );
}
