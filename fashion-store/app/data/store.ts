export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  badge: string;
  description: string;
  details: string[];
  image: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
};

export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
  count: number;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  orderId: string;
  status: string;
};

export type ReceiptReview = {
  customer: string;
  orderId: string;
  amount: number;
  status: string;
};

export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const productCategories: ProductCategory[] = [
  { name: "Bespoke Couture", slug: "bespoke-couture", description: "Custom-made, tailored-to-perfection outfits crafted for the individual.", count: 18 },
  { name: "Ready-to-Wear", slug: "ready-to-wear", description: "Curated luxury pieces designed for effortless elegance, off the rack.", count: 24 },
  { name: "Men's Collection", slug: "mens-collection", description: "Refined tailoring and contemporary sophistication for the modern gentleman.", count: 15 },
  { name: "Kids Collection", slug: "kids-collection", description: "Exquisite children's fashion — where luxury meets playful innocence.", count: 10 },
  { name: "Real Coral Beads", slug: "real-coral-beads", description: "Authentic coral bead accessories — timeless heritage pieces for men and women.", count: 22 },
  { name: "Luxury Accessories", slug: "luxury-accessories", description: "Premium finishing touches — from handcrafted bags to signature accents.", count: 20 },
];

export const navigationLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/shop/bespoke-couture", label: "Bespoke Couture" },
      { href: "/shop/ready-to-wear", label: "Ready-to-Wear" },
      { href: "/shop/bridal", label: "Bridal" },
      { href: "/shop/mens-collection", label: "Men's Collection" },
      { href: "/shop/mens-suit", label: "Men's Suit" },
      { href: "/shop/womens-wear", label: "Women's Wear" },
      { href: "/shop/kids-collection", label: "Kids Collection" },
      { href: "/shop/real-coral-beads", label: "Real Coral Beads" },
      { href: "/shop/luxury-accessories", label: "Luxury Accessories" },
    ],
  },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/blog", label: "Blog & News" },
  { href: "/about", label: "About" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact", label: "Contact" },
];

export const customers: Customer[] = [
  {
    name: "Amina Yusuf",
    phone: "+1 555 010 214",
    email: "amina@example.com",
    orderId: "LM-24018",
    status: "Awaiting payment review",
  },
  {
    name: "Jordan Blake",
    phone: "+1 555 010 381",
    email: "jordan@example.com",
    orderId: "LM-24019",
    status: "Packed",
  },
  {
    name: "Sofia Khan",
    phone: "+1 555 010 442",
    email: "sofia@example.com",
    orderId: "LM-24020",
    status: "Shipped",
  },
];

export const receiptReviews = [
  {
    customer: "Amina Yusuf",
    orderId: "LM-24018",
    amount: 178,
    status: "Pending verification",
  },
  {
    customer: "Jordan Blake",
    orderId: "LM-24019",
    amount: 242,
    status: "Approved",
  },
  {
    customer: "Sofia Khan",
    orderId: "LM-24020",
    amount: 98,
    status: "Needs reference check",
  },
];

export const bankDetails = {
  bankName: "PROVIDUS BANK",
  accountName: "Claireville ventures",
  accountNumber: "5401452205",
  routingNumber: "",
  referenceHint: "Use your order ID as the transfer reference.",
};

export const whatsappNumber = "+2348059000500";
export const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
  "Hi Claireville, I need help with my order.",
)}
`;

export const socialLinks = {
  instagram: "https://www.instagram.com/clairevilleshop?utm_source=qr",
  tiktok: "https://www.tiktok.com/@clairevilleshop?_r=1&_t=ZT-97vDhcqJa5V",
  facebook: "https://www.facebook.com/share/1JWDuAsqrk/?mibextid=wwXIfr",
};

export const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djl9dxnrj";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}