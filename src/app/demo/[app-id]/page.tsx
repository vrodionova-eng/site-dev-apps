import type { Metadata } from "next";
import { APPS } from "@/lib/apps";
import { APP_DEMOS } from "@/lib/demo-mocks";
import { notFound } from "next/navigation";
import DemoClient from "@/components/demo/DemoClient";

// Демо-страницы для всех приложений, кроме «Пульта руководителя»
// (у него отдельный дашборд по адресу /demo/pult)
// и SyncPoint24 (макет будет готов позже).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return APPS.filter((a) => a.id !== "pult" && a.id !== "syncpoint").map((a) => ({ "app-id": a.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/demo/[app-id]">): Promise<Metadata> {
  const { "app-id": id } = await params;
  const app = APPS.find((a) => a.id === id);
  return { title: `Демо: ${app?.name ?? "Приложение"} — CRMBY` };
}

export default async function DemoPage({
  params,
}: PageProps<"/demo/[app-id]">) {
  const { "app-id": id } = await params;
  const app = APPS.find((a) => a.id === id);
  if (!app || app.id === "pult" || app.id === "syncpoint") notFound();

  const mock = APP_DEMOS[app.id];

  return <DemoClient app={app} mock={mock} />;
}
