export type Category = "Perfume" | "Attar" | "Home" | "Gifting" | "Discovery";
export type Family = "Oud" | "Amber" | "Floral" | "Fresh" | "Musk" | "Woody";
export type ArtVariant = "flacon" | "attar" | "diffuser" | "coffret" | "vial";
export type CapStyle = "gold" | "black" | "wood" | "ivory";
export type Role = "admin" | "moderator";
export type LeadStatus = "new" | "contacted" | "progress" | "closed";
export type LeadType = "enquiry" | "order" | "callback" | "bulk" | "gifting";

export interface ProductSize {
  ml: number;
  price: number;
  compareAt?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Category;
  family: Family;
  price: number;
  compareAt?: number;
  sizes: ProductSize[];
  notes: { top: string[]; heart: string[]; base: string[] };
  description: string;
  story: string;
  intensity: number;
  longevity: string;
  sillage: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  featured: boolean;
  bestseller: boolean;
  published: boolean;
  art: { variant: ArtVariant; liquid: string; label: string; cap: CapStyle };
  createdAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  description: string;
  filter: { category?: Category; family?: Family };
  accent: string;
  featured: boolean;
  order: number;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readTime: number;
  publishedAt: string;
  published: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  product?: string;
  videoUrl?: string;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  group: string;
}

export interface LeadItem {
  productId: string;
  name: string;
  size: number;
  price: number;
  qty: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  type: LeadType;
  interest?: string;
  message?: string;
  items?: LeadItem[];
  total?: number;
  status: LeadStatus;
  notes?: string;
  source: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface Settings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  announcement: string[];
  heroKicker: string;
  heroTitle: string;
  heroSub: string;
  freeShipping: number;
  currency: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface Analytics {
  visits: number;
  byDay: Record<string, number>;
  byPath: Record<string, number>;
  events: { leads: number; orders: number; whatsapp: number };
}

export interface DB {
  version: number;
  seedVersion: number;
  products: Product[];
  collections: Collection[];
  journal: JournalPost[];
  testimonials: Testimonial[];
  team: TeamMember[];
  faqs: Faq[];
  leads: Lead[];
  users: User[];
  media: MediaItem[];
  subscribers: Subscriber[];
  settings: Settings;
  analytics: Analytics;
}

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  size: number;
  price: number;
  qty: number;
  art: Product["art"];
}
