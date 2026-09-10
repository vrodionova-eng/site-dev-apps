// Фиктивные, но реалистичные данные для демо-дашборда «Пульт руководителя»
// Масштаб — небольшая компания (выручка ~130 тыс. BYN/мес)

export const DEMO_KPIS = [
  { label: "Выручка за месяц", value: "128 400", prev: "108 700", unit: "BYN", change: +18, spark: [12, 14, 13, 17, 16, 19, 22, 21, 24, 26, 25, 29] },
  { label: "Конверсия в оплату", value: "34,2", prev: "30,1", unit: "%", change: +4.1, spark: [28, 29, 31, 30, 32, 31, 33, 32, 34, 33, 34, 34] },
  { label: "Сделок в работе", value: "27", prev: "23", unit: "", change: +4, spark: [14, 16, 18, 17, 19, 20, 22, 23, 24, 25, 26, 27] },
  { label: "Средний чек", value: "4 850", prev: "4 960", unit: "BYN", change: -2.4, spark: [52, 51, 53, 50, 51, 49, 50, 48, 49, 50, 49, 49] },
];

export const DEMO_FUNNEL = [
  { stage: "Новый лид", count: 64, prevCount: 57, fill: "#60a5fa" },
  { stage: "Квалификация", count: 43, prevCount: 39, fill: "#3b82f6" },
  { stage: "Презентация", count: 29, prevCount: 26, fill: "#2563eb" },
  { stage: "Счёт выставлен", count: 18, prevCount: 16, fill: "#1d4ed8" },
  { stage: "Оплата", count: 11, prevCount: 10, fill: "#1e40af" },
];

export const DEMO_REVENUE = [
  { month: "Сен", revenue: 0.087, deals: 9, prevRevenue: 0.075, prevDeals: 8 },
  { month: "Окт", revenue: 0.093, deals: 10, prevRevenue: 0.081, prevDeals: 9 },
  { month: "Ноя", revenue: 0.084, deals: 9, prevRevenue: 0.078, prevDeals: 8 },
  { month: "Дек", revenue: 0.108, deals: 12, prevRevenue: 0.090, prevDeals: 10 },
  { month: "Янв", revenue: 0.096, deals: 10, prevRevenue: 0.087, prevDeals: 9 },
  { month: "Фев", revenue: 0.114, deals: 12, prevRevenue: 0.099, prevDeals: 10 },
  { month: "Мар", revenue: 0.123, deals: 13, prevRevenue: 0.102, prevDeals: 11 },
  { month: "Апр", revenue: 0.117, deals: 12, prevRevenue: 0.105, prevDeals: 11 },
  { month: "Май", revenue: 0.120, deals: 13, prevRevenue: 0.105, prevDeals: 11 },
  { month: "Июн", revenue: 0.129, deals: 14, prevRevenue: 0.108, prevDeals: 12 },
  { month: "Июл", revenue: 0.123, deals: 13, prevRevenue: 0.105, prevDeals: 12 },
  { month: "Авг", revenue: 0.128, deals: 14, prevRevenue: 0.109, prevDeals: 12 },
];

export const DEMO_MANAGERS = [
  { name: "Анна Ковальская", deals: 6, revenue: 21.4, prevRevenue: 18.5, conversion: 41, trend: "up" as const },
  { name: "Дмитрий Савицкий", deals: 5, revenue: 18.2, prevRevenue: 16.8, conversion: 38, trend: "up" as const },
  { name: "Мария Лис", deals: 5, revenue: 16.1, prevRevenue: 17.2, conversion: 33, trend: "down" as const },
  { name: "Игорь Новик", deals: 4, revenue: 13.8, prevRevenue: 12.0, conversion: 29, trend: "up" as const },
  { name: "Ольга Рудь", deals: 3, revenue: 8.9, prevRevenue: 10.1, conversion: 24, trend: "down" as const },
];

export const DEMO_DEALS = [
  { id: "2841", title: "Внедрение CRM, ООО «ТехноСклад»", amount: "7 400", stage: "Счёт выставлен", manager: "Анна Ковальская", date: "24.08" },
  { id: "2840", title: "Лицензии Б24, ЧТУП «АльфаСтрой»", amount: "2 850", stage: "Переговоры", manager: "Дмитрий Савицкий", date: "24.08" },
  { id: "2839", title: "Интеграция телефонии, ООО «МедЦентр»", amount: "4 100", stage: "Оплата", manager: "Мария Лис", date: "23.08" },
  { id: "2838", title: "Портал + обучение, ОДО «Логистик»", amount: "9 600", stage: "Презентация", manager: "Игорь Новик", date: "23.08" },
  { id: "2837", title: "Доработка воронки, ООО «РитейлГрупп»", amount: "3 200", stage: "Новый лид", manager: "Ольга Рудь", date: "22.08" },
];
