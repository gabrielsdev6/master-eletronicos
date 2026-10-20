// Tabela de exemplo para estimar o valor do usado na troca.
// Trocar pelos valores que a loja paga hoje. O valor final é sempre definido
// na avaliação presencial.

// Valor base: aparelho de 128 GB em bom estado, bateria acima de 90%
export const VALOR_BASE: Record<string, number> = {
  "iPhone 17 Pro Max": 8000,
  "iPhone 17 Pro": 7000,
  "iPhone 17": 5000,
  "iPhone 16 Pro Max": 5500,
  "iPhone 16 Pro": 4900,
  "iPhone 16 Plus": 4000,
  "iPhone 16": 3700,
  "iPhone 15 Pro Max": 4300,
  "iPhone 15 Pro": 3800,
  "iPhone 15 Plus": 3100,
  "iPhone 15": 2900,
  "iPhone 14 Pro Max": 3400,
  "iPhone 14 Pro": 3000,
  "iPhone 14 Plus": 2400,
  "iPhone 14": 2200,
  "iPhone 13 Pro Max": 2600,
  "iPhone 13 Pro": 2300,
  "iPhone 13": 1700,
  "iPhone 12 Pro Max": 1800,
  "iPhone 12 Pro": 1600,
  "iPhone 12": 1250,
  "iPhone 11 Pro Max": 1250,
  "iPhone 11 Pro": 1100,
  "iPhone 11": 900,
};

export const MODELOS_TROCA = Object.keys(VALOR_BASE);

export const ARMAZENAMENTOS_TROCA: { gb: number; ajuste: number }[] = [
  { gb: 64, ajuste: -150 },
  { gb: 128, ajuste: 0 },
  { gb: 256, ajuste: 250 },
  { gb: 512, ajuste: 500 },
  { gb: 1024, ajuste: 800 },
];

export type Opcao = { valor: string; rotulo: string; desconto: number };

// desconto em % sobre o valor base
export const PERGUNTAS = {
  tela: [
    { valor: "perfeita", rotulo: "Perfeita", desconto: 0 },
    { valor: "riscos", rotulo: "Riscos leves", desconto: 8 },
    { valor: "trincada", rotulo: "Trincada", desconto: 35 },
  ],
  traseira: [
    { valor: "perfeita", rotulo: "Perfeita", desconto: 0 },
    { valor: "riscos", rotulo: "Riscos leves", desconto: 5 },
    { valor: "trincada", rotulo: "Trincada", desconto: 20 },
  ],
  bateria: [
    { valor: "90", rotulo: "90% ou mais", desconto: 0 },
    { valor: "85", rotulo: "85 a 89%", desconto: 5 },
    { valor: "80", rotulo: "80 a 84%", desconto: 10 },
    { valor: "79", rotulo: "Abaixo de 80%", desconto: 18 },
  ],
  faceId: [
    { valor: "sim", rotulo: "Funciona", desconto: 0 },
    { valor: "nao", rotulo: "Não funciona", desconto: 25 },
  ],
  reparo: [
    { valor: "nao", rotulo: "Nunca foi aberto", desconto: 0 },
    { valor: "sim", rotulo: "Já foi consertado", desconto: 10 },
  ],
} satisfies Record<string, Opcao[]>;

export type Respostas = {
  modelo: string;
  gb: number;
  tela: string;
  traseira: string;
  bateria: string;
  faceId: string;
  reparo: string;
};

function arredondar50(v: number) {
  return Math.max(0, Math.round(v / 50) * 50);
}

export function estimarTroca(r: Respostas) {
  const base = VALOR_BASE[r.modelo];
  if (!base) return null;
  const ajusteGb = ARMAZENAMENTOS_TROCA.find((a) => a.gb === r.gb)?.ajuste ?? 0;
  const descontos = (Object.keys(PERGUNTAS) as (keyof typeof PERGUNTAS)[]).reduce((total, chave) => {
    const opcao = (PERGUNTAS[chave] as Opcao[]).find((o) => o.valor === r[chave]);
    return total + (opcao?.desconto ?? 0);
  }, 0);
  const valor = (base + ajusteGb) * (1 - Math.min(descontos, 70) / 100);
  return { minimo: arredondar50(valor * 0.93), maximo: arredondar50(valor * 1.05) };
}

export function rotuloDe(chave: keyof typeof PERGUNTAS, valor: string) {
  return (PERGUNTAS[chave] as Opcao[]).find((o) => o.valor === valor)?.rotulo ?? valor;
}
