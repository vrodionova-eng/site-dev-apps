"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LeadFormData } from "@/types";
import { APPS } from "@/lib/apps";

interface LeadFormProps {
  defaultInterest?: string;
  onSuccess?: () => void;
}

// Внутренняя форма заявки. Используется, когда BITRIX_FORM_URL не задан.
// Отправка идёт на API route /api/lead, который проксирует данные
// на входящий вебхук Битрикс24 (создание Лида).
export default function LeadForm({ defaultInterest = "", onSuccess }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({ defaultValues: { interest: defaultInterest } });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Подставляем название приложения при клике «Заказать» в каталоге
  useEffect(() => {
    if (defaultInterest) setValue("interest", defaultInterest);
  }, [defaultInterest, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("lead error");
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <p className="font-semibold text-emerald-900">Заявка отправлена</p>
        <p className="text-sm text-emerald-700 mt-1">
          Менеджер свяжется с вами в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: "Укажите имя" })}
          type="text"
          placeholder="Как к вам обращаться"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phone", {
            required: "Укажите телефон",
            pattern: {
              value: /^[+]?[\d\s()\-]{9,}$/,
              message: "Проверьте формат номера",
            },
          })}
          type="tel"
          inputMode="tel"
          placeholder="+375 (__) ___-__-__"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email <span className="text-slate-400">(необязательно)</span>
        </label>
        <input
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Проверьте формат email",
            },
          })}
          type="email"
          placeholder="you@company.by"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Какое приложение или задача интересует?
        </label>
        <select
          {...register("interest")}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="">— Выберите из каталога —</option>
          {APPS.map((app) => (
            <option key={app.id} value={app.name}>
              {app.name}
            </option>
          ))}
          <option value="Кастомная разработка">
            Кастомная разработка / другое
          </option>
        </select>
      </div>

      {status === "error" && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
          Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в
          Telegram.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-3 text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {isSubmitting ? "Отправляем…" : "Отправить заявку"}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Нажимая кнопку, вы соглашаетесь с политикой обработки персональных
        данных.
      </p>
    </form>
  );
}
