import { NextResponse } from "next/server";
import { BITRIX_WEBHOOK_URL } from "@/lib/config";

// API route: проксирует заявку на входящий вебхук Битрикс24 (crm.lead.add).
// Токен вебхука хранится только на сервере (.env.local → BITRIX_WEBHOOK_URL)
// и не попадает в браузерный бандл.
export async function POST(req: Request) {
  if (!BITRIX_WEBHOOK_URL) {
    return NextResponse.json(
      { error: "Битрикс24 вебхук не настроен (BITRIX_WEBHOOK_URL)" },
      { status: 503 }
    );
  }

  let body: { name?: string; phone?: string; email?: string; interest?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.phone?.trim()) {
    return NextResponse.json(
      { error: "Имя и телефон обязательны" },
      { status: 400 }
    );
  }

  const title = body.interest
    ? `Заявка с apps.crmby.by: ${body.interest}`
    : "Заявка с apps.crmby.by";

  // Формат полей — стандартный для crm.lead.add REST API Битрикс24
  const payload = {
    fields: {
      TITLE: title,
      NAME: body.name.trim(),
      PHONE: [{ VALUE: body.phone.trim(), VALUE_TYPE: "WORK" }],
      ...(body.email?.trim()
        ? { EMAIL: [{ VALUE: body.email.trim(), VALUE_TYPE: "WORK" }] }
        : {}),
      COMMENTS: `Интерес: ${body.interest || "не указан"}`,
      SOURCE_ID: "WEB",
      SOURCE_DESCRIPTION: "apps.crmby.by",
    },
    params: { REGISTER_SONET_EVENT: "Y" },
  };

  try {
    const res = await fetch(`${BITRIX_WEBHOOK_URL}crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) {
      console.error("Bitrix lead error:", data);
      return NextResponse.json(
        { error: "Битрикс24 отклонил заявку" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, leadId: data.result });
  } catch (e) {
    console.error("Bitrix webhook fetch failed:", e);
    return NextResponse.json(
      { error: "Не удалось связаться с Битрикс24" },
      { status: 502 }
    );
  }
}
