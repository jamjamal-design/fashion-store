import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface ImageMapping {
  localFile: string;      // path relative to fashion-store/public/
  folder: string;         // Cloudinary folder
  publicId: string;       // Cloudinary public ID (without folder prefix)
}

// Map local SVG placeholders to the Cloudinary public IDs used in seed.ts
const MAPPINGS: ImageMapping[] = [
  // Bespoke Couture
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/Bespoke-couture", publicId: "womens5_iefpz8" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/Bespoke-couture", publicId: "tailored-overshirt" },

  // Ready-to-Wear
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/ready-to-wear", publicId: "ready_to_wear_1_icqrjf" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/ready-to-wear", publicId: "men_s_wear_3_gegbvo" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/ready-to-wear", publicId: "men_s_wear_2_m5nd9g" },

  // Men's Collection
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/mens-wear", publicId: "men_s_wear_3_eaxddj" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/mens-wear", publicId: "men_s_wear_2_v6yd7g" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/mens-wear", publicId: "men_s_wear_1_dpswb3" },
  // Also upload as legacy paths for the overshirt
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "tailored-overshirt" },

  // Kids Collection
  { localFile: "public/products/velvet-wrap-dress.svg", folder: "fashion-store/kids", publicId: "kids_1_elirqd" },
  { localFile: "public/products/velvet-wrap-dress.svg", folder: "fashion-store/kids", publicId: "kids_3_g5yaif" },
  { localFile: "public/products/velvet-wrap-dress.svg", folder: "fashion-store/kids", publicId: "velvet-wrap-dress" },

  // Real Coral Beads
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/real-coral-beads", publicId: "coral_beads_1_vrl8wz" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/real-coral-beads", publicId: "coral_beads_2_vrl8wz" },

  // Luxury Accessories
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/luxury-accessories", publicId: "luxury_accessory_1_bboz0y" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/luxury-accessories", publicId: "accessory2_sjspb8" },
  { localFile: "public/products/atelier-structured-bag.svg", folder: "fashion-store/products", publicId: "atelier-structured-bag" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "silk-evening-clutch" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "gold-signature-hoops" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "silk-evening-dress" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "cashmere-blend-coat" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "linen-wide-leg-trousers" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "tailored-blazer" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "silk-tie-set" },
  { localFile: "public/products/velvet-wrap-dress.svg", folder: "fashion-store/products", publicId: "velvet-wrap-dress" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "coral-bead-necklace" },
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/products", publicId: "coral-bead-bracelet-men" },

  // Legacy bespoke-couture-collection path
  { localFile: "public/products/tailored-overshirt.svg", folder: "fashion-store/bespoke-couture-collection", publicId: "women5_iefpz8" },
];

async function uploadImages() {
  const projectRoot = path.resolve(__dirname, "..", "..", "fashion-store");

  for (const mapping of MAPPINGS) {
    const localPath = path.join(projectRoot, mapping.localFile);
    const publicId = `${mapping.folder}/${mapping.publicId}`;

    if (!fs.existsSync(localPath)) {
      console.error(`❌ File not found: ${localPath}`);
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(localPath, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });
      console.log(`✅ Uploaded: ${publicId} → ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${publicId}:`, err);
    }
  }

  console.log("\n🎉 All uploads complete!");
}

uploadImages().catch((err) => {
  console.error("Upload script failed:", err);
  process.exit(1);
});