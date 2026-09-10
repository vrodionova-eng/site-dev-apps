// ─────────────────────────────────────────────────────────────
// НАСТРОЙКИ БИТРИКС24 — заполнить перед деплоем
// ─────────────────────────────────────────────────────────────

// Вариант 1 (приоритетный): готовая CRM-форма, созданная в Битрикс24
// (CRM → Формы → создать форму → «Вставить на сайт» → скопировать ссылку вида
//  https://yourdomain.bitrix24.by/pub/form/XX/YYYY/).
// Если ссылка задана — кнопки «Заказать» и «Обсудить проект» открывают
// модальное окно с этой формой (iframe), а внутренняя форма сайта не используется.
export const BITRIX_FORM_URL =
  process.env.NEXT_PUBLIC_BITRIX_FORM_URL ?? "";

// Подключена ли CRM-форма Битрикс24 (script-лоадер, режим «click»).
// Сниппет грузится через BitrixFormLoader в layout. Когда true — все кнопки
// «Заказать» / «Заказать это решение» / «Отправить заявку» открывают вашу форму.
export const BITRIX_FORM_SNIPPET = true;

// Любая из двух интеграций формы активна
export const BITRIX_FORM_ENABLED = BITRIX_FORM_SNIPPET || !!BITRIX_FORM_URL;

// Вариант 2 (резервный): входящий вебхук для создания лида через REST API.
// Создаётся в Битрикс24: Приложения → Вебхуки → Входящий вебхук (права: CRM).
// Используется внутренней формой сайта через API route /api/lead,
// чтобы не светить токен в браузере. Указывается в .env.local (НЕ коммитить).
export const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL ?? "";

// Контакты компании (футер, шапка)
export const CONTACTS = {
  phone: "+375 29 107-41-41",
  email: "l.klimuk@crm.by",
  telegram: "https://t.me/managercrmby",
  brand: "CRMBY",
  domain: "apps.crmby.by",
};
