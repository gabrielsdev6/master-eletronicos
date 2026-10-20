// Ficha técnica de referência por modelo (dados da Apple no lançamento).
export type Especificacao = {
  ano: number;
  tela: number; // polegadas
  telaTipo: string;
  hz120: boolean;
  chip: string;
  cameras: string;
  zoomOptico: string;
  videoHoras: number; // reprodução de vídeo, até X horas
  conector: "USB-C" | "Lightning";
  peso: number; // gramas
};

export const ESPECIFICACOES: Record<string, Especificacao> = {
  "iPhone 17 Pro Max": { ano: 2025, tela: 6.9, telaTipo: "OLED", hz120: true, chip: "A19 Pro", cameras: "Três de 48 MP", zoomOptico: "Até 8x", videoHoras: 39, conector: "USB-C", peso: 231 },
  "iPhone 17 Pro": { ano: 2025, tela: 6.3, telaTipo: "OLED", hz120: true, chip: "A19 Pro", cameras: "Três de 48 MP", zoomOptico: "Até 8x", videoHoras: 33, conector: "USB-C", peso: 204 },
  "iPhone 17": { ano: 2025, tela: 6.3, telaTipo: "OLED", hz120: true, chip: "A19", cameras: "Duas de 48 MP", zoomOptico: "2x", videoHoras: 30, conector: "USB-C", peso: 177 },
  "iPhone 16 Pro": { ano: 2024, tela: 6.3, telaTipo: "OLED", hz120: true, chip: "A18 Pro", cameras: "48 + 48 + 12 MP", zoomOptico: "Até 5x", videoHoras: 27, conector: "USB-C", peso: 199 },
  "iPhone 16": { ano: 2024, tela: 6.1, telaTipo: "OLED", hz120: false, chip: "A18", cameras: "48 + 12 MP", zoomOptico: "2x", videoHoras: 22, conector: "USB-C", peso: 170 },
  "iPhone 15 Pro Max": { ano: 2023, tela: 6.7, telaTipo: "OLED", hz120: true, chip: "A17 Pro", cameras: "48 + 12 + 12 MP", zoomOptico: "Até 5x", videoHoras: 29, conector: "USB-C", peso: 221 },
  "iPhone 15": { ano: 2023, tela: 6.1, telaTipo: "OLED", hz120: false, chip: "A16 Bionic", cameras: "48 + 12 MP", zoomOptico: "2x", videoHoras: 20, conector: "USB-C", peso: 171 },
  "iPhone 14": { ano: 2022, tela: 6.1, telaTipo: "OLED", hz120: false, chip: "A15 Bionic", cameras: "12 + 12 MP", zoomOptico: "Não tem", videoHoras: 20, conector: "Lightning", peso: 172 },
  "iPhone 13": { ano: 2021, tela: 6.1, telaTipo: "OLED", hz120: false, chip: "A15 Bionic", cameras: "12 + 12 MP", zoomOptico: "Não tem", videoHoras: 19, conector: "Lightning", peso: 174 },
  "iPhone 12": { ano: 2020, tela: 6.1, telaTipo: "OLED", hz120: false, chip: "A14 Bionic", cameras: "12 + 12 MP", zoomOptico: "Não tem", videoHoras: 17, conector: "Lightning", peso: 164 },
  "iPhone 11": { ano: 2019, tela: 6.1, telaTipo: "LCD", hz120: false, chip: "A13 Bionic", cameras: "12 + 12 MP", zoomOptico: "Não tem", videoHoras: 17, conector: "Lightning", peso: 194 },
};
