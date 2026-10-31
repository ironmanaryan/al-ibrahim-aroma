/**
 * Palette migration v5 — remaps legacy gold/green bottle tints and collection
 * accents to the black / crimson / off-white system.
 */
const ART_MAP: Record<string, string> = {
  "#8a5a1f": "#8b0d1a",
  "#9c4a44": "#a3111f",
  "#6d6a4a": "#8f8577",
  "#c9a24a": "#a3111f",
  "#b07b2e": "#8b0d1a",
  "#6a2f4a": "#6d0a14",
  "#5b3a18": "#8b0d1a",
  "#4a2c14": "#5d0810",
  "#3f4a2a": "#6b655c",
  "#5a2a12": "#6d0a14",
  "#44523a": "#8f8577",
  "#6b4a22": "#8b0d1a",
  "#12100d": "#0b0b0b",
  "#efe3cd": "#f5f2ed",
  "#1e2b23": "#0b0b0b",
  "#d9c9a3": "#d9a7aa",
  "#6b7a52": "#8f8577",
  "#7a3d1b": "#6d0a14",
  "#4a1f1a": "#5d0810",
  "#3b2a1c": "#0b0b0b",
  "#7d6b4f": "#8f8577",
  "#e0d3b8": "#f5f2ed",
  "#e5c690": "#f5f2ed",
  "#c8a96a": "#f5f2ed",
  "#d4af6a": "#f5f2ed",
  "#b98a3e": "#8b0d1a",
  "#e7d3a3": "#f5f2ed",
  "#f0d8a8": "#f5f2ed",
};

function remapColor(value: string): string {
  return ART_MAP[value?.toLowerCase?.() ?? value] ?? value;
}

export function remapPaletteV5(db: import("./types").DB): void {
  for (const product of db.products ?? []) {
    if (product.art) {
      product.art.liquid = remapColor(product.art.liquid);
      product.art.label = remapColor(product.art.label);
    }
  }
  for (const collection of db.collections ?? []) {
    collection.accent = remapColor(collection.accent);
  }
}
