This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Structure

The frontend app lives in `fashion-store/`, and the API/server scaffold lives in `server/`.

- `fashion-store/lib/mongodb.ts` centralizes MongoDB connection settings for the app layer.
- `fashion-store/lib/cloudinary.ts` keeps Cloudinary configuration and asset helpers in one place.
- `fashion-store/lib/auth.ts` holds admin login/session rules and permission checks, and now stores the admin session token in browser storage.
- `fashion-store/lib/admin-api.ts` wraps authenticated admin API calls, login, and product image uploads.
- `server/src/models` defines the MongoDB schemas for admins, products, categories, and orders.
- `server/src/types` contains shared TypeScript contracts for product, category, order, customer, and admin data.
- `server/src/hooks`, `server/src/middleware`, `server/src/controllers`, and `server/src/services` provide the backend layering for catalog and order management, login, authentication, and signed Cloudinary uploads.

Environment variables expected by the scaffold include `MONGODB_URI`, `MONGODB_DB_NAME`, `NEXT_PUBLIC_SERVER_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and admin session/JWT settings such as `ADMIN_SESSION_COOKIE_NAME` and `ADMIN_JWT_SECRET`.

The admin flow now starts at `/admin/login`, persists the token in local storage, and uses the server upload endpoint at `/api/uploads/cloudinary` for product image uploads.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
