import { CONTACTS } from "@/lib/config";
import { TelegramIcon } from "./TelegramIcon";

const PREFIX = process.env.NEXT_PUBLIC_PROXY_PREFIX ?? "";

const NAV = [
  { label: "Приложения", href: "#catalog" },
  { label: "Живое демо", href: "#live-demo" },
  { label: "Интеграции", href: "#custom" },
  { label: "Контакты", href: "#contacts" },
];

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100">
      {/* верхняя полоса с контактами */}
      <div className="hidden md:block border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-9 flex items-center justify-between text-xs text-slate-500">
          <span>пн–пт 9:00–18:00</span>
          <div className="flex items-center gap-5">
            <a href={`mailto:${CONTACTS.email}`} className="hover:text-slate-900 transition-colors">
              {CONTACTS.email}
            </a>
            <a
              href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, "")}`}
              className="hover:text-slate-900 transition-colors"
            >
              {CONTACTS.phone}
            </a>
            <div className="flex items-center gap-3 text-slate-400">
              <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600" aria-label="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* основная шапка */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${PREFIX}/logo.svg`} alt="CRMBY" className="h-7 w-auto object-contain" />
          <span className="text-slate-400 font-normal text-xs hidden sm:inline">apps</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-600">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="hover:text-slate-900 transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 transition-colors"
          >
            <TelegramIcon className="w-4 h-4 text-sky-500" />
            Обсудить в Telegram
          </a>
          <a
            href="#cta"
            className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            Обсудить проект →
          </a>
        </div>
      </div>
    </header>
  );
}
