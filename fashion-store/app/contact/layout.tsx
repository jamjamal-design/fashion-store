import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Claireville — book a consultation, ask about bespoke orders, or reach our team via WhatsApp, phone, or email.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Claireville",
    description:
      "Get in touch with Claireville — book a consultation or reach our team.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
