"use client";

import { useEffect } from "react";

// Ваша CRM-форма Битрикс24, режим «click».
// Вставляем сниппет один раз в корень: скрытый <script data-b24-form> + скрытая
// кнопка-триггер сразу после него. Лоадер Битрикса при первом клике создаст форму
// и повесит её открытие на эту кнопку (node.nextElementSibling).
// Все видимые кнопки «Заказать» вызывают openBitrixForm() → клик по скрытому триггеру.
const FORM_ATTR = "click/28/vdc3k4";
const LOADER_SRC = "https://cdn-ru.bitrix24.by/b28521132/crm/form/loader_28.js";

declare global {
  interface Window {
    b24form?: unknown;
    openBitrixForm?: () => void;
  }
}

export default function BitrixFormLoader() {
  useEffect(() => {
    // Скрытый триггер формы (один раз)
    if (!document.getElementById("b24-form-trigger")) {
      const holder = document.createElement("span");
      holder.style.display = "none";
      holder.innerHTML =
        `<script data-b24-form="${FORM_ATTR}" data-skip-moving="true"><\/script>` +
        `<button id="b24-form-trigger" type="button"></button>`;
      document.body.appendChild(holder);
    }

    // Лоадер (один раз)
    if (!window.b24form && !document.querySelector(`script[src^="${LOADER_SRC}"]`)) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `${LOADER_SRC}?${(Date.now() / 180000) | 0}`;
      document.head.appendChild(s);
    }

    // Глобальный открыватель формы. Если лоадер ещё не успел повесить
    // обработчик на триггер — повторяем клик, пока форма не откроется.
    window.openBitrixForm = () => {
      let tries = 0;
      const fire = () => {
        document.getElementById("b24-form-trigger")?.click();
        // Попап формы появляется с классом b24-form — если его нет, пробуем ещё
        if (!document.querySelector(".b24-form, [id^='b24_form'], .b24-window-wrapper")) {
          if (++tries < 20) setTimeout(fire, 300);
        }
      };
      fire();
    };
  }, []);

  return null;
}
