import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { Providers } from "./providers";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumaatelier.com"),
  title: {
    default: "Claireville | Fashion Store",
    template: "%s | Claireville",
  },
  description:
    "Modern fashion storefront with product discovery, cart, checkout, admin tools, and payment support.",
  keywords: [
    "fashion store",
    "online boutique",
    "shop products",
    "checkout with bank transfer",
    "WhatsApp order support",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Claireville | Fashion Store",
    description:
      "Browse products, manage cart checkout, upload payment proof, and send orders through WhatsApp.",
    url: "/",
    siteName: "Claireville",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claireville | Fashion Store",
    description:
      "Browse products, manage cart checkout, upload payment proof, and send orders through WhatsApp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,140,255,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(123,97,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(73,196,255,0.12),_transparent_22%),linear-gradient(180deg,_#08111d_0%,_#091522_46%,_#07111f_100%)]" />
            {/* Site logo as background watermark */}
            <div
              className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.08]"
              style={{
                backgroundImage: "url('/logo.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "min(90vw, 800px) auto",
                zIndex: -5,
              }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute left-[4%] top-[12%] -z-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.22),transparent_72%)] animate-float" />
            <div className="pointer-events-none absolute right-[8%] top-[30%] -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(123,97,255,0.18),transparent_72%)] animate-float-slow" />
            <div className="pointer-events-none absolute bottom-[8%] left-[20%] -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(73,196,255,0.12),transparent_72%)] animate-float" />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
