/**
 * Product photography.
 *
 * The house shoots its flacons, but this build ships with editorial photography rather than
 * invented packshots. Each composition is paired with a real photograph that matches its
 * family — rose, oud, amber, musk — and every card uses it consistently.
 */

const FAMILY_IMAGES: Record<string, string[]> = {
  Oud: ["/images/atelier-gold.jpg", "/images/dark-texture.jpg"],
  Floral: ["/images/roses-night.jpg", "/images/petals.jpg", "/images/rose-still.jpg"],
  Fresh: ["/images/dark-texture.jpg", "/images/bouquet-dark.jpg"],
  Amber: ["/images/atelier-gold.jpg", "/images/dried-roses.jpg"],
  Musk: ["/images/dried-roses.jpg", "/images/rose-still.jpg"],
  Woody: ["/images/bouquet-dark.jpg", "/images/dark-texture.jpg"],
  Home: ["/images/bouquet-dark.jpg", "/images/dark-texture.jpg"],
  Gifting: ["/images/dried-roses.jpg", "/images/petals.jpg"],
  Discovery: ["/images/petals.jpg", "/images/bouquet-dark.jpg"],
};

const BY_SLUG: Record<string, string> = {
  "oud-al-malik": "/images/atelier-gold.jpg",
  "rose-taifi": "/images/roses-night.jpg",
  mitti: "/images/dark-texture.jpg",
  "amber-noor": "/images/atelier-gold.jpg",
  "musk-al-haram": "/images/dried-roses.jpg",
  "vetiver-monsoon": "/images/bouquet-dark.jpg",
  "saffron-oudh": "/images/petals.jpg",
  "jasmine-zafran": "/images/rose-still.jpg",
  "bakhoor-royale": "/images/dark-texture.jpg",
  "oud-room-mist": "/images/bouquet-dark.jpg",
  "the-gilded-coffret": "/images/dried-roses.jpg",
  "the-discovery-set": "/images/petals.jpg",
  "white-musk": "/images/dried-roses.jpg",
  "night-bloom": "/images/bouquet-dark.jpg",
  "cambodian-oud": "/images/atelier-gold.jpg",
  "indian-oud": "/images/dark-texture.jpg",
  "laotian-oud": "/images/atelier-gold.jpg",
  "burmese-oud": "/images/dark-texture.jpg",
  "malaysian-oud": "/images/atelier-gold.jpg",
  "oud-library": "/images/dark-texture.jpg",
};

function hash(input: string): number {
  let n = 0;
  for (let i = 0; i < input.length; i += 1) n = (n * 31 + input.charCodeAt(i)) >>> 0;
  return n;
}

export function productImage(slug: string, family?: string): string {
  if (BY_SLUG[slug]) return BY_SLUG[slug];
  const pool = (family && FAMILY_IMAGES[family]) || FAMILY_IMAGES.Oud;
  return pool[hash(slug) % pool.length];
}

/** Three gallery frames for the product page: the scent, its material, the house. */
export function productGallery(slug: string, family?: string): { src: string; label: string }[] {
  const primary = productImage(slug, family);
  const pool = Object.values(FAMILY_IMAGES).flat();
  const secondary = pool[(hash(slug) + 3) % pool.length];
  const third = "/images/atelier-gold.jpg";
  const slides = [
    { src: primary, label: "The composition" },
    { src: secondary === primary ? "/images/petals.jpg" : secondary, label: "The material" },
    { src: third === primary ? "/images/dried-roses.jpg" : third, label: "The house" },
  ];
  return slides;
}
