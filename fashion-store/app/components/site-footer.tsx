import Image from "next/image";
import Link from "next/link";
import { navigationLinks, socialLinks, whatsappUrl } from "../data/store";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color:var(--footer-border)] bg-[color:var(--footer-bg)] py-14 md:py-16">
      <div className="section-shell grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] md:gap-8">
        <div className="space-y-5">
          <Link href="/" className="group flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Claireville logo"
              width={120}
              height={60}
              className="h-16 w-auto object-contain brightness-90 transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <p className="text-lg font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Claireville
              </p>
              <p className="text-sm italic font-bold text-[color:var(--footer-text)]">addicted to style</p>
            </div>
          </Link>
          <p className="max-w-md text-sm leading-7 text-[color:var(--footer-text)]">
            Boutique fashion storefront with a polished shopping experience, secure payment guidance,
            and premium garment care services.
          </p>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
            Pages
          </h2>
          <div className="grid gap-3 text-sm font-medium text-[color:var(--footer-text)]">
            {navigationLinks.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[color:var(--gold)]"
              >
                <span className="h-px w-0 bg-[color:var(--gold)] transition-all duration-300 group-hover:w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
            Support
          </h2>
          <div className="grid gap-3 text-sm font-medium text-[color:var(--footer-text)]">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[color:var(--gold)]"
            >
              <span className="h-px w-0 bg-[color:var(--gold)] transition-all duration-300 group-hover:w-4" />
              WhatsApp support
            </Link>
            <Link
              href="/checkout"
              className="group inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[color:var(--gold)]"
            >
              <span className="h-px w-0 bg-[color:var(--gold)] transition-all duration-300 group-hover:w-4" />
              Payment and receipt upload
            </Link>
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[color:var(--gold)]"
            >
              <span className="h-px w-0 bg-[color:var(--gold)] transition-all duration-300 group-hover:w-4" />
              Visit our boutique
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
            Follow us
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.instagram && (
              <Link href={socialLinks.instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.15)] bg-[color:var(--footer-surface)] text-[color:var(--gold)] transition-all duration-300 hover:scale-110 hover:bg-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.35)]" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>
            )}
            {socialLinks.tiktok && (
              <Link href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.15)] bg-[color:var(--footer-surface)] text-[color:var(--gold)] transition-all duration-300 hover:scale-110 hover:bg-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.35)]" aria-label="TikTok">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </Link>
            )}
            {socialLinks.facebook && (
              <Link href={socialLinks.facebook} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.15)] bg-[color:var(--footer-surface)] text-[color:var(--gold)] transition-all duration-300 hover:scale-110 hover:bg-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.35)]" aria-label="Facebook">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="section-shell mt-12 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--footer-border)] pt-8 text-center sm:flex-row sm:text-left">
        <p className="text-xs font-medium text-[color:var(--footer-text)]">
          &copy; {new Date().getFullYear()} Claireville. All rights reserved.
        </p>
        <p className="text-xs font-medium text-[color:var(--footer-text)]">
          Crafted with care &middot; <span className="text-[color:var(--gold)]">Addicted to style</span>
        </p>
      </div>
    </footer>
  );
}