export const loja = {
  nome: "Master Eletrônicos",
  // Número de exemplo: trocar pelo WhatsApp real da loja (só dígitos, com 55 e DDD)
  whatsapp: "5537900000000",
  endereco: "Avenida JK, 341",
  cidade: "Pimenta - MG",
  cep: "35585-000",
  horario: [
    { dias: "Segunda a sexta", horas: "8h às 18h" },
    { dias: "Sábado", horas: "8h às 12h" },
  ],
};

export const enderecoCompleto = `${loja.endereco}, ${loja.cidade}, ${loja.cep}`;

export const mapaEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  enderecoCompleto,
)}&z=16&output=embed`;

export const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  enderecoCompleto,
)}`;

export function linkWhatsApp(mensagem?: string) {
  const base = `https://wa.me/${loja.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
