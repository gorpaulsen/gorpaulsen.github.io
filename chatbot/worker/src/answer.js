// Tydelig skille mellom modellens fritekst og vår egen kildestruktur.
// Schemaet validerer *formen*. Vitenskapelig kildebelegg krever fremdeles faglig kontroll.
export const ANSWER_FORMAT = {
  type: "json_schema",
  name: "niv_source_answer",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      status: { type: "string", enum: ["answer", "insufficient"] },
      points: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            kind: { type: "string", enum: ["definisjon", "observasjon", "fortolkning", "anbefaling"] },
            text: { type: "string" },
            source_ids: { type: "array", items: { type: "integer" } }
          },
          required: ["kind", "text", "source_ids"]
        }
      },
      limitations: { type: "string" }
    },
    required: ["status", "points", "limitations"]
  }
};

export function parseGroundedAnswer(apiData, availableSources, mode = "kort") {
  if (!apiData || apiData.status !== "completed") return null;
  const content = (apiData.output || []).flatMap(item => item.content || []);
  if (content.some(part => part.type === "refusal")) return null;
  const raw = content.filter(part => part.type === "output_text" && typeof part.text === "string")
    .map(part => part.text).join("").trim();
  if (!raw || raw.length > 12000) return null;
  let parsed;
  try { parsed = JSON.parse(raw); } catch { return null; }
  if (!parsed || parsed.status !== "answer" && parsed.status !== "insufficient") return null;
  if (!Array.isArray(parsed.points) || typeof parsed.limitations !== "string") return null;
  if (parsed.status === "insufficient") {
    return { status: "insufficient", answer: "Det tilgjengelige kildematerialet gir ikke grunnlag for et tilstrekkelig dokumentert svar.", cited: [] };
  }
  if (parsed.points.length < 1 || parsed.points.length > (mode === "kort" ? 3 : 6)) return null;
  if (parsed.limitations.trim().length < 12 || parsed.limitations.length > 750) return null;
  const labels = {
    definisjon: "Definisjon",
    observasjon: "Observasjon",
    fortolkning: "Fortolkning",
    anbefaling: "Praktisk anbefaling"
  };
  const used = new Set();
  const chunks = [];
  for (const point of parsed.points) {
    if (!point || !(point.kind in labels) || typeof point.text !== "string"
      || point.text.trim().length < 16 || point.text.length > 800
      || !Array.isArray(point.source_ids) || point.source_ids.length < 1 || point.source_ids.length > 3) return null;
    if (/https?:\/\//i.test(point.text) || /\[\d+\]/.test(point.text)) return null;
    const ids = [...new Set(point.source_ids)];
    if (!ids.every(n => Number.isInteger(n) && n > 0 && n <= availableSources.length)) return null;
    ids.forEach(n => used.add(n));
    chunks.push(labels[point.kind] + ": " + point.text.trim() + " " + ids.map(n => "[" + n + "]").join(" "));
  }
  if (/https?:\/\//i.test(parsed.limitations)) return null;
  const answer = chunks.join("\n\n") + "\n\nBegrensninger: " + parsed.limitations.trim();
  if (answer.split(/\s+/).length > (mode === "kort" ? 170 : 390)) return null;
  return { status: "answer", answer, cited: [...used].sort((a, b) => a - b) };
}
