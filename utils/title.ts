export function displayTitleFromPlaceholder(baseTitle: string, name: string){
  const n = (name || "").trim() || "Edy";
  return baseTitle.replace(/\[NumeCopil\]/g, n);
}
