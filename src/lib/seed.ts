import type { Collection, DB, Faq, JournalPost, Product, TeamMember, Testimonial } from "./types";

const now = new Date("2026-10-01T10:00:00.000Z").toISOString();

const products: Product[] = [
  {
    id: "p_oud_malik",
    slug: "oud-al-malik",
    name: "Oud Al Malik",
    subtitle: "Cambodian oud, rose absolute, smoked amber",
    category: "Perfume",
    family: "Oud",
    price: 3450,
    compareAt: 4200,
    sizes: [
      { ml: 50, price: 3450, compareAt: 4200 },
      { ml: 9, price: 890 },
    ],
    notes: {
      top: ["Bergamot", "Pink Pepper", "Saffron"],
      heart: ["Cambodian Oud", "Rose Absolute", "Incense"],
      base: ["Smoked Amber", "Sandalwood", "Leather"],
    },
    description:
      "A royal oud composed the slow way — aged agarwood folded into rose absolute, then rested for eleven weeks in sandalwood vats. It opens sharp and mineral, softens into rose and incense, and leaves a warm, lived-in trail of amber and leather.",
    story:
      "Oud Al Malik began as a private blend for a family wedding in Lucknow. The brief was simple: a scent that could be recognised across a courtyard without ever announcing itself. We built it around a single kilo of 1998 Cambodian oud, and it has never been made in batches larger than sixty bottles.",
    intensity: 5,
    longevity: "10–12 hours",
    sillage: "Heavy",
    rating: 4.9,
    reviewCount: 214,
    stock: 38,
    badge: "Signature",
    featured: true,
    bestseller: true,
    published: true,
    art: { variant: "flacon", liquid: "#8a5a1f", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_rose_taifi",
    slug: "rose-taifi",
    name: "Rose Taifi",
    subtitle: "Taif rose, honeyed saffron, white musk",
    category: "Attar",
    family: "Floral",
    price: 1890,
    sizes: [
      { ml: 12, price: 1890 },
      { ml: 3, price: 690 },
    ],
    notes: {
      top: ["Taif Rose", "Litchi", "Green Stem"],
      heart: ["Rose Absolute", "Saffron", "Honey"],
      base: ["White Musk", "Cashmere Wood"],
    },
    description:
      "Forty thousand hand-picked Taif roses go into a single kilo of this attar. It is rose in full bloom — dewy at first, honeyed at the centre, and quietly musky on the skin hours later.",
    story:
      "Our rose arrives by air from the Taif valley each April, packed in muslin and distilled within forty-eight hours of picking. Nothing is added to stretch it. What you smell is the harvest, nothing else.",
    intensity: 4,
    longevity: "8–10 hours",
    sillage: "Moderate",
    rating: 4.8,
    reviewCount: 176,
    stock: 64,
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    published: true,
    art: { variant: "attar", liquid: "#9c4a44", label: "#efe3cd", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_mitti",
    slug: "mitti",
    name: "Mitti",
    subtitle: "Petrichor, wet clay, vetiver root",
    category: "Attar",
    family: "Fresh",
    price: 1490,
    sizes: [
      { ml: 12, price: 1490 },
      { ml: 3, price: 540 },
    ],
    notes: {
      top: ["First Rain", "Wet Stone", "Green Cardamom"],
      heart: ["Baked Clay", "Vetiver Root", "Moss"],
      base: ["Cedar", "Soft Musk"],
    },
    description:
      "The scent of the first monsoon on sun-baked earth, captured through the traditional deg-and-bhapka distillation of clay. Familiar, grounding, and impossible to place until you smell it again.",
    story:
      "Mitti can only be distilled in the dry months, when the clay holds no moisture and the petrichor blooms cleanly. Each batch takes close to a month. We refuse to add aroma molecules to extend its life — the honesty of the scent matters more than its projection.",
    intensity: 3,
    longevity: "5–6 hours",
    sillage: "Intimate",
    rating: 4.9,
    reviewCount: 302,
    stock: 21,
    badge: "House Favourite",
    featured: true,
    bestseller: true,
    published: true,
    art: { variant: "attar", liquid: "#6d6a4a", label: "#1e2b23", cap: "wood" },
    createdAt: now,
  },
  {
    id: "p_amber_noor",
    slug: "amber-noor",
    name: "Amber Noor",
    subtitle: "Labdanum, vanilla bourbon, golden benzoin",
    category: "Perfume",
    family: "Amber",
    price: 2950,
    sizes: [
      { ml: 50, price: 2950 },
      { ml: 9, price: 790 },
    ],
    notes: {
      top: ["Bitter Orange", "Cinnamon Bark"],
      heart: ["Labdanum", "Benzoin", "Immortelle"],
      base: ["Vanilla Bourbon", "Tonka", "Ambergris"],
    },
    description:
      "A lit candle in a dark room. Amber Noor wraps labdanum and benzoin around a vanilla heart that never turns sweet — it stays resinous, golden, and quietly luminous for hours.",
    story:
      "Built for the winter weddings of Awadh, where attar is offered on the wrist before the guests arrive. We wanted a scent that felt like warmth rather than sugar, and it took fourteen trials to find the balance.",
    intensity: 4,
    longevity: "9–11 hours",
    sillage: "Strong",
    rating: 4.7,
    reviewCount: 143,
    stock: 52,
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "flacon", liquid: "#b07b2e", label: "#efe3cd", cap: "black" },
    createdAt: now,
  },
  {
    id: "p_musk_haram",
    slug: "musk-al-haram",
    name: "Musk Al Haram",
    subtitle: "White musk, orris, powdered amber",
    category: "Attar",
    family: "Musk",
    price: 1290,
    sizes: [{ ml: 12, price: 1290 }],
    notes: {
      top: ["Orris Butter", "Aldehydes"],
      heart: ["White Musk", "Iris", "Cotton Flower"],
      base: ["Powdered Amber", "Sandalwood"],
    },
    description:
      "Clean, quiet, and endlessly wearable. A musk that smells like sun-warmed linen and skin — the kind of scent people lean in to notice.",
    story:
      "The first attar our founder bottled under the Al Ibrahim name, in 1974. The formula has not changed; only the label has.",
    intensity: 2,
    longevity: "6–8 hours",
    sillage: "Intimate",
    rating: 4.8,
    reviewCount: 261,
    stock: 87,
    badge: "Since 1974",
    featured: false,
    bestseller: true,
    published: true,
    art: { variant: "attar", liquid: "#d9c9a3", label: "#efe3cd", cap: "ivory" },
    createdAt: now,
  },
  {
    id: "p_vetiver_monsoon",
    slug: "vetiver-monsoon",
    name: "Vetiver Monsoon",
    subtitle: "Haitian vetiver, wet fern, black tea",
    category: "Perfume",
    family: "Woody",
    price: 2750,
    sizes: [
      { ml: 50, price: 2750 },
      { ml: 9, price: 750 },
    ],
    notes: {
      top: ["Grapefruit Peel", "Rain Accord"],
      heart: ["Haitian Vetiver", "Fern", "Black Tea"],
      base: ["Oakmoss", "Cedar", "Grey Amber"],
    },
    description:
      "Vetiver pulled in two directions — bright and mineral at the top, earthy and smoky underneath. A green fragrance for people who do not usually wear green.",
    story:
      "Composed after a week in the Western Ghats during the monsoon, when the air is thick enough to drink. We distilled the vetiver roots on site and carried the oil home in glass.",
    intensity: 3,
    longevity: "7–9 hours",
    sillage: "Moderate",
    rating: 4.6,
    reviewCount: 98,
    stock: 44,
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "flacon", liquid: "#6b7a52", label: "#12100d", cap: "wood" },
    createdAt: now,
  },
  {
    id: "p_saffron_oudh",
    slug: "saffron-oudh",
    name: "Saffron Oudh",
    subtitle: "Kashmiri saffron, oud, dried fig",
    category: "Perfume",
    family: "Oud",
    price: 3850,
    sizes: [
      { ml: 50, price: 3850 },
      { ml: 9, price: 950 },
    ],
    notes: {
      top: ["Kashmiri Saffron", "Dried Fig", "Clove"],
      heart: ["Laotian Oud", "Rose", "Cinnamon"],
      base: ["Amber Resin", "Patchouli", "Vetiver"],
    },
    description:
      "Saffron threads steeped in oud — leathery, spiced, and faintly sweet. A winter scent with a long memory.",
    story:
      "Made once a year, when the saffron harvest arrives from Pampore. The infusion alone takes twenty-one days.",
    intensity: 5,
    longevity: "11–14 hours",
    sillage: "Heavy",
    rating: 4.9,
    reviewCount: 87,
    stock: 19,
    badge: "Limited",
    featured: false,
    bestseller: false,
    published: true,
    art: { variant: "flacon", liquid: "#7a3d1b", label: "#4a1f1a", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_jasmine_zafran",
    slug: "jasmine-zafran",
    name: "Jasmine Zafran",
    subtitle: "Night jasmine, saffron, warm sandal",
    category: "Attar",
    family: "Floral",
    price: 1650,
    sizes: [
      { ml: 12, price: 1650 },
      { ml: 3, price: 590 },
    ],
    notes: {
      top: ["Night Jasmine", "Neroli"],
      heart: ["Saffron", "Tuberose", "Orange Blossom"],
      base: ["Sandalwood", "Benzoin"],
    },
    description:
      "Jasmine picked before sunrise, when the flower is still cool. Heavy, heady, and softened by sandalwood so it sits close to the skin instead of shouting.",
    story:
      "Our jasmine comes from a single walled garden outside Kannauj, tended by the same family for three generations.",
    intensity: 4,
    longevity: "8–10 hours",
    sillage: "Strong",
    rating: 4.7,
    reviewCount: 121,
    stock: 58,
    featured: false,
    bestseller: true,
    published: true,
    art: { variant: "attar", liquid: "#c9a24a", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_bakhoor_royale",
    slug: "bakhoor-royale",
    name: "Bakhoor Royale",
    subtitle: "Oud chips, rose water, frankincense",
    category: "Home",
    family: "Oud",
    price: 1250,
    sizes: [{ ml: 200, price: 1250 }],
    notes: {
      top: ["Frankincense", "Rose Water"],
      heart: ["Oud Chips", "Sandalwood Dust"],
      base: ["Amber", "Vanilla Husk"],
    },
    description:
      "Hand-soaked bakhoor chips, dried in the sun and packed in a sealed brass tin. One piece scents a room for an evening.",
    story:
      "The blend our grandmother burned on Fridays. We still soak the chips in rose water for three days before drying them.",
    intensity: 5,
    longevity: "Room-filling",
    sillage: "Heavy",
    rating: 4.8,
    reviewCount: 74,
    stock: 96,
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "diffuser", liquid: "#3b2a1c", label: "#efe3cd", cap: "wood" },
    createdAt: now,
  },
  {
    id: "p_oud_room_mist",
    slug: "oud-room-mist",
    name: "Oud Room Mist",
    subtitle: "Oud, cedar, a whisper of rose",
    category: "Home",
    family: "Woody",
    price: 890,
    sizes: [{ ml: 100, price: 890 }],
    notes: {
      top: ["Cedar Leaf", "Bergamot"],
      heart: ["Oud", "Rose"],
      base: ["Amber", "Musk"],
    },
    description:
      "A fine, waterless mist for linen, curtains, and the corners of a room you want to feel warmer. No alcohol sting, no synthetic sweetness.",
    story:
      "Created for our own atelier, where the air between distillations needed something gentle. Now it is the most reordered thing we make.",
    intensity: 3,
    longevity: "4–6 hours",
    sillage: "Moderate",
    rating: 4.5,
    reviewCount: 63,
    stock: 120,
    featured: false,
    bestseller: true,
    published: true,
    art: { variant: "diffuser", liquid: "#7d6b4f", label: "#1e2b23", cap: "black" },
    createdAt: now,
  },
  {
    id: "p_gilded_coffret",
    slug: "the-gilded-coffret",
    name: "The Gilded Coffret",
    subtitle: "Two 9ml parfums, hand-wrapped",
    category: "Gifting",
    family: "Amber",
    price: 2490,
    compareAt: 2980,
    sizes: [{ ml: 18, price: 2490, compareAt: 2980 }],
    notes: {
      top: ["Choose your pair"],
      heart: ["Oud Al Malik", "Amber Noor", "Rose Taifi"],
      base: ["Handwritten note included"],
    },
    description:
      "A black-and-gold coffret holding two 9ml parfums of your choosing, wrapped in khadi and finished with a wax seal. Made for weddings, Eid, and the people who are hard to buy for.",
    story:
      "Every coffret is packed by hand in our Lucknow atelier, usually by the same two people who blended the perfume inside it.",
    intensity: 4,
    longevity: "Varies by scent",
    sillage: "Varies",
    rating: 4.9,
    reviewCount: 58,
    stock: 34,
    badge: "Gift Ready",
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "coffret", liquid: "#b07b2e", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_discovery_set",
    slug: "the-discovery-set",
    name: "The Discovery Set",
    subtitle: "Five 2ml vials, one house",
    category: "Discovery",
    family: "Fresh",
    price: 950,
    sizes: [{ ml: 10, price: 950 }],
    notes: {
      top: ["Oud Al Malik", "Mitti", "Rose Taifi"],
      heart: ["Musk Al Haram", "Amber Noor"],
      base: ["Redeemable against your first full bottle"],
    },
    description:
      "Five of our most-loved compositions in 2ml spray vials, with a card that tells you what to notice in each. The cost is credited back on your first full-size order.",
    story:
      "We would rather you try five scents properly than buy one blind. That has been the rule since the shop opened.",
    intensity: 3,
    longevity: "2–3 wears each",
    sillage: "Varies",
    rating: 4.8,
    reviewCount: 189,
    stock: 150,
    badge: "Try First",
    featured: true,
    bestseller: true,
    published: true,
    art: { variant: "vial", liquid: "#c9a24a", label: "#efe3cd", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_white_musk",
    slug: "white-musk",
    name: "White Musk",
    subtitle: "Clean musk, iris, sunlit cotton",
    category: "Perfume",
    family: "Musk",
    price: 2450,
    sizes: [
      { ml: 50, price: 2450 },
      { ml: 9, price: 690 },
    ],
    notes: {
      top: ["Pear", "Aldehydes"],
      heart: ["Iris", "White Musk", "Lily"],
      base: ["Cashmeran", "Cedar"],
    },
    description:
      "The quietest thing in the collection. A skin scent that reads as freshly laundered rather than perfumed — ideal for offices, flights, and people who dislike being smelled from across the room.",
    story:
      "A reformulation of a 1990s family recipe, modernised without losing its softness.",
    intensity: 2,
    longevity: "6–7 hours",
    sillage: "Intimate",
    rating: 4.6,
    reviewCount: 112,
    stock: 73,
    featured: false,
    bestseller: false,
    published: true,
    art: { variant: "flacon", liquid: "#e0d3b8", label: "#efe3cd", cap: "ivory" },
    createdAt: now,
  },
  {
    id: "p_night_bloom",
    slug: "night-bloom",
    name: "Night Bloom",
    subtitle: "Tuberose, dark plum, vanilla smoke",
    category: "Perfume",
    family: "Floral",
    price: 2990,
    sizes: [
      { ml: 50, price: 2990 },
      { ml: 9, price: 810 },
    ],
    notes: {
      top: ["Dark Plum", "Black Pepper"],
      heart: ["Tuberose", "Jasmine Sambac", "Orris"],
      base: ["Vanilla Smoke", "Patchouli", "Amber"],
    },
    description:
      "Tuberose after dark — creamy, slightly narcotic, anchored by plum and a thread of smoke. Wear it to dinners that run late.",
    story:
      "Our perfumer built this around a single absolute of tuberose from Tamil Nadu, then spent a year learning how little else it needed.",
    intensity: 4,
    longevity: "9–10 hours",
    sillage: "Strong",
    rating: 4.7,
    reviewCount: 66,
    stock: 41,
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "flacon", liquid: "#6a2f4a", label: "#12100d", cap: "black" },
    createdAt: now,
  },
  {
    id: "p_oud_cambodian",
    slug: "cambodian-oud",
    name: "Cambodian Oud",
    subtitle: "Single-origin agarwood · Pursat, Cambodia",
    category: "Attar",
    family: "Oud",
    price: 7500,
    sizes: [
      { ml: 3, price: 7500 },
      { ml: 1, price: 2900 },
    ],
    notes: {
      top: ["Resinous Sap", "Green Bitter Leaf"],
      heart: ["Aged Agarwood", "Honeyed Wood"],
      base: ["Amber", "Soft Smoke"],
    },
    description:
      "A pure, undiluted agarwood oil from a single distillation in Pursat. Sweet resin at the open, then the slow, honeyed woodiness that Cambodian oud is prized for. Nothing is stretched, blended or softened.",
    story:
      "We buy this oil by the tola from a distiller our family has known for three decades. Each batch is rested for a year before bottling so the sharp top notes settle into the wood. Expect a natural variation from harvest to harvest — that is the point.",
    intensity: 5,
    longevity: "12+ hours",
    sillage: "Strong",
    rating: 4.9,
    reviewCount: 41,
    stock: 14,
    badge: "Single Origin",
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "vial", liquid: "#5b3a18", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_oud_indian",
    slug: "indian-oud",
    name: "Indian Oud",
    subtitle: "Single-origin agarwood · Assam, India",
    category: "Attar",
    family: "Oud",
    price: 6500,
    sizes: [
      { ml: 3, price: 6500 },
      { ml: 1, price: 2500 },
    ],
    notes: {
      top: ["Wet Bark", "Cardamom"],
      heart: ["Assam Agarwood", "Leather"],
      base: ["Vetiver", "Earth"],
    },
    description:
      "Assam agarwood distilled the old way: deep, earthy and quietly animalic, with a leathery trail that sits close to the skin. This is the oud of Indian attar houses, not the sweet export style.",
    story:
      "Sourced from a small distillation in upper Assam and aged in glass for eighteen months. It is the oil we reach for when a blend needs weight rather than shine.",
    intensity: 5,
    longevity: "10–12 hours",
    sillage: "Moderate",
    rating: 4.8,
    reviewCount: 33,
    stock: 18,
    badge: "Single Origin",
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "vial", liquid: "#4a2c14", label: "#12100d", cap: "wood" },
    createdAt: now,
  },
  {
    id: "p_oud_laos",
    slug: "laotian-oud",
    name: "Laotian Oud",
    subtitle: "Single-origin agarwood · Laos",
    category: "Attar",
    family: "Oud",
    price: 8900,
    sizes: [
      { ml: 3, price: 8900 },
      { ml: 1, price: 3400 },
    ],
    notes: {
      top: ["Wild Mint", "Green Resin"],
      heart: ["Laotian Agarwood", "Incense"],
      base: ["Sandalwood", "Ambergris"],
    },
    description:
      "Wild Laotian agarwood, cool and incense-like at first, then creamy sandalwood and a mineral ambergris finish. The most meditative oil in the library.",
    story:
      "A rare lot from a single wild harvest, bought at auction and bottled without blending. When this batch is gone, we will wait for the next one rather than substitute it.",
    intensity: 5,
    longevity: "12+ hours",
    sillage: "Moderate",
    rating: 5,
    reviewCount: 19,
    stock: 9,
    badge: "Rare Lot",
    featured: true,
    bestseller: false,
    published: true,
    art: { variant: "vial", liquid: "#3f4a2a", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
  {
    id: "p_oud_burmese",
    slug: "burmese-oud",
    name: "Burmese Oud",
    subtitle: "Single-origin agarwood · Myanmar",
    category: "Attar",
    family: "Oud",
    price: 8400,
    sizes: [
      { ml: 3, price: 8400 },
      { ml: 1, price: 3200 },
    ],
    notes: {
      top: ["Bitter Orange", "Resin"],
      heart: ["Burmese Agarwood", "Dark Honey"],
      base: ["Benzoin", "Smoked Cedar"],
    },
    description:
      "Dense, dark and honeyed — Burmese oud opens with a bitter citrus edge before settling into smoked cedar and benzoin. A winter oil, made for cold rooms and late evenings.",
    story:
      "Distilled from mature wood and aged for two years before it reached us. We bottle it in small runs of twenty-five.",
    intensity: 5,
    longevity: "12+ hours",
    sillage: "Heavy",
    rating: 4.9,
    reviewCount: 27,
    stock: 11,
    badge: "Single Origin",
    featured: false,
    bestseller: false,
    published: true,
    art: { variant: "vial", liquid: "#5a2a12", label: "#12100d", cap: "black" },
    createdAt: now,
  },
  {
    id: "p_oud_malaysian",
    slug: "malaysian-oud",
    name: "Malaysian Oud",
    subtitle: "Single-origin agarwood · Pahang, Malaysia",
    category: "Attar",
    family: "Oud",
    price: 7200,
    sizes: [
      { ml: 3, price: 7200 },
      { ml: 1, price: 2800 },
    ],
    notes: {
      top: ["Rainforest Green", "Pine"],
      heart: ["Malaysian Agarwood", "Tea"],
      base: ["Musk", "Wet Stone"],
    },
    description:
      "Cool, green and almost tea-like — a quieter expression of oud for people who find the Indian and Burmese oils too dense. It blooms on skin after twenty minutes.",
    story:
      "From a Pahang distillery that works only with sustainably farmed wood. We have carried this lot since 2023.",
    intensity: 4,
    longevity: "8–10 hours",
    sillage: "Moderate",
    rating: 4.8,
    reviewCount: 24,
    stock: 22,
    badge: "Single Origin",
    featured: false,
    bestseller: false,
    published: true,
    art: { variant: "vial", liquid: "#44523a", label: "#12100d", cap: "ivory" },
    createdAt: now,
  },
  {
    id: "p_oud_library",
    slug: "oud-library",
    name: "The Oud Library",
    subtitle: "Five single-origin oils · 0.5ml each",
    category: "Discovery",
    family: "Oud",
    price: 3900,
    sizes: [{ ml: 5, price: 3900 }],
    notes: {
      top: ["Cambodian", "Indian"],
      heart: ["Laotian", "Burmese"],
      base: ["Malaysian", "Aged Wood"],
    },
    description:
      "A five-vial library of our single-origin oud oils — Cambodia, India, Laos, Burma and Malaysia — so you can smell the forest rather than the blend. Each vial holds enough for several wearings.",
    story:
      "Built for the customer who asks the right question: what does oud actually smell like? Taste them side by side, then choose the origin that feels like yours.",
    intensity: 5,
    longevity: "12+ hours",
    sillage: "Varies",
    rating: 4.9,
    reviewCount: 58,
    stock: 30,
    badge: "Discovery",
    featured: true,
    bestseller: true,
    published: true,
    art: { variant: "coffret", liquid: "#6b4a22", label: "#12100d", cap: "gold" },
    createdAt: now,
  },
];

const collections: Collection[] = [
  {
    id: "c_oud",
    slug: "oud-amber",
    title: "Oud & Amber",
    kicker: "The royal accord",
    description:
      "Aged agarwood, resin and smoke. The scents of Awadh — built for winter evenings, weddings, and rooms that hold their warmth.",
    filter: { family: "Oud" },
    accent: "#8a5a1f",
    featured: true,
    order: 1,
  },
  {
    id: "c_attar",
    slug: "attar-oils",
    title: "Attar Oils",
    kicker: "Alcohol-free, skin-close",
    description:
      "Traditional deg-and-bhapka attars, pressed from flowers and earth. A single drop on the pulse point lasts the day.",
    filter: { category: "Attar" },
    accent: "#9c4a44",
    featured: true,
    order: 2,
  },
  {
    id: "c_edp",
    slug: "eau-de-parfum",
    title: "Eau de Parfum",
    kicker: "Composed in Lucknow",
    description:
      "Our modern parfums — higher concentration, longer trail, and the same insistence on natural absolutes.",
    filter: { category: "Perfume" },
    accent: "#b07b2e",
    featured: true,
    order: 3,
  },
  {
    id: "c_home",
    slug: "home-ritual",
    title: "Home & Ritual",
    kicker: "Scent the room",
    description:
      "Bakhoor, room mists and diffuser oils for the quiet hours. Small rituals that change how a house feels.",
    filter: { category: "Home" },
    accent: "#3b2a1c",
    featured: true,
    order: 4,
  },
  {
    id: "c_gift",
    slug: "gifting",
    title: "Gifting & Discovery",
    kicker: "Wrap it in khadi",
    description:
      "Coffrets, discovery sets and hand-written notes. For weddings, Eid, and the people who already have everything.",
    filter: { category: "Gifting" },
    accent: "#e5c690",
    featured: true,
    order: 5,
  },
  {
    id: "c_single_oud",
    slug: "single-origin-oud",
    title: "Single-Origin Oud",
    kicker: "One forest, one distillation",
    description:
      "Pure agarwood oils from Cambodia, Assam, Laos, Burma and Malaysia. Undiluted, unblended, and bottled in small lots so you can taste the difference between forests.",
    filter: { family: "Oud" },
    accent: "#5b3a18",
    featured: true,
    order: 6,
  },
];

const journal: JournalPost[] = [
  {
    id: "j_notes",
    slug: "how-to-read-a-fragrance-pyramid",
    title: "How to read a fragrance pyramid",
    excerpt:
      "Top, heart, base — the three-act structure behind every perfume, and why the first ten seconds are the least important part.",
    category: "Guides",
    author: "Ayesha Ibrahim",
    readTime: 6,
    publishedAt: "2026-09-28T09:00:00.000Z",
    published: true,
    body: `Most people choose a perfume in the first ten seconds. That is also why most people own a bottle they stopped reaching for after a week.

A fragrance is not a single smell. It is a sequence.

## The opening
Top notes are the volatile molecules — citrus, green stems, pink pepper, aldehydes. They exist to make a first impression, and they are gone within fifteen minutes. Judge nothing on them alone.

## The heart
What remains after the opening burns off. Rose, jasmine, oud, iris, saffron. This is the actual composition, and it is where a perfumer spends most of their time.

## The base
The long tail: amber, musk, sandalwood, vetiver, leather. These are heavy molecules that evaporate slowly, and they are what people remember about you after you leave the room.

> A good perfume does not smell the same at 9am and 9pm. It tells time.

## How to test properly
Spray on skin, never on paper. Wear it for four hours before deciding. Test one fragrance per arm, and give it a day between trials — your nose fatigues faster than you think.

If you want to skip the guesswork, our Discovery Set exists for exactly this reason.`,
  },
  {
    id: "j_attar",
    slug: "the-quiet-art-of-attar",
    title: "The quiet art of attar",
    excerpt:
      "Why an alcohol-free oil from Kannauj can outlast a designer eau de parfum, and how to wear one properly.",
    category: "Craft",
    author: "Imran Ibrahim",
    readTime: 7,
    publishedAt: "2026-09-14T09:00:00.000Z",
    published: true,
    body: `Attar is older than perfume. It is also, in most of the world, almost forgotten.

The process is called deg-and-bhapka: a copper still (deg) is filled with flowers and water, then sealed with clay and a bamboo pipe (bhapka) that runs into a receiver of sandalwood oil. The fire is controlled by hand. A single distillation can take twelve hours, and yields a few grams of oil.

## Why it smells different
Alcohol carries a fragrance upward and outward. Oil carries it close to the skin. An attar does not project across a room; it waits for someone to come nearer.

That is not a weakness. It is the point.

## How to wear it
One drop on each wrist, one at the base of the throat. Warmth does the rest. Do not rub — friction bruises the top notes.

## Keeping it
Attar improves for the first year and then holds for decades, if kept away from light and heat. A bottle bought at a wedding in 1985 can still be perfect today.

We still distil Mitti and Rose Taifi this way, in small batches, because there is no machine that does it better.`,
  },
  {
    id: "j_gifting",
    slug: "a-guide-to-gifting-fragrance",
    title: "A guide to gifting fragrance",
    excerpt:
      "The safest way to buy scent for someone else — and the three compositions that almost never miss.",
    category: "Journal",
    author: "Ayesha Ibrahim",
    readTime: 4,
    publishedAt: "2026-08-30T09:00:00.000Z",
    published: true,
    body: `Fragrance is an intimate gift. Buying it for someone else is a small act of observation.

## Start with what they already wear
Fresh and citrus? Stay in that family. Floral? Move one step warmer, not five. The worst gifts are the ones that ask the receiver to become a different person.

## When in doubt, go soft
Musk, iris and light amber are the closest thing this industry has to a universal gift. They sit close, offend nobody, and get worn.

## Give the choice instead
A Discovery Set says: I wanted you to find your own. It is also the only fragrance gift that cannot be wrong.

> Our coffret can hold any two 9ml parfums. If you know one scent they love, pair it with one they have never tried.

## The note matters
A handwritten line beats a printed card every time. We include one with every coffret, and we will write it for you if you tell us what to say.`,
  },
  {
    id: "j_layering",
    slug: "layering-without-making-a-mess",
    title: "Layering without making a mess",
    excerpt:
      "Three pairings from our own atelier, and the one rule that keeps layering from turning muddy.",
    category: "Guides",
    author: "Imran Ibrahim",
    readTime: 5,
    publishedAt: "2026-08-12T09:00:00.000Z",
    published: true,
    body: `Layering is not mixing. It is stacking, in order, with restraint.

## The rule
Put the lighter scent underneath and the heavier scent on top. Never the reverse — the heavy molecules will smother everything above them.

## Three pairings we wear
**Mitti + White Musk.** Wet earth softened with clean musk. The most complimented combination in the shop.

**Rose Taifi + Oud Al Malik.** Rose first, oud over the top. A classic for a reason, and the reason is weddings.

**Amber Noor + Oud Room Mist.** One spray of amber on the wrist, one mist across the shoulders. Do not do this indoors in summer.

## The mistake
More than two fragrances is a crowd. If you cannot describe the combination in a sentence, it is probably too much.`,
  },
  {
    id: "j_harvest",
    slug: "forty-thousand-roses",
    title: "Forty thousand roses",
    excerpt:
      "A morning in the Taif valley, where the roses that go into our attar are picked before the sun clears the ridge.",
    category: "Craft",
    author: "Ayesha Ibrahim",
    readTime: 8,
    publishedAt: "2026-07-22T09:00:00.000Z",
    published: true,
    body: `The roses are picked between four and seven in the morning, while the dew is still on them. After seven, the sun opens the petals fully and the oil begins to change.

Forty thousand flowers make one kilo of rose absolute. A good picker manages eight thousand in a morning.

## The journey
The muslin sacks are driven to the distillery within the hour. Nothing is refrigerated; nothing waits overnight. By the afternoon, the first oil is already separating.

## What we pay for
Not the cheapest harvest. The one picked at the right hour, by people who have done it their whole lives.

That is the entire difference between rose that smells like a flower and rose that smells like a candle.`,
  },
  {
    id: "j_firstbottle",
    slug: "your-first-signature-scent",
    title: "Your first signature scent",
    excerpt:
      "A short, unsentimental method for finding the one fragrance you will actually finish.",
    category: "Guides",
    author: "Imran Ibrahim",
    readTime: 5,
    publishedAt: "2026-06-30T09:00:00.000Z",
    published: true,
    body: `Ignore trends, seasons and whatever an algorithm showed you this week.

## Step one: notice
For one week, write down every smell you stop for — a soap, a wood fire, the inside of a bakery. Patterns appear quickly.

## Step two: narrow
Bring those notes to a family. Smoke and resin point to amber and oud. Cut grass and rain point to vetiver and moss. Clean skin points to musk.

## Step three: wear
Order samples, not bottles. Wear each for three full days, including one day you are tired and one day you are dressed up.

## Step four: commit
The right scent is the one you reach for without thinking. It will not be the most exciting thing you smell. It will be the most like you.`,
  },
];

const testimonials: Testimonial[] = [
  {
    id: "t_1",
    name: "Pranay Mehrotra",
    city: "Lucknow",
    rating: 5,
    quote:
      "I grew up around attar and I am extremely fussy. Mitti is the first thing in years that smells like actual rain on actual clay — not a candle pretending to be rain.",
    product: "Mitti",
    featured: true,
  },
  {
    id: "t_2",
    name: "Siya Kapoor",
    city: "Mumbai",
    rating: 5,
    quote:
      "Oud Al Malik got me stopped three times at a wedding. It is rich without being loud, which is a very hard thing to find.",
    product: "Oud Al Malik",
    featured: true,
  },
  {
    id: "t_3",
    name: "Ayan Sheikh",
    city: "Hyderabad",
    rating: 5,
    quote:
      "The coffret arrived wrapped in khadi with a handwritten note. My mother-in-law has kept the box on her dressing table. The perfume is excellent; the care is why I reordered.",
    product: "The Gilded Coffret",
    featured: true,
  },
  {
    id: "t_4",
    name: "Simran Kaur",
    city: "Howrah",
    rating: 5,
    quote:
      "Rose Taifi replaced a very expensive French bottle for me. It is more honest — you can smell the flower, not the marketing.",
    product: "Rose Taifi",
    featured: true,
  },
  {
    id: "t_5",
    name: "Kapil Gupta",
    city: "Delhi",
    rating: 4,
    quote:
      "Ordered the Discovery Set for my wife and ended up buying two full bottles within a fortnight. The 2ml vials last far longer than they should.",
    product: "The Discovery Set",
    featured: true,
  },
  {
    id: "t_6",
    name: "Milauni Rao",
    city: "Bengaluru",
    rating: 5,
    quote:
      "Mitti is nostalgia in a bottle. My grandfather's courtyard, the first rain, all of it. I did not expect a perfume to do that.",
    product: "Mitti",
    featured: true,
  },
  {
    id: "t_7",
    name: "Sayed Suhail",
    city: "Kolkata",
    rating: 5,
    quote:
      "I have been buying attar for thirty years. This is the first house that told me honestly how long a scent would last instead of promising the moon.",
    product: "Saffron Oudh",
    featured: false,
  },
  {
    id: "t_8",
    name: "Swatee Nair",
    city: "Pune",
    rating: 5,
    quote:
      "Wore Amber Noor to a December dinner and could still smell it on my scarf two days later. Worth every rupee.",
    product: "Amber Noor",
    featured: false,
  },
  {
    id: "t_9",
    name: "Devansh Bhatia",
    city: "Jaipur",
    rating: 5,
    quote:
      "The Oud Library is the best money I have spent on fragrance. Five tiny vials, five completely different forests. I ordered the Cambodian full bottle the same week.",
    product: "The Oud Library",
    featured: true,
  },
  {
    id: "t_10",
    name: "Noor Fatima",
    city: "Lucknow",
    rating: 5,
    quote:
      "Pure oud can be harsh. The Laotian oil is not — it is cool and quiet and smells like the inside of an old wooden box. I wear one drop and nothing else.",
    product: "Laotian Oud",
    featured: true,
  },
];

const team: TeamMember[] = [
  {
    id: "tm_1",
    name: "Imran Ibrahim",
    role: "Founder & Perfumer",
    bio: "Third-generation attar maker. Trained in Kannauj, obsessed with clay and oud.",
    initials: "II",
  },
  {
    id: "tm_2",
    name: "Ayesha Ibrahim",
    role: "Creative Director",
    bio: "Writes the labels, chooses the khadi, and decides what a scent should be called.",
    initials: "AI",
  },
  {
    id: "tm_3",
    name: "Rafiq Ahmed",
    role: "Master Distiller",
    bio: "Forty-one harvests in the deg-and-bhapka rooms. Can tell a batch by smell alone.",
    initials: "RA",
  },
  {
    id: "tm_4",
    name: "Nadia Siddiqui",
    role: "Atelier & Client Care",
    bio: "Packs every coffret by hand and remembers what each regular customer wears.",
    initials: "NS",
  },
];

const faqs: Faq[] = [
  {
    id: "f_1",
    question: "Are your attars alcohol-free?",
    answer:
      "Yes. Every attar in the collection is a pure oil blend with no alcohol, no phthalates and no synthetic fixatives. They are designed to be worn on skin, one drop at a time.",
    group: "Products",
  },
  {
    id: "f_2",
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 24 hours from Lucknow. Metro cities usually receive within 2–4 working days; the rest of India within 4–7. You will get a tracking link on WhatsApp and email.",
    group: "Shipping",
  },
  {
    id: "f_3",
    question: "Can I try before buying a full bottle?",
    answer:
      "That is what the Discovery Set is for. Five 2ml vials for ₹950, and the full amount is credited against your first full-size order.",
    group: "Products",
  },
  {
    id: "f_4",
    question: "Do you ship internationally?",
    answer:
      "Yes, to the UAE, UK, US, Canada, Singapore and Australia. International shipping is calculated at checkout; duties are the buyer's responsibility.",
    group: "Shipping",
  },
  {
    id: "f_5",
    question: "Can I return a fragrance?",
    answer:
      "Unopened bottles can be returned within 7 days of delivery. Opened bottles cannot be resold, so we do not accept them — which is exactly why we recommend starting with samples.",
    group: "Returns",
  },
  {
    id: "f_6",
    question: "Do you make custom or bulk orders?",
    answer:
      "We do. Wedding favours, corporate gifting and bespoke compositions start at 50 units. Use the contact form and choose 'Bulk & Weddings' — we usually reply within one working day.",
    group: "Orders",
  },
  {
    id: "f_7",
    question: "How should I store my perfume?",
    answer:
      "Away from sunlight and heat — a cupboard is better than a bathroom shelf. Attars in particular improve for the first year and then hold for decades if kept sealed.",
    group: "Products",
  },
  {
    id: "f_8",
    question: "Is gift wrapping available?",
    answer:
      "Every order above ₹2,000 is wrapped in khadi with a wax seal at no cost. You can add a handwritten note in the cart, and we will write it for you.",
    group: "Orders",
  },
];

export function buildSeed(passwordHash: (pw: string) => string): DB {
  const today = new Date();
  const byDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const wave = Math.round(120 + Math.sin(i / 2.6) * 38 + (29 - i) * 2.4);
    byDay[key] = Math.max(40, wave + Math.round(Math.random() * 22));
  }
  const visits = Object.values(byDay).reduce((a, b) => a + b, 0);

  return {
    version: 1,
    seedVersion: 4,
    products,
    collections,
    journal,
    testimonials,
    team,
    faqs,
    leads: [
      {
        id: "l_demo1",
        name: "Rehan Qureshi",
        phone: "+91 98200 41122",
        email: "rehan.q@example.com",
        city: "Mumbai",
        type: "bulk",
        interest: "Wedding favours — 120 coffrets",
        message:
          "We are planning a December wedding in Jaipur and would like 120 small coffrets with a custom note. Can you share pricing and lead time?",
        status: "progress",
        notes: "Sample box dispatched 12 Oct. Follow up after Diwali.",
        source: "website",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: "l_demo2",
        name: "Ananya Bhatia",
        phone: "+91 99110 88231",
        email: "ananya.b@example.com",
        city: "Delhi",
        type: "order",
        interest: "2 items",
        items: [
          { productId: "p_oud_malik", name: "Oud Al Malik", size: 50, price: 3450, qty: 1 },
          { productId: "p_discovery_set", name: "The Discovery Set", size: 10, price: 950, qty: 1 },
        ],
        total: 4400,
        message: "Please gift wrap and add a note: 'For Papa, with love.'",
        status: "new",
        source: "cart",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "l_demo3",
        name: "Farah Ansari",
        phone: "+91 90040 55667",
        email: "farah@example.com",
        city: "Lucknow",
        type: "enquiry",
        interest: "Attar for daily wear",
        message: "Which attar would you suggest for Indian summers? I prefer something green.",
        status: "contacted",
        source: "website",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
      },
      {
        id: "l_demo4",
        name: "Vikram Sethi",
        phone: "+91 98181 22334",
        city: "Gurugram",
        type: "callback",
        interest: "Corporate gifting — 40 units",
        message: "Please call after 6pm.",
        status: "closed",
        notes: "Closed — budget postponed to next quarter.",
        source: "website",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
      },
    ],
    users: [
      {
        id: "u_admin",
        name: "Imran Ibrahim",
        email: "admin@alibrahim.com",
        role: "admin",
        passwordHash: passwordHash("AlIbrahim@2026"),
        active: true,
        createdAt: now,
      },
      {
        id: "u_editor",
        name: "Nadia Siddiqui",
        email: "editor@alibrahim.com",
        role: "moderator",
        passwordHash: passwordHash("Editor@2026"),
        active: true,
        createdAt: now,
      },
    ],
    media: [],
    subscribers: [],
    activity: [
      {
        id: "ev_seed_1",
        kind: "order",
        title: "New order · Ayesha Khan",
        detail: "Oud Al Malik 50ml × 1 · ₹4,850",
        meta: { value: 4850, source: "checkout" },
        at: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      },
      {
        id: "ev_seed_2",
        kind: "lead",
        title: "New enquiry · Rehan Qureshi",
        detail: "Interested in the gilded coffret",
        meta: { source: "contact-form" },
        at: new Date(Date.now() - 1000 * 60 * 96).toISOString(),
      },
      {
        id: "ev_seed_3",
        kind: "newsletter",
        title: "New subscriber · letters@example.com",
        at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "ev_seed_4",
        kind: "whatsapp",
        title: "WhatsApp button opened",
        detail: "From /product/rose-taifi",
        at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      },
    ],
    settings: {
      brandName: "Al Ibrahim Aroma",
      tagline: "Attar house, Lucknow — since 1974",
      phone: "+91 90000 00000",
      whatsapp: "919000000000",
      email: "hello@alibrahim.com",
      address: "14 Hazratganj, Lucknow, Uttar Pradesh 226001",
      hours: "Mon–Sat · 10:00–19:00 IST",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      youtube: "https://youtube.com/",
      announcement: [
        "Complimentary shipping above ₹999",
        "Free 2ml discovery vial with every order",
        "Hand-wrapped in khadi, sealed in wax",
        "Ships worldwide from Lucknow",
      ],
      heroKicker: "Attar house · Lucknow · since 1974",
      heroTitle: "The scent of a memory|you can wear",
      heroSub:
        "Small-batch attars and parfums, distilled the slow way in Lucknow. Aged oud, Taif rose, and the smell of the first rain on baked clay.",
      freeShipping: 999,
      currency: "INR",
    },
    analytics: {
      visits,
      byDay,
      byPath: {
        "/": Math.round(visits * 0.46),
        "/collections": Math.round(visits * 0.19),
        "/product/oud-al-malik": Math.round(visits * 0.12),
        "/product/mitti": Math.round(visits * 0.08),
        "/about": Math.round(visits * 0.06),
        "/contact": Math.round(visits * 0.05),
        "/journal": Math.round(visits * 0.04),
      },
      events: { leads: 46, orders: 128, whatsapp: 73 },
    },
  };
}
