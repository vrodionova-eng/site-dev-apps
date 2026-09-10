"use client";

import { useMemo, useState } from "react";

// Кастомное демо «Дополнительная вкладка «Потенциальные клиенты» в карточках».
// Карточка объекта на продажу (недвижимость) в стиле Битрикс24: шевроны стадий,
// левая колонка с полями, вкладки «Сделки» и «Потенциальные клиенты».

type LeadStatus = "new" | "called" | "thinking" | "refused";

interface Lead {
  id: number;
  name: string;
  budget: string;
  phone: string;
  comment: string;
  score: number; // 0..100 — насколько «горячий»
  status: LeadStatus;
}

interface Deal {
  id: string;
  title: string;
  buyer: string;
  amount: string;
  stage: string;
  date: string;
  active: boolean;
}

const STATUS: Record<LeadStatus, { label: string; cls: string }> = {
  new: { label: "Новый", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  called: { label: "Прозвонён", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  thinking: { label: "Думает", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  refused: { label: "Отказ", cls: "bg-red-50 text-red-600 border-red-200" },
};

const STAGES = ["Начало", "Согласование", "Подготовка документов", "Сделка закрыта"];
const TABS = ["Общие", "Покупатели", "Сделки", "Потенциальные клиенты", "История", "Связи"];

// Уже привязанные к карточке потенциальные клиенты
const INITIAL_ATTACHED: Lead[] = [
  { id: 1, name: "Сергей Климович", budget: "до 230 000", phone: "+375 29 000-00-00", comment: "Ищет 2-комн. для семьи, ипотека одобрена", score: 86, status: "called" },
  { id: 2, name: "Наталья Грицук", budget: "210 000–250 000", phone: "+375 29 000-00-00", comment: "Рассматривает ЖК Депо и Уборевича", score: 72, status: "thinking" },
  { id: 3, name: "Андрей Лукашевич", budget: "до 200 000", phone: "+375 29 000-00-00", comment: "Первый взнос есть, выбирает район", score: 54, status: "new" },
];

// «База» — отсюда автоподбор предлагает добавить
const BASE_POOL: Lead[] = [
  { id: 11, name: "Ольга Жукова", budget: "240 000–260 000", phone: "+375 29 000-00-00", comment: "Смотрела 3 объекта в этом ЖК", score: 91, status: "new" },
  { id: 12, name: "Виктор Савельев", budget: "до 195 000", phone: "+375 29 000-00-00", comment: "Интересовался 2-комн. от 70 м²", score: 68, status: "new" },
  { id: 13, name: "Екатерина Михайлова", budget: "180 000–210 000", phone: "+375 29 000-00-00", comment: "Продаёт однушку, покупает 2-комн.", score: 47, status: "new" },
  { id: 14, name: "Дмитрий Ковалёв", budget: "до 255 000", phone: "+375 29 000-00-00", comment: "Готов к сделке в этом месяце", score: 79, status: "new" },
  { id: 15, name: "Ирина Павловская", budget: "до 170 000", phone: "+375 29 000-00-00", comment: "Пока только присматривается", score: 38, status: "new" },
  { id: 16, name: "Максим Тарасевич", budget: "200 000–240 000", phone: "+375 29 000-00-00", comment: "Рассматривает новостройки у метро", score: 63, status: "new" },
  { id: 17, name: "Алёна Сидорук", budget: "230 000–250 000", phone: "+375 29 000-00-00", comment: "Просила планировки ЖК Депо", score: 84, status: "new" },
  { id: 18, name: "Павел Романюк", budget: "до 220 000", phone: "+375 29 000-00-00", comment: "Сравнивает с вторичкой", score: 57, status: "new" },
];

const DEALS: Deal[] = [
  { id: "1284", title: "Продажа недвижимости #1284", buyer: "Сергей Климович", amount: "235 000 BYN", stage: "Согласование", date: "24.08", active: true },
];

const FIELDS: [string, string][] = [
  ["Тип объекта", "Квартира"],
  ["Количество комнат", "2"],
  ["Год постройки", "2021"],
  ["Жилая площадь", "не заполнено"],
  ["Общая площадь", "77"],
  ["Стоимость", "235 000 BYN"],
  ["Новостройка / Вторичка", "Новостройка"],
  ["Район", "не заполнено"],
  ["ЖК", "Депо"],
];

export default function ContactsTabDemo() {
  const [activeTab, setActiveTab] = useState("Потенциальные клиенты");
  const [stage, setStage] = useState(1); // «Согласование»
  const [attached, setAttached] = useState<Lead[]>(INITIAL_ATTACHED);
  const [pool, setPool] = useState<Lead[]>(BASE_POOL);
  const [query, setQuery] = useState("");
  const [autoOn, setAutoOn] = useState(true);
  const [justAdded, setJustAdded] = useState<number | null>(null);

  const suggested = useMemo(
    () => pool.filter((l) => l.score >= 70).sort((a, b) => b.score - a.score),
    [pool]
  );

  const filteredAttached = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attached;
    return attached.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.budget.toLowerCase().includes(q) ||
        l.comment.toLowerCase().includes(q)
    );
  }, [attached, query]);

  const add = (lead: Lead) => {
    setAttached((a) => [lead, ...a]);
    setPool((p) => p.filter((x) => x.id !== lead.id));
    setJustAdded(lead.id);
    setTimeout(() => setJustAdded(null), 900);
  };

  const addAllSuggested = () => {
    setAttached((a) => [...suggested, ...a]);
    setPool((p) => p.filter((x) => !suggested.some((s) => s.id === x.id)));
  };

  const remove = (lead: Lead) => {
    setAttached((a) => a.filter((x) => x.id !== lead.id));
    setPool((p) => [...p, lead].sort((a, b) => b.score - a.score));
  };

  const cycleStatus = (lead: Lead) => {
    const order: LeadStatus[] = ["new", "called", "thinking", "refused"];
    const next = order[(order.indexOf(lead.status) + 1) % order.length];
    setAttached((a) => a.map((x) => (x.id === lead.id ? { ...x, status: next } : x)));
  };

  const hot = attached.filter((l) => l.score >= 70).length;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-[#eef2f5]">
      {/* ===== Заголовок карточки ===== */}
      <div className="bg-white px-5 pt-4 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-semibold text-slate-800">Квартира</h2>
          <span className="text-slate-400 text-sm cursor-pointer" title="Редактировать">✎</span>
          <span className="text-slate-400 text-sm cursor-pointer" title="Ссылка">🔗</span>
          <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
            Новостройки <span className="text-[10px]">▾</span>
          </button>
        </div>

        {/* Шевроны стадий */}
        <div className="mt-3 flex items-stretch overflow-x-auto">
          {STAGES.map((s, i) => {
            const done = i < stage;
            const current = i === stage;
            return (
              <button
                key={s}
                onClick={() => setStage(i)}
                className={`relative flex-1 min-w-[130px] px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  current
                    ? "bg-[#3bc8f5] text-white"
                    : done
                      ? "bg-[#d6f0fb] text-[#1b7fa8] hover:bg-[#c6e9f9]"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                }`}
                style={{
                  clipPath:
                    i === 0
                      ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                      : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
                  marginLeft: i === 0 ? 0 : "-10px",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Вкладки */}
        <div className="mt-3 flex items-end gap-1 overflow-x-auto -mb-px">
          {TABS.map((t) => {
            const isOurs = t === "Потенциальные клиенты";
            const isActive = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3.5 py-2 text-sm font-medium rounded-t-lg border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-white text-slate-800 border-[#3bc8f5]"
                    : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                } ${isOurs && !isActive ? "text-[#2596c4]" : ""}`}
              >
                {t}
                {isOurs && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#3bc8f5] text-white text-[10px] font-bold">
                    {attached.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Тело карточки ===== */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-4 p-4">
        {/* Левая колонка — поля объекта */}
        <div className="space-y-4">
          {/* Об элементе */}
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Об элементе
              </p>
              <span className="text-[11px] text-slate-400 cursor-pointer hover:text-slate-600">
                изменить
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-0.5">Стадия</p>
            <p className="text-sm text-slate-800 mb-3">{STAGES[stage]}</p>
            <p className="text-[11px] text-slate-400 mb-1">Клиенты</p>
            <div className="rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-[11px] text-slate-400">Контакт</p>
              <p className="text-sm text-slate-800">{attached[0]?.name ?? "не выбран"}</p>
              {attached[0] && (
                <>
                  <p className="text-[11px] text-slate-400 mt-1.5">Телефон</p>
                  <p className="text-sm text-slate-800">{attached[0].phone}</p>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 mb-1">Ответственный</p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                ИИ
              </div>
              <div>
                <p className="text-sm font-medium text-[#2596c4]">Иван Иванов</p>
                <p className="text-[11px] text-slate-400">Технический специалист</p>
              </div>
            </div>
          </div>

          {/* Информация об объекте */}
          <div className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Информация об объекте
              </p>
              <span className="text-[11px] text-slate-400 cursor-pointer hover:text-slate-600">
                изменить
              </span>
            </div>
            <dl className="space-y-2.5">
              {FIELDS.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] text-slate-400">{label}</dt>
                  <dd
                    className={`text-sm ${
                      value === "не заполнено" ? "text-slate-300 italic" : "text-slate-800"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Правая колонка — содержимое вкладок */}
        <div className="min-w-0">
          {activeTab === "Потенциальные клиенты" ? (
            <div className="space-y-4">
              {/* Панель управления */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по имени, бюджету…"
                    className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3bc8f5]/40 focus:border-[#3bc8f5]"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
                  <button
                    onClick={() => setAutoOn((v) => !v)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      autoOn ? "bg-[#3bc8f5]" : "bg-slate-300"
                    }`}
                    aria-label="Автоподбор и обновление"
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        autoOn ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  Автоподбор и обновление
                </label>
                <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    В карточке: <b className="text-slate-700">{attached.length}</b>
                  </span>
                  <span>
                    «Горячих»: <b className="text-amber-600">{hot}</b>
                  </span>
                </div>
              </div>

              {/* Автоподбор */}
              {autoOn && suggested.length > 0 && (
                <div className="rounded-xl border border-[#3bc8f5]/40 bg-[#eef9fe] p-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                    <p className="text-xs font-semibold text-[#1b7fa8] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3bc8f5] animate-pulse" />
                      Автоподбор: найдено {suggested.length}{" "}
                      {suggested.length === 1 ? "подходящий покупатель" : "подходящих покупателей"}
                    </p>
                    <button
                      onClick={addAllSuggested}
                      className="rounded-md bg-[#3bc8f5] hover:bg-[#2bb3e0] text-white text-[11px] font-semibold px-3 py-1.5 transition-colors"
                    >
                      + Добавить всех
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {suggested.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2"
                      >
                        <Avatar name={l.name} score={l.score} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{l.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">бюджет: {l.budget}</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 shrink-0">{l.score}%</span>
                        <button
                          onClick={() => add(l)}
                          className="shrink-0 w-6 h-6 rounded-md bg-[#3bc8f5] hover:bg-[#2bb3e0] text-white text-sm font-bold flex items-center justify-center transition-colors"
                          title="Добавить в карточку"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Список привязанных */}
              <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Потенциальные клиенты · {filteredAttached.length}
                  </p>
                  <p className="text-[11px] text-slate-400">клик по статусу — сменить</p>
                </div>
                {filteredAttached.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    {query ? "Никого не нашлось по запросу" : "Пока пусто — добавьте из автоподбора"}
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {filteredAttached.map((l) => (
                      <li
                        key={l.id}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                          justAdded === l.id ? "bg-emerald-50" : ""
                        }`}
                      >
                        <Avatar name={l.name} score={l.score} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{l.name}</p>
                          <p className="text-xs text-slate-500 truncate">{l.comment}</p>
                        </div>
                        <div className="hidden md:block text-right shrink-0">
                          <p className="text-xs text-slate-600">{l.phone}</p>
                          <p className="text-[11px] text-slate-400">бюджет: {l.budget}</p>
                        </div>
                        <button
                          onClick={() => cycleStatus(l)}
                          className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${STATUS[l.status].cls}`}
                          title="Сменить статус"
                        >
                          {STATUS[l.status].label}
                        </button>
                        <button
                          onClick={() => remove(l)}
                          className="shrink-0 w-6 h-6 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 text-base leading-none flex items-center justify-center transition-colors"
                          title="Убрать из карточки"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Вкладка встраивается в стандартную карточку Битрикс24 — интерфейс можно расширять:
                автоподбор из базы, автообновление статусов и телефонов.
              </p>
            </div>
          ) : activeTab === "Сделки" ? (
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Сделки по объекту · {DEALS.length}
                </p>
                <span className="text-[11px] text-slate-400">активных: {DEALS.filter((d) => d.active).length}</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {DEALS.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        d.active ? "bg-[#eef9fe] text-[#1b7fa8]" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      🏠
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2596c4] truncate">{d.title}</p>
                      <p className="text-xs text-slate-500">
                        {d.buyer} · {d.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-800">{d.amount}</p>
                      <span
                        className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          d.stage === "Отказ"
                            ? "bg-red-50 text-red-600"
                            : d.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {d.stage}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-slate-200 p-10 text-center text-slate-400 text-sm">
              Стандартная вкладка «{activeTab}» — в демо показываем только «Сделки»
              и нашу кастомную вкладку «Потенциальные клиенты».
              <button
                onClick={() => setActiveTab("Потенциальные клиенты")}
                className="block mx-auto mt-4 rounded-md bg-[#3bc8f5] hover:bg-[#2bb3e0] text-white text-xs font-semibold px-4 py-2 transition-colors"
              >
                Открыть «Потенциальные клиенты»
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Аватар с цветовым кольцом по «горячести»
function Avatar({ name, score, size }: { name: string; score: number; size: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const ring = score >= 70 ? "ring-amber-400" : score >= 50 ? "ring-sky-300" : "ring-slate-200";
  const dim = size === "sm" ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-xs";
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#3bc8f5] to-[#2b8fc4] text-white font-bold flex items-center justify-center ring-2 ${ring} shrink-0`}
    >
      {initials}
    </div>
  );
}
