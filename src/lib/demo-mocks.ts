// Мокап-контент для демо-страниц приложений.
// Каждое приложение получает набор экранов с фиктивными данными,
// которые можно прокручивать, как на референсе.

export interface DemoPanel {
  title: string;
  rows: { label: string; value: string; badge?: string; tone?: "up" | "down" | "neutral" }[];
}

export interface DemoMock {
  kpis: { label: string; value: string; delta?: string; up?: boolean }[];
  panels: DemoPanel[];
}

export const APP_DEMOS: Record<string, DemoMock> = {
  soglasovanie: {
    kpis: [
      { label: "На согласовании", value: "23", delta: "+3", up: true },
      { label: "Согласовано", value: "141", delta: "+12", up: true },
      { label: "Просрочено", value: "4", delta: "−2", up: false },
      { label: "Средний срок", value: "1,4 дня", delta: "−0,3", up: true },
    ],
    panels: [
      {
        title: "Канбан согласований",
        rows: [
          { label: "Заявка на закупку #118", value: "Подано", badge: "Новая", tone: "neutral" },
          { label: "Договор с ООО «Вектор»", value: "Согласует юрист", badge: "2 день", tone: "neutral" },
          { label: "Отпуск И. Петрова", value: "Согласует РОП", badge: "сегодня", tone: "up" },
          { label: "Командировка в Минск", value: "Готово", badge: "✓", tone: "up" },
          { label: "Закупка оборудования", value: "Просрочено", badge: "4 дня", tone: "down" },
        ],
      },
      {
        title: "По типам",
        rows: [
          { label: "Закупки", value: "8 заявок" },
          { label: "Договоры", value: "6 заявок" },
          { label: "Отпуска", value: "5 заявок" },
          { label: "Командировки", value: "4 заявки" },
        ],
      },
    ],
  },
  contacts: {
    kpis: [
      { label: "Контактов в базе", value: "1 284", delta: "+24", up: true },
      { label: "Компаний", value: "312", delta: "+8", up: true },
      { label: "Без привязки", value: "17", delta: "−5", up: false },
      { label: "Дубликаты", value: "3", delta: "−2", up: false },
    ],
    panels: [
      {
        title: "Контакты по роли",
        rows: [
          { label: "Иван Петров", value: "CEO", badge: "ТОП", tone: "up" },
          { label: "Мария Соколова", value: "CFO", badge: "ТОП", tone: "up" },
          { label: "Дмитрий Карпов", value: "CTO", badge: "ТОП", tone: "up" },
          { label: "Анна Лебедева", value: "COO", badge: "ТОП", tone: "up" },
          { label: "Олег Смирнов", value: "Менеджер", badge: "Средний", tone: "neutral" },
          { label: "Елена Козлова", value: "Бухгалтер", badge: "Средний", tone: "neutral" },
          { label: "Павел Морозов", value: "Логист", badge: "Базовый", tone: "neutral" },
          { label: "Ольга Волкова", value: "Ассистент", badge: "Базовый", tone: "neutral" },
        ],
      },
      {
        title: "По компаниям",
        rows: [
          { label: "ООО «ТехноСклад»", value: "12", badge: "активна", tone: "up" },
          { label: "«Балтика»", value: "8", badge: "активна", tone: "up" },
          { label: "«Альфа»", value: "5", badge: "в работе", tone: "neutral" },
          { label: "«Прагматика»", value: "4", badge: "в работе", tone: "neutral" },
          { label: "«Вектор»", value: "3", badge: "зависла", tone: "down" },
          { label: "«Монолит»", value: "2", badge: "зависла", tone: "down" },
        ],
      },
    ],
  },
  timepay: {
    kpis: [
      { label: "Списано часов", value: "1 884", delta: "+4%", up: true },
      { label: "ФОТ", value: "876 К", delta: "+6%", up: true },
      { label: "Переработки", value: "42 ч", delta: "+18%", up: false },
      { label: "Средний грейд", value: "Middle", up: true },
    ],
    panels: [
      {
        title: "Часы по сотрудникам",
        rows: [
          { label: "Анна К. (Senior)", value: "168 ч", badge: "норма", tone: "up" },
          { label: "Дмитрий С. (Middle)", value: "172 ч", badge: "переработка", tone: "down" },
          { label: "Мария Л. (Middle)", value: "154 ч", badge: "норма", tone: "up" },
          { label: "Игорь Н. (Junior)", value: "160 ч", badge: "норма", tone: "up" },
          { label: "Олег С. (Senior)", value: "186 ч", badge: "переработка", tone: "down" },
          { label: "Елена К. (Middle)", value: "148 ч", badge: "недоработка", tone: "down" },
          { label: "Павел М. (Junior)", value: "162 ч", badge: "норма", tone: "up" },
          { label: "Ольга В. (Middle)", value: "155 ч", badge: "норма", tone: "up" },
        ],
      },
      {
        title: "По грейдам",
        rows: [
          { label: "Junior × 3", value: "82 К", badge: "480 ч" },
          { label: "Middle × 5", value: "340 К", badge: "810 ч" },
          { label: "Senior × 2", value: "454 К", badge: "354 ч" },
        ],
      },
    ],
  },
  parser1c: {
    kpis: [
      { label: "Импорт за сутки", value: "451", delta: "+38", up: true },
      { label: "Товары", value: "12 480", delta: "+120", up: true },
      { label: "Остатки обновлены", value: "98%", delta: "+2%", up: true },
      { label: "Ошибки", value: "0", delta: "−3", up: true },
    ],
    panels: [
      {
        title: "Последний импорт",
        rows: [
          { label: "Контрагенты", value: "+142", badge: "xlsx", tone: "up" },
          { label: "Номенклатура", value: "+38", badge: "xlsx", tone: "up" },
          { label: "Документы", value: "+271", badge: "xlsx", tone: "up" },
          { label: "Прайс", value: "+1 240", badge: "csv", tone: "up" },
          { label: "Остатки", value: "+8 412", badge: "csv", tone: "up" },
          { label: "Изображения", value: "+96", badge: "zip", tone: "neutral" },
        ],
      },
      {
        title: "Расписание",
        rows: [
          { label: "Товары и остатки", value: "каждый час", badge: "авто" },
          { label: "Прайс", value: "2 раза в день", badge: "авто" },
          { label: "Контрагенты", value: "еженощно", badge: "авто" },
          { label: "Документы", value: "вручную", badge: "ручной" },
        ],
      },
    ],
  },
  clientbase: {
    kpis: [
      { label: "Всего клиентов", value: "312", delta: "+8", up: true },
      { label: "В работе", value: "87", delta: "+4", up: true },
      { label: "Зависшие", value: "23", delta: "−2", up: false },
      { label: "Доход за год", value: "4,1 М", delta: "+14%", up: true },
    ],
    panels: [
      {
        title: "Топ по выплатам",
        rows: [
          { label: "ООО «Альфа»", value: "2,4 М", badge: "VIP", tone: "up" },
          { label: "«Балтика»", value: "1,8 М", badge: "VIP", tone: "up" },
          { label: "«Прагматика»", value: "1,3 М", badge: "VIP", tone: "up" },
          { label: "«ТехноСклад»", value: "0,9 М", badge: "активный", tone: "neutral" },
          { label: "«Вектор»", value: "0,6 М", badge: "активный", tone: "neutral" },
          { label: "«Монолит»", value: "0,2 М", badge: "зависший", tone: "down" },
        ],
      },
      {
        title: "Динамика по годам",
        rows: [
          { label: "2024", value: "2,8 М", badge: "база" },
          { label: "2025", value: "3,6 М", badge: "+29%", tone: "up" },
          { label: "2026", value: "4,1 М", badge: "+14%", tone: "up" },
        ],
      },
    ],
  },
  shifts: {
    kpis: [
      { label: "Смен сегодня", value: "18", delta: "+2", up: true },
      { label: "В отпуске", value: "4", delta: "+1", up: false },
      { label: "Дежурных", value: "3", delta: "0", up: true },
      { label: "Сделок назначено", value: "27", delta: "+6", up: true },
    ],
    panels: [
      {
        title: "График на неделю",
        rows: [
          { label: "Анна К.", value: "Пн Ср Пт", badge: "день", tone: "up" },
          { label: "Дмитрий С.", value: "Вт Чт Сб", badge: "день", tone: "neutral" },
          { label: "Мария Л.", value: "отпуск", badge: "отпуск", tone: "down" },
          { label: "Игорь Н.", value: "дежурный", badge: "дежурный", tone: "up" },
          { label: "Олег С.", value: "Пн–Пт", badge: "день", tone: "up" },
          { label: "Елена К.", value: "Вт Чт", badge: "вечер", tone: "neutral" },
          { label: "Павел М.", value: "Сб Вс", badge: "выходные", tone: "neutral" },
          { label: "Ольга В.", value: "отпуск", badge: "отпуск", tone: "down" },
        ],
      },
      {
        title: "Автораспределение",
        rows: [
          { label: "Новые сделки сегодня", value: "7", badge: "за день" },
          { label: "Назначено дежурному", value: "7", badge: "авто", tone: "up" },
          { label: "Без ответственного", value: "0", badge: "OK", tone: "up" },
        ],
      },
    ],
  },
  mindtask: {
    kpis: [
      { label: "Задач в проекте", value: "64", delta: "+9", up: true },
      { label: "Завершено", value: "41", delta: "+5", up: true },
      { label: "Блокируют", value: "6", delta: "−2", up: false },
      { label: "Просрочено", value: "3", delta: "−1", up: false },
    ],
    panels: [
      {
        title: "Ветки проекта",
        rows: [
          { label: "Дизайн", value: "12 задач", badge: "готово", tone: "up" },
          { label: "Бэкенд", value: "18 задач", badge: "в работе", tone: "neutral" },
          { label: "Интеграции", value: "9 задач", badge: "блок", tone: "down" },
          { label: "Контент", value: "15 задач", badge: "в работе", tone: "neutral" },
          { label: "Тесты", value: "10 задач", badge: "в работе", tone: "neutral" },
        ],
      },
      {
        title: "Блокировки",
        rows: [
          { label: "API оплаты", value: "блокирует 3", badge: "критично", tone: "down" },
          { label: "Макеты лендинга", value: "блокирует 2", badge: "средне", tone: "neutral" },
        ],
      },
    ],
  },
  "partner-lk": {
    kpis: [
      { label: "Клиенты партнёра", value: "12", delta: "+2", up: true },
      { label: "К выплате", value: "142 К", delta: "+22%", up: true },
      { label: "Сделок в работе", value: "7", delta: "+1", up: true },
      { label: "Выплачено", value: "318 К", delta: "+8%", up: true },
    ],
    panels: [
      {
        title: "Кабинет партнёра · Алексей С.",
        rows: [
          { label: "ООО «Альфа»", value: "оплачено", badge: "+48 К", tone: "up" },
          { label: "«ТехноСклад»", value: "в работе", badge: "счёт", tone: "neutral" },
          { label: "«Балтика»", value: "переговоры", badge: "КП", tone: "neutral" },
          { label: "«Прагматика»", value: "в работе", badge: "счёт", tone: "neutral" },
          { label: "«Вектор»", value: "оплачено", badge: "+22 К", tone: "up" },
          { label: "«Монолит»", value: "переговоры", badge: "КП", tone: "neutral" },
        ],
      },
      {
        title: "Комиссии",
        rows: [
          { label: "Август", value: "142 К", badge: "+22%", tone: "up" },
          { label: "Июль", value: "117 К", badge: "+18%", tone: "up" },
          { label: "Июнь", value: "98 К", badge: "база", tone: "neutral" },
          { label: "Май", value: "84 К", badge: "база", tone: "neutral" },
        ],
      },
    ],
  },
  syncpoint: {
    kpis: [
      { label: "Записей сегодня", value: "34", delta: "+6", up: true },
      { label: "Загрузка кабинетов", value: "82%", delta: "+5%", up: true },
      { label: "Филиалов", value: "3", up: true },
      { label: "Свободных окон", value: "9", delta: "−3", up: false },
    ],
    panels: [
      {
        title: "Календарь загрузки",
        rows: [
          { label: "Кабинет 1", value: "09:00–18:00", badge: "занят", tone: "neutral" },
          { label: "Кабинет 2", value: "10:00–14:00", badge: "2 окна", tone: "up" },
          { label: "Кабинет 3", value: "свободен", badge: "весь день", tone: "up" },
          { label: "Филиал на Немиге", value: "загрузка 91%", tone: "down" },
        ],
      },
      {
        title: "Ближайшие записи",
        rows: [
          { label: "10:00 · Консультация", value: "Кабинет 1" },
          { label: "11:30 · Диагностика", value: "Кабинет 2" },
          { label: "13:00 · Процедура", value: "Филиал 2" },
        ],
      },
    ],
  },
};
