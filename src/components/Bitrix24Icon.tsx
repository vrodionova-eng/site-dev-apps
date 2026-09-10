export function Bitrix24Icon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" className={className} aria-label="Bitrix24">
      <path
        d="M38 28H12a9 9 0 0 1-1.7-17.8A13 13 0 0 1 35 7.5 10.5 10.5 0 0 1 38 28Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="currentColor"
      >
        24
      </text>
    </svg>
  );
}
