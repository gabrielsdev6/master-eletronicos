import { temTresCameras } from "@/lib/aparelhos";

// Traseira de iPhone desenhada em CSS, na cor do aparelho.
// No site final entra a foto real.
export function Celular({
  modelo,
  corHex,
  className = "",
}: {
  modelo: string;
  corHex: string;
  className?: string;
}) {
  const tres = temTresCameras(modelo);
  return (
    <div
      aria-hidden
      className={`celular ${className}`}
      style={{ "--corpo": corHex } as React.CSSProperties}
    >
      <div className={`celular-camera ${tres ? "tres" : "duas"}`}>
        <span />
        <span />
        {tres && <span />}
        <i />
      </div>
    </div>
  );
}
