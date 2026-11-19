// Deterministisk, lokal søkefunksjon for et lite og redaksjonelt avgrenset testkorpus.
// Ingen semantisk indeksering, nettlesing eller originalartikkelverifisering.
const STOP = new Set("og i er det at som for med til på om en et de den dette der hva hvilke hvorfor hvordan kan skal har var vi jeg du min sin fra under mellom eller ikke ved av etter når hvor mye mange blir være innen også noen mer mot ut alle ulike".split(" "));
export function terms(value) {
  return [...new Set(String(value || "").toLocaleLowerCase("nb-NO")
    .replace(/æ/g,"ae").replace(/ø/g,"o").replace(/å/g,"a")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9]{3,}/g) || [])].filter(t => !STOP.has(t));
}
function matches(haystack, q) {
  return haystack.some(token => (token.startsWith(q) || (q.length >= 5 && q.startsWith(token))) && Math.min(q.length, token.length) >= 4);
}
export function retrieve(question, sources, limit = 3) {
  const q = terms(question);
  if (!q.length) return [];
  return sources.map(source => {
    const title = terms(source.title), body = terms(source.content);
    let score = 0, matched = 0;
    for (const token of q) {
      const hitTitle = matches(title, token);
      const hitBody = matches(body, token);
      if (hitTitle || hitBody) matched += 1;
      if (hitTitle) score += 5;
      if (hitBody) score += 1;
    }
    return { source, score, matched };
  }).filter(entry => entry.score >= 2 && entry.matched >= 1)
    .sort((a, b) => b.score - a.score || b.matched - a.matched)
    .slice(0, Math.max(1, Math.min(5, limit)))
    .map(entry => entry.source);
}
