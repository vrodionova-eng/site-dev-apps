import { CONTACTS } from "@/lib/config";
import { APPS } from "@/lib/apps";
import { TelegramIcon } from "./TelegramIcon";
import Link from "next/link";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

const COLUMNS = [
  {
    title: "Приложения",
    links: APPS.map((a) => ({ label: a.name, href: a.id === "pult" ? `${PREFIX}/demo/pult` : `#catalog` })),
  },
  {
    title: "Внедрение",
    links: [
      { label: "Техническое задание", href: "#cta" },
      { label: "Настройка CRM", href: "#cta" },
      { label: "Обучение", href: "#cta" },
      { label: "Техподдержка", href: "#cta" },
    ],
  },
  {
    title: "Интеграция",
    links: [
      { label: "Соцсети", href: "#custom" },
      { label: "Сайт", href: "#custom" },
      { label: "Телефония", href: "#custom" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "https://crm.by/", external: true },
      { label: "Кейсы", href: "#catalog" },
    ],
  },
];

export default function Footer() {
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

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-200 mb-3">{col.title}</p>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <p>crmby © 2026. Все права защищены. Разработка и интеграция Битрикс24.</p>
          <p className="text-slate-500">{CONTACTS.domain}</p>
        </div>
      </div>
    </footer>
  );
}
