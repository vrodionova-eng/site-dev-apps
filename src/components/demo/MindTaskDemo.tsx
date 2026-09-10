"use client";

import { useMemo, useState } from "react";

// Кастомное демо «Майндкарта задач Битрикс24».
// Горизонтальное дерево: корень слева, ветви вправо, соединены кривыми.
// Клик по узлу — свернуть/развернуть ветку, фильтр по статусу.

interface TaskNode {
  id: string;
  title: string;
  assignee: string;
  status: "done" | "progress" | "blocked";
  children?: TaskNode[];
}

const PROJECT: TaskNode = {
  id: "root",
  title: "Запуск корпоративного портала",
  assignee: "Анна К.",
  status: "progress",
  children: [
    {
      id: "design",
      title: "Дизайн",
      assignee: "Мария Л.",
      status: "done",
      children: [
        { id: "d1", title: "Макеты главной", assignee: "Мария Л.", status: "done" },
        { id: "d2", title: "UI-kit", assignee: "Мария Л.", status: "done" },
        { id: "d3", title: "Прототип личного кабинета", assignee: "Мария Л.", status: "done" },
      ],
    },
    {
      id: "backend",
      title: "Бэкенд",
      assignee: "Дмитрий С.",
      status: "progress",
      children: [
        { id: "b1", title: "API сделок", assignee: "Дмитрий С.", status: "done" },
        { id: "b2", title: "API оплаты", assignee: "Дмитрий С.", status: "blocked" },
        { id: "b3", title: "Интеграция с 1С", assignee: "Игорь Н.", status: "progress" },
        { id: "b4", title: "Авторизация", assignee: "Игорь Н.", status: "done" },
      ],
    },
    {
      id: "integrations",
      title: "Интеграции",
      assignee: "Игорь Н.",
      status: "blocked",
      children: [
        { id: "i1", title: "Телефония", assignee: "Игорь Н.", status: "progress" },
        { id: "i2", title: "Платёжный шлюз", assignee: "Игорь Н.", status: "blocked" },
      ],
    },
    {
      id: "content",
      title: "Контент",
      assignee: "Ольга В.",
      status: "progress",
      children: [
        { id: "c1", title: "Тексты разделов", assignee: "Ольга В.", status: "done" },
        { id: "c2", title: "База знаний", assignee: "Ольга В.", status: "progress" },
        { id: "c3", title: "Видеоинструкции", assignee: "Павел М.", status: "progress" },
      ],
    },
    {
      id: "tests",
      title: "Тестирование",
      assignee: "Павел М.",
      status: "progress",
      children: [
        { id: "t1", title: "Smoke-тесты", assignee: "Павел М.", status: "progress" },
        { id: "t2", title: "Нагрузочные", assignee: "Павел М.", status: "blocked" },
      ],
    },
  ],
};

const STATUS_STYLE = {
  done: {
    dot: "bg-emerald-500",
    label: "Готово",
    card: "border-emerald-200 bg-emerald-50/60",
    badge: "bg-emerald-100 text-emerald-700",
    edge: "#34d399",
  },
  progress: {
    dot: "bg-sky-500",
    label: "В работе",
    card: "border-sky-200 bg-sky-50/60",
    badge: "bg-sky-100 text-sky-700",
    edge: "#38bdf8",
  },
  blocked: {
    dot: "bg-red-500",
    label: "Блок",
    card: "border-red-200 bg-red-50/60",
    badge: "bg-red-100 text-red-600",
    edge: "#f87171",
  },
} as const;

const NODE_H = 56; // высота карточки узла
const V_GAP = 12; // вертикальный зазор между узлами
const COL_W = 240; // горизонтальный шаг между колонками
const NODE_W = 190; // ширина карточки

function countNodes(n: TaskNode): { total: number; done: number; blocked: number } {
  let total = 1,
    done = n.status === "done" ? 1 : 0,
    blocked = n.status === "blocked" ? 1 : 0;
  for (const c of n.children ?? []) {
    const r = countNodes(c);
    total += r.total;
    done += r.done;
    blocked += r.blocked;
  }
  return { total, done, blocked };
}

// Проставляем каждому узлу y-координату центра так, чтобы поддеревья
// не пересекались: листья идут подряд, родители — по центру детей.
interface LayoutNode {
  node: TaskNode;
  depth: number;
  y: number; // центр узла по вертикали
  children: LayoutNode[];
}

