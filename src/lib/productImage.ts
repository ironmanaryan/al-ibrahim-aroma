/**
 * Product photography.
 *
 * Every product owns three unique photographs: the flacon, the raw material it
 * is built around, and a close detail of the composition. No image file is used
 * by two different products, and no frame repeats inside one gallery.
 * All photography is licensed stock from Pexels.
 */

type Frames = {
  /** The bottle — the card, cart and thumbnail image. */
  primary: string;
  /** The raw material the scent is built on. */
  material: string;
  /** A close detail / textural frame for the third gallery slide. */
  detail: string;
  materialLabel: string;
  detailLabel: string;
};

const base = "/images/products";

const FRAMES: Record<string, Frames> = {
  "oud-al-malik": {
    primary: `${base}/oud-al-malik.jpg`,
    material: `${base}/oud-al-malik-material.jpg`,
    detail: `${base}/oud-al-malik-detail.jpg`,
    materialLabel: "Agarwood",
    detailLabel: "Cardamom",
  },
  "rose-taifi": {
    primary: `${base}/rose-taifi.jpg`,
    material: `${base}/rose-taifi-material.jpg`,
    detail: `${base}/rose-taifi-detail.jpg`,
    materialLabel: "Taifi rose",
    detailLabel: "Rose at dusk",
  },
  mitti: {
    primary: `${base}/mitti.jpg`,
    material: `${base}/mitti-material.jpg`,
    detail: `${base}/mitti-detail.jpg`,
    materialLabel: "Baked earth",
    detailLabel: "House spices",
  },
  "amber-noor": {
    primary: `${base}/amber-noor.jpg`,
    material: `${base}/amber-noor-material.jpg`,
    detail: `${base}/amber-noor-detail.jpg`,
    materialLabel: "Resin",
    detailLabel: "Pressed petals",
  },
  "musk-al-haram": {
    primary: `${base}/musk-al-haram.jpg`,
    material: `${base}/musk-al-haram-material.jpg`,
    detail: `${base}/musk-al-haram-detail.jpg`,
    materialLabel: "White bloom",
    detailLabel: "Soft petal",
  },
  "vetiver-monsoon": {
    primary: `${base}/vetiver-monsoon.jpg`,
    material: `${base}/vetiver-monsoon-material.jpg`,
    detail: `${base}/vetiver-monsoon-detail.jpg`,
    materialLabel: "Rain on petal",
    detailLabel: "Incense thread",
  },
  "saffron-oudh": {
    primary: `${base}/saffron-oudh.jpg`,
    material: `${base}/saffron-oudh-material.jpg`,
    detail: `${base}/saffron-oudh-detail.jpg`,
    materialLabel: "Kashmiri saffron",
    detailLabel: "The spice house",
  },
  "jasmine-zafran": {
    primary: `${base}/jasmine-zafran.jpg`,
    material: `${base}/jasmine-zafran-material.jpg`,
    detail: `${base}/jasmine-zafran-detail.jpg`,
    materialLabel: "Night jasmine",
    detailLabel: "Violet dusk",
  },
  "bakhoor-royale": {
    primary: `${base}/bakhoor-royale.jpg`,
    material: `${base}/bakhoor-royale-material.jpg`,
    detail: `${base}/bakhoor-royale-detail.jpg`,
    materialLabel: "Burning bakhoor",
    detailLabel: "A single rose",
  },
  "oud-room-mist": {
    primary: `${base}/oud-room-mist.jpg`,
    material: `${base}/oud-room-mist-material.jpg`,
    detail: `${base}/oud-room-mist-detail.jpg`,
    materialLabel: "Smoke",
    detailLabel: "Drifting veil",
  },
  "the-gilded-coffret": {
    primary: `${base}/the-gilded-coffret.jpg`,
    material: `${base}/the-gilded-coffret-material.jpg`,
    detail: `${base}/the-gilded-coffret-detail.jpg`,
    materialLabel: "The spice tray",
    detailLabel: "Cinnamon",
  },
  "the-discovery-set": {
    primary: `${base}/the-discovery-set.jpg`,
    material: `${base}/the-discovery-set-material.jpg`,
    detail: `${base}/the-discovery-set-detail.jpg`,
    materialLabel: "Clove bud",
    detailLabel: "The tray",
  },
  "white-musk": {
    primary: `${base}/white-musk.jpg`,
    material: `${base}/white-musk-material.jpg`,
    detail: `${base}/white-musk-detail.jpg`,
    materialLabel: "Cream rose",
    detailLabel: "Powder white",
  },
  "night-bloom": {
    primary: `${base}/night-bloom.jpg`,
    material: `${base}/night-bloom-material.jpg`,
    detail: `${base}/night-bloom-detail.jpg`,
    materialLabel: "Burgundy rose",
    detailLabel: "Scattered petals",
  },
  "cambodian-oud": {
    primary: `${base}/cambodian-oud.jpg`,
    material: `${base}/cambodian-oud-material.jpg`,
    detail: `${base}/cambodian-oud-detail.jpg`,
    materialLabel: "Cambodian resin",
    detailLabel: "Scent trail",
  },
  "indian-oud": {
    primary: `${base}/indian-oud.jpg`,
    material: `${base}/indian-oud-material.jpg`,
    detail: `${base}/indian-oud-detail.jpg`,
    materialLabel: "Assam rose",
    detailLabel: "Violet leaf",
  },
  "laotian-oud": {
    primary: `${base}/laotian-oud.jpg`,
    material: `${base}/laotian-oud-material.jpg`,
    detail: `${base}/laotian-oud-detail.jpg`,
    materialLabel: "Saffron threads",
    detailLabel: "Smoke ring",
  },
  "burmese-oud": {
    primary: `${base}/burmese-oud.jpg`,
    material: `${base}/burmese-oud-material.jpg`,
    detail: `${base}/burmese-oud-detail.jpg`,
    materialLabel: "Smoke",
    detailLabel: "Low flame",
  },
  "malaysian-oud": {
    primary: `${base}/malaysian-oud.jpg`,
    material: `${base}/malaysian-oud-material.jpg`,
    detail: `${base}/malaysian-oud-detail.jpg`,
    materialLabel: "Rose carpet",
    detailLabel: "Trail",
  },
  "oud-library": {
    primary: `${base}/oud-library.jpg`,
    material: `${base}/oud-library-material.jpg`,
    detail: `${base}/oud-library-detail.jpg`,
    materialLabel: "Saffron garden",
    detailLabel: "The collection",
  },
};

const FALLBACK: Frames = {
  primary: "/images/atelier-night.jpg",
  material: "/images/atelier-cream.jpg",
  detail: "/images/atelier-gold.jpg",
  materialLabel: "The material",
  detailLabel: "The house",
};

function frames(slug: string): Frames {
  return FRAMES[slug] ?? FALLBACK;
}

export function productImage(slug: string, _family?: string): string {
  return frames(slug).primary;
}

/** Three gallery frames for the product page — all unique to this product. */
export function productGallery(slug: string, _family?: string): { src: string; label: string }[] {
  const f = frames(slug);
  return [
    { src: f.primary, label: "The flacon" },
    { src: f.material, label: f.materialLabel },
    { src: f.detail, label: f.detailLabel },
  ];
}
