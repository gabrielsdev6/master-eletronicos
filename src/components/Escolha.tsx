"use client";

// Grupo de opções em botões (rádio de verdade por baixo, funciona no teclado)
export function Escolha<T extends string>({
  nome,
  legenda,
  opcoes,
  valor,
  onChange,
}: {
  nome: string;
  legenda: string;
  opcoes: { valor: T; rotulo: string }[];
  valor: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <label key={o.valor} className="cursor-pointer">
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={valor === o.valor}
              onChange={() => onChange(o.valor)}
              className="peer sr-only"
            />
            <span className="pressiona block rounded-full border border-linha bg-papel px-4 py-2 text-sm font-semibold peer-checked:border-preto peer-checked:bg-preto peer-checked:text-amarelo peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-preto hover:border-preto">
              {o.rotulo}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
