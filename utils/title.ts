// utils/title.ts
/** Înlocuiește placeholderul [NumeCopil] cu numele dorit (fallback: "Edy"). */
export function displayTitleFromPlaceholder(template: string, childName?: string) {
  const name = (childName || "Edy").trim();
  return (template || "").replace(/\[NumeCopil\]/g, name || "Edy");
}

/** Varianta sigură pentru coș/Stripe (scurtează numele la maxLen ca să nu devină prea lung). */
export function displayTitleSafe(template: string, childName?: string, maxLen = 24) {
  const name = ((childName || "Edy").trim()).slice(0, maxLen);
  return (template || "").replace(/\[NumeCopil\]/g, name || "Edy");
}
