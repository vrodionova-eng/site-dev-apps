"use client";

import { App } from "@/types";
import { DemoMock } from "@/lib/demo-mocks";
import DemoHeader from "@/components/demo/DemoHeader";
import AppDemoMock from "@/components/demo/AppDemoMock";
import SoglasovanieDemo from "@/components/demo/SoglasovanieDemo";
import MindTaskDemo from "@/components/demo/MindTaskDemo";
import Parser1cDemo from "@/components/demo/Parser1cDemo";
import ContactsTabDemo from "@/components/demo/ContactsTabDemo";
import TimepayDemo from "@/components/demo/TimepayDemo";
import ShiftsDemo from "@/components/demo/ShiftsDemo";
import PartnerLkDemo from "@/components/demo/PartnerLkDemo";

const CUSTOM_DEMOS: Record<string, () => React.ReactNode> = {
  soglasovanie: () => <SoglasovanieDemo />,
  mindtask: () => <MindTaskDemo />,
  parser1c: () => <Parser1cDemo />,
  contacts: () => <ContactsTabDemo />,
  timepay: () => <TimepayDemo />,
  shifts: () => <ShiftsDemo />,
  "partner-lk": () => <PartnerLkDemo />,
};

// Полностью клиентский рендер — через прокси портала RSC-гидрация
// обрывается, и кнопки не оживают. Поэтому рендерим всё на клиенте.
export default function DemoClient({
  app,
  mock,
}: {
  app: App;
  mock: DemoMock | undefined;
}) {
  const custom = CUSTOM_DEMOS[app.id];

  return (
    <div className="min-h-screen bg-slate-100">
      <DemoHeader appName={app.name} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Демо-режим: данные тестовые, интерфейс интерактивный, показывают, как примерно может быть реализовано решение
        </div>
        {custom ? (
          custom()
        ) : mock ? (
          <AppDemoMock mock={mock} />
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center text-slate-500">
            Макет для этого приложения готовится.
          </div>
        )}
      </main>
    </div>
  );
}
