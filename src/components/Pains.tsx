import Reveal from "./Reveal";

const PAINS = [
  {
    icon: "📊",
    title: "Управляете вслепую",
    items: [
      "Данные есть везде, полной картины — нигде",
      "Отчёты собираются полдня вручную",
      "Проблемы видны, когда уже пожар",
      "KPI спорные, премии — повод для конфликта",
    ],
  },
  {
    icon: "⏱️",
    title: "Рутина вместо стратегии",
    items: [
      "Команда и руководители тонут в повторяющихся задачах",
      "Задачи в блокнотах, чатах и головах",
      "Руководители сводят цифры, а не управляют",
      "Планёрки про отчёты, а не про действия",
    ],
  },
  {
    icon: "🤖",
    title: "AI есть, пользы нет",
    items: [
      "Технология где-то рядом, но в работу не встроена",
      "Суммаризация переписок — вручную",
      "Поиск по сделкам — вручную",
      "Автоматизация рутины — нет",
    ],
  },
];

export default function Pains() {
  return (
    <section id="pains" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            Узнаёте себя хотя бы в одном?
          </h2>
          <p className="mt-3 text-slate-500 text-center max-w-2xl mx-auto">
            Три типичные ситуации — и приложение из каталога для каждой.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {PAINS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-slate-100 bg-slate-50/50 p-6 hover:border-sky-200 hover:bg-sky-50/40 transition-colors">
                <div className="text-3xl">{p.icon}</div>
                <h3 className="mt-4 font-semibold text-slate-900 text-lg">
                  {p.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-300 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
