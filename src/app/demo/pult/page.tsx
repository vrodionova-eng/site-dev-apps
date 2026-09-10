"use client";

import PultDemo from "@/components/demo/PultDemo";
import DemoHeader from "@/components/demo/DemoHeader";

// Полностью клиентская страница — иначе через прокси портала
// RSC-гидрация обрывается и клики не работают.
export default function PultDemoPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <DemoHeader appName="Пульт руководителя" />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Демо-режим: данные тестовые, интерфейс интерактивный, показывают, как примерно может быть реализовано решение
        </div>
        <PultDemo />
      </main>
    </div>
  );
}
