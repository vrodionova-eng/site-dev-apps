"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BITRIX_FORM_URL } from "@/lib/config";
import LeadForm from "./LeadForm";

interface OrderModalContextValue {
  openOrder: (interest?: string) => void;
}

const OrderModalContext = createContext<OrderModalContextValue>({
  openOrder: () => {},
});

export const useOrderModal = () => useContext(OrderModalContext);

// Провайдер модального окна заявки.
// Если в config.ts задана BITRIX_FORM_URL — показываем готовую CRM-форму
// Битрикс24 в iframe. Иначе — внутреннюю форму, которая шлёт лид
// через API route /api/lead на REST-вебхук.
export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [interest, setInterest] = useState<string>("");

  const openOrder = useCallback((value?: string) => {
    // Если подключена CRM-форма Битрикс24 — открываем её (глобальный
    // открыватель выставляет BitrixFormLoader). Иначе — внутреннюю модалку.
    if (typeof window !== "undefined" && window.openBitrixForm) {
      window.openBitrixForm();
      return;
    }
    setInterest(value ?? "");
    setIsOpen(true);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <OrderModalContext.Provider value={{ openOrder }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <button
                onClick={close}
                aria-label="Закрыть"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                ✕
              </button>

              {BITRIX_FORM_URL ? (
                <div className="p-2 pt-12">
                  {/* Готовая форма из Битрикс24, вставленная через iframe */}
                  <iframe
                    src={BITRIX_FORM_URL}
                    className="w-full h-[70vh] border-0 rounded-xl"
                    title="Форма заявки Битрикс24"
                  />
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Обсудить проект с экспертом
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Бесплатная консультация — 30 минут. Расскажем, как это
                    работает на ваших данных.
                  </p>
                  <LeadForm defaultInterest={interest} onSuccess={close} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OrderModalContext.Provider>
  );
}