function layout(root: TaskNode, collapsed: Record<string, boolean>): LayoutNode {
  let nextY = 0;
  const place = (node: TaskNode, depth: number): LayoutNode => {
    const kids = node.children ?? [];
    const isCollapsed = collapsed[node.id] && kids.length > 0;
    if (kids.length === 0 || isCollapsed) {
      const y = nextY + NODE_H / 2;
      nextY += NODE_H + V_GAP;
      return { node, depth, y, children: [] };
    }
    const childLayouts = kids.map((c) => place(c, depth + 1));
    const y = (childLayouts[0].y + childLayouts[childLayouts.length - 1].y) / 2;
    return { node, depth, y, children: childLayouts };
  };
  return place(root, 0);
}

function matchesFilter(n: TaskNode, filter: string): boolean {
  if (filter === "all") return true;
  if (n.status === filter) return true;
  return (n.children ?? []).some((c) => matchesFilter(c, filter));
}

export default function MindTaskDemo() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "blocked" | "progress" | "done">("all");

  const stats = countNodes(PROJECT);
  const toggle = (id: string) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));

  const tree = useMemo(() => layout(PROJECT, collapsed), [collapsed]);

  // Плоский список узлов и рёбер для рендера
  const { nodes, edges, height } = useMemo(() => {
    const nodes: LayoutNode[] = [];
    const edges: { from: LayoutNode; to: LayoutNode }[] = [];
    let maxY = 0;
    const walk = (ln: LayoutNode) => {
      if (!matchesFilter(ln.node, filter)) return;
      nodes.push(ln);
      maxY = Math.max(maxY, ln.y);
      for (const c of ln.children) {
        if (matchesFilter(c.node, filter)) edges.push({ from: ln, to: c });
        walk(c);
      }
    };
    walk(tree);
    return { nodes, edges, height: maxY + NODE_H / 2 + V_GAP };
  }, [tree, filter]);

  const maxDepth = Math.max(...nodes.map((n) => n.depth), 0);
  const width = (maxDepth + 1) * COL_W;

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего задач", value: String(stats.total), delta: "+9", up: true },
          { label: "Завершено", value: String(stats.done), delta: "+5", up: true },
          { label: "Блокируют", value: String(stats.blocked), delta: "−2", up: false },
          { label: "В работе", value: String(stats.total - stats.done - stats.blocked), delta: "+4", up: true },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{k.value}</p>
            <p className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-600" : "text-red-500"}`}>
              {k.up ? "↑" : "↓"} {k.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Фильтр */}
      <div className="flex flex-wrap gap-2 items-center">
        {[
          { id: "all" as const, name: "Все" },
          { id: "progress" as const, name: "В работе" },
          { id: "blocked" as const, name: "Блокируют" },
          { id: "done" as const, name: "Готово" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {f.name}
          </button>
        ))}
        <button
          onClick={() => setCollapsed({})}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Развернуть все ветки
        </button>
      </div>

      {/* Майндкарта */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="font-semibold text-slate-900 text-sm">Ветки проекта</h3>
          <span className="text-[10px] text-slate-400">клик по узлу — свернуть/развернуть ветку</span>
        </div>
        <div className="overflow-x-auto">
          <div className="relative" style={{ width, height, minWidth: "100%" }}>
            {/* Рёбра */}
            <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
              {edges.map(({ from, to }) => {
                const x1 = from.depth * COL_W + NODE_W;
                const y1 = from.y;
                const x2 = to.depth * COL_W;
                const y2 = to.y;
                const mx = (x1 + x2) / 2;
                const color = STATUS_STYLE[to.node.status].edge;
                return (
                  <path
                    key={`${from.node.id}-${to.node.id}`}
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeOpacity={0.55}
                  />
                );
              })}
            </svg>

            {/* Узлы */}
            {nodes.map((ln) => {
              const s = STATUS_STYLE[ln.node.status];
              const hasKids = (ln.node.children ?? []).length > 0;
              const isCollapsed = collapsed[ln.node.id] && hasKids;
              const x = ln.depth * COL_W;
              const y = ln.y - NODE_H / 2;
              return (
                <button
                  key={ln.node.id}
                  onClick={() => hasKids && toggle(ln.node.id)}
                  className={`absolute text-left rounded-xl border px-3 py-2 shadow-sm transition-all hover:shadow-md ${
                    s.card
                  } ${hasKids ? "cursor-pointer" : "cursor-default"}`}
                  style={{ left: x, top: y, width: NODE_W, height: NODE_H }}
                  title={hasKids ? (isCollapsed ? "Развернуть ветку" : "Свернуть ветку") : ln.node.title}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <span className="text-[13px] font-medium text-slate-800 leading-tight truncate flex-1">
                      {ln.node.title}
                    </span>
                    {hasKids && (
                      <span className="text-slate-400 text-[10px] shrink-0">
                        {isCollapsed ? "▶" : "▼"}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-500 truncate">{ln.node.assignee}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-px rounded-full shrink-0 ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Демо-режим: сворачивайте ветки, фильтруйте по статусу — карта перестраивается
      </p>
    </div>
  );
}
