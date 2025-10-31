// client/src/components/ToggleMaskButton.tsx
import React from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = { masked: boolean; onToggle: () => void };

export default function ToggleMaskButton({ masked, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/20"
      title={masked ? "Mostrar documento" : "Ocultar documento"}
      aria-pressed={!masked}
    >
      {masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      <span className="text-sm">{masked ? "Mostrar Doc." : "Ocultar Doc."}</span>
    </button>
  );
}
