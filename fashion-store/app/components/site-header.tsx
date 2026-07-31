"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks, whatsappUrl } from "../data/store";
import { useCart } from "./cart-context";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when route changes
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsMenuOpen(false);
      setOpenDropdown(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(var(--ink-rgb),0.06)] bg-white/85 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="Claireville logo"
            width={120}
            height={60}
            className="h-14 w-auto object-contain brightness-100"
            priority
          />
          <div className="hidden sm:block">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[color:var(--gold)]">
              Claireville
            </p>
            <p className="text-[10px] italic font-bold text-muted">addicted to style</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-[color:var(--foreground)]">
          {navigationLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

            if (hasChildren) {
              const isOpen = openDropdown === link.href;
              return (
                <div key={link.href} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : link.href)}
                    className={`flex items-center gap-1 rounded-full px-3.5 py-2 transition ${
                      active
                        ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white font-extrabold"
                        : "text-muted hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--rich-black)]"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-[rgba(201,168,76,0.12)] bg-white shadow-[0_10px_40px_rgba(var(--ink-rgb),0.10)] overflow-hidden"
                      style={{ animation: "fadeIn 0.12s ease both" }}
                    >
                      {link.children!.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2.5 text-sm font-bold transition ${
                              childActive
                                ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white"
                                : "text-muted hover:bg-[rgba(201,168,76,0.06)] hover:text-[color:var(--rich-black)]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 transition ${
                  active
                      ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white font-extrabold"
                      : "text-muted hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--rich-black)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Cart (always visible) */}
          <Link href="/cart" className="button-secondary px-3 py-2 text-xs lg:text-sm lg:px-4 lg:py-2">
            <svg className="h-4 w-4 lg:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <span className="hidden lg:inline">Cart</span>
            <span className="rounded-full bg-[rgba(201,168,76,0.10)] px-2 py-0.5 text-xs font-black text-[color:var(--gold)]">
              {itemCount}
            </span>
          </Link>

          {/* WhatsApp (hidden on small mobile, visible on tablet+) */}
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex button-primary px-3 py-2 text-xs lg:text-sm lg:px-4 lg:py-2"
          >
            <svg className="h-4 w-4 lg:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden lg:inline">WhatsApp</span>
          </Link>

          {/* Hamburger toggle (mobile only) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--ink-rgb),0.10)] bg-white/60 text-[color:var(--rich-black)] transition hover:bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.25)]"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[73px] z-50 lg:hidden"
          style={{ animation: "fadeIn 0.15s ease both" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(var(--scrim-rgb),0.90)] backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu panel */}
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] border-l border-[rgba(201,168,76,0.15)] bg-[var(--background)] shadow-[0_0_60px_rgba(var(--ink-rgb),0.20)]"
            style={{ animation: "slideInRight 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            <div className="flex flex-col p-6 pt-7">
              <div className="space-y-2">
                {navigationLinks.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-extrabold tracking-wide transition ${
                        active
                          ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white shadow-[0_6px_20px_rgba(201,168,76,0.30)]"
                          : "text-[color:var(--foreground)] hover:bg-[rgba(201,168,76,0.10)] hover:text-[color:var(--gold)]"
                      }`}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <hr className="my-6 border-t border-[rgba(var(--ink-rgb),0.06)]" />

              {/* Mobile WhatsApp */}
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)] px-4 py-3.5 text-base font-extrabold text-[color:var(--gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl border border-[rgba(var(--ink-rgb),0.08)] bg-[var(--surface)] px-4 py-3.5 text-base font-extrabold text-[color:var(--foreground)] transition hover:bg-[rgba(201,168,76,0.10)] hover:text-[color:var(--gold)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                Cart
                <span className="ml-auto rounded-full bg-[rgba(201,168,76,0.10)] px-2.5 py-0.5 text-xs font-black text-[color:var(--gold)]">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}