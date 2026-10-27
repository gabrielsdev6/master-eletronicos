// "iPhone 15 Pro 256 GB Titânio natural" -> "iphone-15-pro-256-gb-titanio-natural"
export function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
