/**
 * Product photography.
 *
 * Every composition in the house carries its own photograph — no image is used
 * for two different products. Primary frames live in /images/products/<slug>.jpg,
 * with a second "material" frame and a shared pair of atelier shots for the
 * gallery. All photography is licensed stock (Pexels) / brand material.
 */

const PRIMARY: Record<string, string> = {
  "oud-al-malik": "/images/products/oud-al-malik.jpg",
  "rose-taifi": "/images/products/rose-taifi.jpg",
  mitti: "/images/products/mitti.jpg",
  "amber-noor": "/images/products/amber-noor.jpg",
  "musk-al-haram": "/images/products/musk-al-haram.jpg",
  "vetiver-monsoon": "/images/products/vetiver-monsoon.jpg",
  "saffron-oudh": "/images/products/saffron-oudh.jpg",
  "jasmine-zafran": "/images/products/jasmine-zafran.jpg",
  "bakhoor-royale": "/images/products/bakhoor-royale.jpg",
  "oud-room-mist": "/images/products/oud-room-mist.jpg",
  "the-gilded-coffret": "/images/products/the-gilded-coffret.jpg",
  "the-discovery-set": "/images/products/the-discovery-set.jpg",
  "white-musk": "/images/products/white-musk.jpg",
  "night-bloom": "/images/products/night-bloom.jpg",
  "cambodian-oud": "/images/products/cambodian-oud.jpg",
  "indian-oud": "/images/products/indian-oud.jpg",
  "laotian-oud": "/images/products/laotian-oud.jpg",
  "burmese-oud": "/images/products/burmese-oud.jpg",
  "malaysian-oud": "/images/products/malaysian-oud.jpg",
  "oud-library": "/images/products/oud-library.jpg",
};

const MATERIAL: Record<string, string> = {
  "oud-al-malik": "/images/products/oud-al-malik-material.jpg",
  "rose-taifi": "/images/products/rose-taifi-material.jpg",
  mitti: "/images/products/mitti-material.jpg",
  "amber-noor": "/images/products/amber-noor-material.jpg",
  "musk-al-haram": "/images/products/musk-al-haram-material.jpg",
  "vetiver-monsoon": "/images/products/vetiver-monsoon-material.jpg",
  "saffron-oudh": "/images/products/saffron-oudh-material.jpg",
  "jasmine-zafran": "/images/products/jasmine-zafran-material.jpg",
  "bakhoor-royale": "/images/products/bakhoor-royale-material.jpg",
  "oud-room-mist": "/images/products/oud-room-mist-material.jpg",
  "the-gilded-coffret": "/images/products/the-gilded-coffret-material.jpg",
  "the-discovery-set": "/images/products/the-discovery-set-material.jpg",
  "white-musk": "/images/products/white-musk-material.jpg",
  "night-bloom": "/images/products/night-bloom-material.jpg",
  "cambodian-oud": "/images/products/cambodian-oud-material.jpg",
  "indian-oud": "/images/products/indian-oud-material.jpg",
  "laotian-oud": "/images/products/laotian-oud-material.jpg",
  "burmese-oud": "/images/products/burmese-oud-material.jpg",
  "malaysian-oud": "/images/products/malaysian-oud-material.jpg",
  "oud-library": "/images/products/oud-library-material.jpg",
};

/** Editorial atelier shots used as the closing frame of each gallery. */
const HOUSE = ["/images/atelier-night.jpg", "/images/atelier-cream.jpg"];

const POOL = Object.values(PRIMARY);
const MATERIAL_POOL = Object.values(MATERIAL);

function hash(input: string): number {
  let n = 0;
  for (let i = 0; i < input.length; i += 1) n = (n * 31 + input.charCodeAt(i)) >>> 0;
  return n;
}

export function productImage(slug: string, _family?: string): string {
  if (PRIMARY[slug]) return PRIMARY[slug];
  return POOL[hash(slug) % POOL.length];
}

/** Three gallery frames for the product page: the scent, its material, the house. */
export function productGallery(slug: string, _family?: string): { src: string; label: string }[] {
  const primary = productImage(slug);
  const material = MATERIAL[slug] ?? MATERIAL_POOL[hash(slug) % MATERIAL_POOL.length];
  const house = HOUSE[hash(slug) % HOUSE.length];
  return [
    { src: primary, label: "The composition" },
    { src: material, label: "The material" },
    { src: house, label: "The house" },
  ];
}
