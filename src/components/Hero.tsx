"use client";

const ADVANTAGES = [
  { icon: "🖥️", title: "Любой сервер", note: "на своем или на платформе vibecode.bitrix24" },
  { icon: "⚡", title: "Правки за 30 минут", note: "без сложной\nоценки" },
  { icon: "🚀", title: "Без ограничений", note: "реализуем любой функционал" },
];

const BADGES = [
  { icon: "📊", title: "Ваши данные Битрикс24", note: "Подключение к CRM" },
  { icon: "🔧", title: "Кастомизация под задачу", note: "Любой функционал" },
  { icon: "🛡️", title: "Поддержка и обновления", note: "Не бросим после сдачи" },
  { icon: "🚀", title: "Быстрый запуск", note: "От 5 рабочих дней" },
];

const MINI_KPIS = [
  { label: "Выручка", value: "4,2 М", delta: "+18%", up: true },
  { label: "Конверсия", value: "73%", delta: "+5%", up: true },
  { label: "Средний чек", value: "87 К", delta: "−2%", up: false },
  { label: "Сделок", value: "48", delta: "+12", up: true },
];

const MINI_MANAGERS = [
  { name: "Алексей К.", sum: "1,82 М", pct: 92 },
  { name: "Мария П.", sum: "1,31 М", pct: 78 },
  { name: "Дмитрий С.", sum: "0,94 М", pct: 61 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-100 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-40 -left-32 w-80 h-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />

      <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-sky-600 mb-3">
              Разработка на Битрикс24
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Приложения и дашборды для вашего{" "}
              <span className="text-sky-600">Битрикс24</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
              Готовые решения и разработка под задачи вашей компании. На ваших
              данных, с сопровождением и гарантией результата.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#cta"
                className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3.5 transition-colors shadow-lg shadow-sky-600/20"
              >
                Обсудить с экспертом →
              </a>
              <a
                href="#catalog"
                className="rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-6 py-3.5 transition-colors"
              >
                Смотреть демо ↓
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
              {ADVANTAGES.map((a) => (
                <div key={a.title} className="flex flex-col">
                  <span className="text-lg leading-none h-6 flex items-center">{a.icon}</span>
                  <p className="text-sm font-bold text-slate-900 mt-1.5 leading-snug whitespace-nowrap">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug whitespace-pre-line">{a.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Мокап дашборда как на референсе */}
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-white shadow-2xl shadow-slate-200 border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400">apps.crmby.by/demo/pult</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {MINI_KPIS.map((k) => (
                  <div key={k.label} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <p className="text-[10px] text-slate-500">{k.label}</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{k.value}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                      {k.up ? "↑" : "↓"} {k.delta}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                <p className="text-xs text-slate-500 mb-2.5">Рейтинг менеджеров</p>
                <div className="space-y-2">
                  {MINI_MANAGERS.map((m) => (
                    <div key={m.name} className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-600 w-20 truncate">{m.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${m.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 w-14 text-right">{m.sum}</span>
                      <span className="text-[10px] text-slate-400 w-8 text-right">{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 бейджа */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-4"
            >
              <span className="text-xl">{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{b.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
