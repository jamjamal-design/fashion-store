import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { connectDatabase } from "./config/database";
import { AdminModel } from "./models/Admin";
import { CategoryModel } from "./models/Category";
import { ProductModel } from "./models/Product";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "djl9dxnrj";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const CATEGORIES = [
  { name: "Bespoke Couture", slug: "bespoke-couture", description: "Custom-made, tailored-to-perfection outfits crafted for the individual.", count: 2, image: "" },
  { name: "Ready-to-Wear", slug: "ready-to-wear", description: "Curated luxury pieces designed for effortless elegance, off the rack.", count: 3, image: "" },
  { name: "Men's Collection", slug: "mens-collection", description: "Refined tailoring and contemporary sophistication for the modern gentleman.", count: 2, image: "" },
  { name: "Kids Collection", slug: "kids-collection", description: "Exquisite children's fashion — where luxury meets playful innocence.", count: 2, image: "" },
  { name: "Real Coral Beads", slug: "real-coral-beads", description: "Authentic coral bead accessories — timeless heritage pieces for men and women.", count: 2, image: "" },
  { name: "Luxury Accessories", slug: "luxury-accessories", description: "Premium finishing touches — from handcrafted bags to signature accents.", count: 3, image: "" },
];

const PRODUCTS = [
  // ── Bespoke Couture ──
  {
    name: "Bespoke Evening Gown",
    slug: "bespoke-evening-gown",
    category: "Bespoke Couture",
    price: 890,
    badge: "Made to Measure",
    description: "A fully customizable evening gown crafted to your exact measurements with hand-finished detailing.",
    details: ["Hand-beaded embellishments", "Custom silhouette", "Premium silk lining", "Personal fitting included"],
    image: [{ url: `${BASE_URL}/v1783976486/womens5_iefpz8.jpg`, publicId: "womens5_iefpz8" }],
    colors: ["Ivory", "Midnight", "Burgundy", "Champagne"],
    sizes: ["Custom"],
    rating: 5.0,
    reviews: 42,
    featured: true,
    stock: 10,
  },
  {
    name: "Bespoke Tailored Suit",
    slug: "bespoke-tailored-suit",
    category: "Bespoke Couture",
    price: 1250,
    badge: "Signature Piece",
    description: "A masterfully tailored three-piece suit, cut and sewn by hand for a flawless fit.",
    details: ["Super 150s wool", "Full canvas construction", "Mother-of-pearl buttons", "Monogrammed lining"],
    // Using a proper JPG image instead of SVG for Next.js Image compatibility
    image: [{ url: `${BASE_URL}/v1783778594/men_s_wear_3_eaxddj.jpg`, publicId: "men_s_wear_3_eaxddj" }],
    colors: ["Charcoal", "Navy", "Black", "Pinstripe"],
    sizes: ["Custom"],
    rating: 5.0,
    reviews: 36,
    featured: true,
    stock: 5,
  },
  // ── Ready-to-Wear ──
  {
    name: "Silk Evening Dress",
    slug: "silk-evening-dress",
    category: "Ready-to-Wear",
    price: 380,
    badge: "New Arrival",
    description: "An elegant silk dress with a sculpted waist and flowing silhouette — effortless sophistication.",
    details: ["Pure silk charmeuse", "Concealed zipper", "Flattering A-line cut", "Adjustable straps"],
    image: [{ url: `${BASE_URL}/f_auto/q_auto/v1783778644/ready_to_wear_1_icqrjf.jpg`, publicId: "ready_to_wear_1_icqrjf" }],
    colors: ["Blush", "Sage", "Black", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 94,
    featured: true,
    stock: 25,
  },
  {
    name: "Cashmere Blend Coat",
    slug: "cashmere-blend-coat",
    category: "Ready-to-Wear",
    price: 520,
    badge: "Editor Pick",
    description: "A luxurious cashmere-blend coat with a clean, architectural cut — the ultimate layer.",
    details: ["Cashmere-wool blend", "Notched lapel", "Double-breasted", "Side pockets"],
    image: [{ url: `${BASE_URL}/v1783778638/men_s_wear_3_gegbvo.jpg`, publicId: "men_s_wear_3_gegbvo" }],
    colors: ["Camel", "Grey", "Black", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 67,
    featured: true,
    stock: 15,
  },
  {
    name: "Linen Wide-Leg Trousers",
    slug: "linen-wide-leg-trousers",
    category: "Ready-to-Wear",
    price: 240,
    badge: "Summer Essential",
    description: "Effortlessly chic wide-leg trousers in breathable linen — perfect for warm-weather luxury.",
    details: ["Premium Belgian linen", "Elasticated waistband", "Side pockets", "Relaxed fit"],
    image: [{ url: `${BASE_URL}/v1783778643/men_s_wear_2_m5nd9g.jpg`, publicId: "men_s_wear_2_m5nd9g" }],
    colors: ["Oat", "Ivory", "Olive", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 112,
    stock: 30,
  },
  // ── Men's Collection ──
  {
    name: "Tailored Blazer",
    slug: "mens-tailored-blazer",
    category: "Men's Collection",
    price: 480,
    badge: "Best Seller",
    description: "A sharp, modern blazer with a slim cut and premium Italian fabric — for the discerning gentleman.",
    details: ["Italian wool-mohair blend", "Notch lapel", "Two-button closure", "Flap pockets"],
    image: [{ url: `${BASE_URL}/v1783778594/men_s_wear_3_eaxddj.jpg`, publicId: "men_s_wear_3_eaxddj" }],
    colors: ["Navy", "Charcoal", "Black", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviews: 83,
    featured: true,
    stock: 20,
  },
  {
    name: "Silk Tie Collection",
    slug: "mens-silk-tie-set",
    category: "Men's Collection",
    price: 120,
    badge: "Giftable",
    description: "A set of three hand-finished silk ties in classic patterns — the mark of refined taste.",
    details: ["Italian silk twill", "Hand-rolled edges", "Set of three", "Gift box included"],
    image: [{ url: `${BASE_URL}/v1783778593/men_s_wear_2_v6yd7g.jpg`, publicId: "men_s_wear_2_v6yd7g" }],
    colors: ["Navy", "Burgundy", "Silver"],
    sizes: ["One size"],
    rating: 4.6,
    reviews: 48,
    stock: 50,
  },
    {
    name: "Signature Silk Tie",
    slug: "mens-signature-silk-tie",
    category: "Men's Collection",
    price: 110,
    badge: "Classic",
    description: "A hand-finished silk tie with a subtle pattern — the mark of refined taste.",
    details: ["Italian silk twill", "Hand-rolled edges", "Gift box included"],
    image: [{ url: `${BASE_URL}/v1783778588/men_s_wear_1_dpswb3.jpg`, publicId: "men_s_wear_1_dpswb3" }],
    colors: ["Navy", "Burgundy", "Silver"],
    sizes: ["One size"],
    rating: 4.6,
    reviews: 48,
    stock: 50,
  },
  // ── Kids Collection ──
  {
    name: "Velvet Party Dress",
    slug: "kids-velvet-dress",
    category: "Kids Collection",
    price: 160,
    badge: "Adorable",
    description: "A charming velvet dress for special occasions — as luxurious as the grown-up version.",
    details: ["Soft velvet", "Satin sash", "Hidden zip", "Fully lined"],
    image: [{ url: `${BASE_URL}/v1783778472/kids_1_elirqd.jpg`, publicId: "kids_1_elirqd" }],
    colors: ["Ruby", "Pink", "Navy", "Ivory"],
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    rating: 4.9,
    reviews: 55,
    featured: true,
    stock: 12,
  },
  {
    name: "Mini Tailored Blazer",
    slug: "kids-tailored-blazer",
    category: "Kids Collection",
    price: 180,
    badge: "New Arrival",
    description: "A pint-sized version of the classic blazer — because style has no age limit.",
    details: ["Wool blend", "Notch lapel", "Button front", "Chest pocket"],
    image: [{ url: `${BASE_URL}/v1783778477/kids3_g5yaif.jpg`, publicId: "kids3_g5yaif" }],
    colors: ["Navy", "Charcoal", "Black"],
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    rating: 4.8,
    reviews: 31,
    stock: 8,
  },
  // ── Real Coral Beads ──
  {
    name: "Ruby Coral Necklace",
    slug: "coral-bead-necklace",
    category: "Real Coral Beads",
    price: 340,
    badge: "Heritage Piece",
    description: "Authentic red coral bead necklace hand-strung by master artisans — a timeless heirloom.",
    details: ["100% genuine coral", "Hand-strung", "Sterling silver clasp", "Certificate of authenticity"],
    image: [{ url: `${BASE_URL}/v1783778409/coral_beads_1_vrl8wz.jpg`, publicId: "coral_beads_1_vrl8wz" }],
    colors: ["Red Coral", "Pink Coral", "White Coral"],
    sizes: ["One size"],
    rating: 5.0,
    reviews: 27,
    featured: true,
    stock: 6,
  },
  {
    name: "Coral & Onyx Bracelet",
    slug: "coral-bead-bracelet-men",
    category: "Real Coral Beads",
    price: 180,
    badge: "Men's Style",
    description: "A bold coral and onyx bracelet for men — heritage craftsmanship meets modern masculinity.",
    details: ["Genuine coral beads", "Onyx accent beads", "Adjustable knotting", "Handmade in Nigeria"],
    image: [{ url: `${BASE_URL}/v1783778409/coral_beads_1_vrl8wz.jpg`, publicId: "coral_beads_1_vrl8wz" }],
    colors: ["Red & Black", "Pink & Grey", "White & Brown"],
    sizes: ["One size"],
    rating: 4.9,
    reviews: 38,
    stock: 10,
  },
  // ── Luxury Accessories ──
  {
    name: "Structured Leather Bag",
    slug: "structured-leather-bag",
    category: "Luxury Accessories",
    price: 420,
    badge: "Editor Pick",
    description: "A sculptural leather handbag with polished hardware — the finishing touch to any ensemble.",
    details: ["Full-grain leather", "Gold-toned hardware", "Detachable shoulder strap", "Magnetic closure"],
    image: [{ url: `${BASE_URL}/v1783778434/luxury_accessory_1_bboz0y.jpg`, publicId: "luxury_accessory_1_bboz0y" }],
    colors: ["Black", "Chestnut", "Cream", "Navy"],
    sizes: ["One size"],
    rating: 4.8,
    reviews: 73,
    featured: true,
    stock: 7,
  },
  {
    name: "Gold Signature Hoops",
    slug: "gold-signature-hoops",
    category: "Luxury Accessories",
    price: 160,
    badge: "Best Seller",
    description: "Handcrafted 18k gold-plated hoops that catch the light from every angle.",
    details: ["18k gold plating", "Hypoallergenic", "Secure click closure", "Luxury pouch included"],
    image: [{ url: `${BASE_URL}/v1783885621/accessory2_sjspb8.jpg`, publicId: "accessory2_sjspb8" }],
    colors: ["Gold", "Rose Gold", "Silver"],
    sizes: ["One size"],
    rating: 4.7,
    reviews: 94,
    stock: 20,
  },
  {
    name: "Silk Evening Clutch",
    slug: "silk-evening-clutch",
    category: "Luxury Accessories",
    price: 190,
    badge: "Limited Edition",
    description: "An exquisite silk evening clutch with crystal-embellished clasp — pure glamour.",
    details: ["Luxury silk fabric", "Crystal embellished clasp", "Detachable chain strap", "Interior card slots"],
    image: [{ url: `${BASE_URL}/v1783778434/luxury_accessory_1_bboz0y.jpg`, publicId: "luxury_accessory_1_bboz0y" }],
    colors: ["Blush", "Black", "Gold", "Silver"],
    sizes: ["One size"],
    rating: 4.9,
    reviews: 41,
    stock: 5,
  },
];

async function seed() {
  console.log("⏳ Connecting to database...");
  await connectDatabase();

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await Promise.all([
    AdminModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  // Create admin
  console.log("👤 Creating admin user...");
  const passwordHash = await bcrypt.hash("clairevilleoo00098876bgt", 10);
  await AdminModel.create({
    name: "Akorede Gboyega",
    email: "akoredegboyea1@gmail.com",
    passwordHash,
    role: "owner",
    status: "active",
  });
  console.log("✅ Admin created: akoredegboyea1@gmail.com");

  // Create categories
  console.log("📁 Creating categories...");
  await CategoryModel.insertMany(CATEGORIES.map((c) => ({ ...c, isActive: true })));
  console.log(`✅ ${CATEGORIES.length} categories created`);

  // Create products
  console.log("📦 Creating products...");
  await ProductModel.insertMany(PRODUCTS.map((p) => ({ ...p, isActive: true })));
  console.log(`✅ ${PRODUCTS.length} products created`);

  console.log("\n🎉 Seed complete!");
  console.log("   Admin login: akoredegboyea1@gmail.com");
  console.log("   Admin password: clairevilleoo00098876bgt");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});