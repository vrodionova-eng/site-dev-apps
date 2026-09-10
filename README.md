# apps.crmby.by — лендинг приложений для Битрикс24

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Recharts.

## Локальный запуск (тестовый режим)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production-сборка
npm run start        # прод-сервер после build
```

## Настройка формы Битрикс24

Есть два варианта. Приоритетный — готовая CRM-форма (вариант 1).

**Вариант 1 — embed готовой формы (рекомендуется по ТЗ):**
1. В Битрикс24: CRM → Формы → «Создать форму».
2. В настройках формы → «Вставить на сайт» → скопируйте ссылку вида
   `https://yourdomain.bitrix24.by/pub/form/XX/YYYY/`.
3. Создайте `.env.local` в корне проекта:
   ```
   NEXT_PUBLIC_BITRIX_FORM_URL=https://yourdomain.bitrix24.by/pub/form/XX/YYYY/
   ```
4. Кнопки «Заказать» и «Обсудить проект» будут открывать модалку с этой формой.

**Вариант 2 — REST-вебхук (резерв, внутренняя форма сайта):**
1. В Битрикс24: Приложения → Вебхуки → «Входящий вебхук», права: CRM.
2. В `.env.local`:
   ```
   BITRIX_WEBHOOK_URL=https://yourdomain.bitrix24.by/rest/1/XXXXXXXXXX/
   ```
   (со слэшем на конце — route сам добавляет `crm.lead.add.json`).
3. Форма на странице будет слать лиды через `/api/lead`. Токен не попадает в браузер.

## Деплой на сервер и поддомен apps.crmby.by

### 1. DNS
В панели регистратора/хостера добавить A-запись:
```
apps.crmby.by  →  A  →  <IP сервера>
```

### 2. Сервер (Ubuntu + Node 20+, nginx)

```bash
# На сервере
git clone <repo> /var/www/apps-crmby
cd /var/www/apps-crmby
cp .env.example .env.local   # заполнить BITRIX_FORM_URL / BITRIX_WEBHOOK_URL
npm ci
npm run build
```

### 3. Процесс-менеджер (pm2)

```bash
npm i -g pm2
pm2 start npm --name apps-crmby -- start -- --port 3000
pm2 save && pm2 startup
```

### 4. nginx (reverse proxy + SSL)

```nginx
server {
    server_name apps.crmby.by;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo certbot --nginx -d apps.crmby.by   # бесплатный SSL от Let's Encrypt
sudo nginx -t && sudo systemctl reload nginx
```

## Структура

```
src/
├── app/
│   ├── page.tsx              # Главная (лендинг)
│   ├── demo/pult/page.tsx    # Интерактивное демо «Пульт руководителя»
│   ├── demo/[app-id]/        # Заглушки для остальных 16 приложений
│   └── api/lead/route.ts     # Прокси на вебхук Битрикс24 (crm.lead.add)
├── components/               # Header, Hero, Pains, Catalog, Integrations, Cta, Footer,
│   │                         # OrderModal (модалка формы), LeadForm
│   └── demo/                 # PultDemo, DemoCharts, DemoHeader
├── lib/
│   ├── apps.ts               # Каталог из 17 приложений
│   ├── config.ts             # ← настройки Битрикс24 и контакты
│   └── demo-data.ts          # фиктивные данные дашборда
└── types/
```
