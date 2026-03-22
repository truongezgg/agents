export const DEFAULT_MODEL = "gemini-3-flash";

export function normalizeModel(model) {
  const trimmed = typeof model === "string" ? model.trim() : "";

  if (!trimmed) {
    return DEFAULT_MODEL;
  }

  const previewIndex = trimmed.indexOf("-preview");
  if (previewIndex === -1) {
    return trimmed;
  }

  return trimmed.slice(0, previewIndex) || DEFAULT_MODEL;
}
