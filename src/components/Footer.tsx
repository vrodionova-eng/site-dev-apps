"use client";

import { CONTACTS } from "@/lib/config";
import { APPS } from "@/lib/apps";
import { TelegramIcon } from "./TelegramIcon";
import Link from "next/link";
import { useOrderModal } from "./OrderModal";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

const INTEGRATIONS = [
  "Битрикс", "Excel / Google Sheets", "Telegram", "Сайт", "Соцсети", "Телефония", "REST API",
];

const APP_COLUMNS = [
  APPS.slice(0, Math.ceil(APPS.length / 2)),
  APPS.slice(Math.ceil(APPS.length / 2)),
];

export default function Footer() {
  const { openOrder } = useOrderModal();

  return (
    <footer id="contacts" className="bg-slate-900 text-slate-400 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* контакты */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${PREFIX}/logo-white.svg`} alt="CRMBY" className="h-7 w-auto object-contain" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">Контакты</p>
            <div className="mt-3 space-y-1.5 text-sm">
              <p>
                <a href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white transition-colors">
                  {CONTACTS.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACTS.email}`} className="hover:text-white transition-colors">
                  {CONTACTS.email}
                </a>
              </p>
              <p>
                <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <TelegramIcon className="w-4 h-4" /> Telegram
                </a>
              </p>
              <p className="pt-2 text-slate-500">Пишите или звоните по любым вопросам</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-slate-200 mb-3">Приложения</p>
            <div className="grid grid-cols-2 gap-6">
              {APP_COLUMNS.map((apps, index) => (
                <ul key={index} className="space-y-2 text-sm min-w-0">
                  {apps.map((app) => (
                    <li key={app.id}>
                      {app.demoUnavailable ? (
                        <span>{app.name} (скоро)</span>
                      ) : (
                        <Link href={`${PREFIX}/demo/${app.id}`} className="hover:text-white transition-colors">
                          {app.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200 mb-3">Интеграции</p>
            <ul className="space-y-2 text-sm">
              {INTEGRATIONS.map((integration) => (
                <li key={integration}>
                  <button
                    type="button"
                    onClick={() => openOrder(`Интеграция: ${integration}`)}
                    className="text-left hover:text-white transition-colors cursor-pointer"
                  >
                    {integration}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200 mb-3">Компания</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://crm.by/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  О компании
                </a>
              </li>
              <li>
                <Link href="#catalog" className="hover:text-white transition-colors">Кейсы</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <p>crmby © 2026. Все права защищены. Разработка и интеграция Битрикс24.</p>
          <p className="text-slate-500">{CONTACTS.domain}</p>
        </div>
      </div>
    </footer>
  );
}
