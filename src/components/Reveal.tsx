import { ReactNode } from "react";

// Обёртка-проксик для совместимости. Раньше использовалась для
// анимации появления при скролле; убрана для надёжной работы через прокси.
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
