import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { JsonLd } from "./components/json-ld";
import { Providers } from "./providers";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TAGLINE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Claireville",
    "luxury fashion",
    "bespoke couture",
    "ready-to-wear",
    "men's collection",
    "kids collection",
    "real coral beads",
    "luxury accessories",
    "online boutique",
    "Nigerian fashion house",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — luxury fashion`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}}catch(e){}})();
            `.trim(),
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            {/* Themed ambient gradient background (light beige or dark rich-black) */}
            <div
              className="pointer-events-none fixed inset-0 -z-10"
              style={{ background: 'var(--page-gradient)' }}
            />
            {/* Site logo as background watermark */}
            <div
              className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.03]"
              style={{
                backgroundImage: "url('/logo.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "min(90vw, 800px) auto",
                zIndex: -5,
              }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute left-[4%] top-[12%] -z-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.10),transparent_72%)] animate-float" />
            <div className="pointer-events-none absolute right-[8%] top-[30%] -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.14),transparent_72%)] animate-float-slow" />
            <div className="pointer-events-none absolute bottom-[8%] left-[20%] -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08),transparent_72%)] animate-float" />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}