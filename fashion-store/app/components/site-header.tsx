"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavLinks, whatsappUrl } from "../data/store";
import { useCart } from "./cart-context";
import { ThemeToggle } from "./theme-toggle";
import { LuxurySearchModal } from "./luxury-search-modal";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close menu when route changes
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsMenuOpen(false);
      setOpenDropdown(null);
      setOpenMobileDropdown(null);
      setIsSearchOpen(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

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

  // Scroll detection for glassmorphism + gold border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const isDropdownActive = (link: { href: string; children?: { href: string; label: string }[] }) =>
    link.children?.some((child) => isActive(child.href)) || isActive(link.href);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header sticky top-0 z-40 ${isScrolled ? "is-scrolled" : ""}`}
      >
        {/* Gold bottom border — appears only after scrolling */}
        <div className="gold-scroll-border" aria-hidden="true" />

        {/* Top row: logo + actions */}
        <div className="section-shell flex items-center justify-between gap-5 py-4 md:py-5 lg:py-6">
          {/* Logo */}
          <Link href="/" className="nav-logo flex items-center gap-3 shrink-0" aria-label="Claireville — home">
            <Image
              src="/logo.png"
              alt="Claireville logo"
              width={120}
              height={60}
              className="h-14 w-auto object-contain brightness-100"
              priority
            />
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[color:var(--gold)]">
                Claireville
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">addicted to style</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="button-secondary px-3 py-2 text-xs lg:px-4 lg:py-2 lg:text-sm"
              aria-label="Open search"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <span className="hidden lg:inline">Search</span>
              <span className="hidden rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-muted xl:inline">
                Ctrl K
              </span>
            </button>

            {/* Cart (always visible) */}
            <Link
              href="/cart"
              className="button-secondary px-3 py-2 text-xs lg:text-sm lg:px-4 lg:py-2"
              aria-label={`Cart with ${itemCount} items`}
            >
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
              className={`lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--ink-rgb),0.10)] bg-white/60 text-[color:var(--rich-black)] transition hover:bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.25)] ${isMenuOpen ? "hamburger-open" : ""}`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="flex flex-col items-center justify-center gap-1.5">
                <span className="hamburger-line block h-0.5 w-5 rounded-full bg-current" />
                <span className="hamburger-line block h-0.5 w-5 rounded-full bg-current" />
                <span className="hamburger-line block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Bottom row: elegant category navigation (desktop) */}
        <nav className="hidden lg:block" aria-label="Primary navigation">
          <ul className="section-shell flex items-center justify-center gap-12 py-3.5 xl:gap-14">
            {headerNavLinks.map((link) => {
              const active = isActive(link.href);
              const dropdownActive = isDropdownActive(link);
              const hasChildren = !!link.children?.length;
              const isOpen = openDropdown === link.href;

              if (hasChildren) {
                return (
                  <li
                    key={link.href}
                    className="nav-dropdown-item relative"
                    data-open={isOpen}
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`nav-link flex items-center gap-1.5 ${dropdownActive ? "text-[color:var(--gold)]" : ""}`}
                      data-active={dropdownActive}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : link.href)}
                    >
                      {link.label}
                      <svg
                        className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </Link>

                    {/* Dropdown panel */}
                    <div className="nav-dropdown absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                      <div className="w-64 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[var(--surface-solid)] p-2 shadow-[0_20px_60px_rgba(44,44,44,0.12)]">
                        <ul className="space-y-0.5">
                          {link.children!.map((child) => {
                            const childActive = isActive(child.href);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                                    childActive
                                      ? "bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)]"
                                      : "text-[color:var(--foreground)] hover:bg-[rgba(201,168,76,0.06)] hover:text-[color:var(--gold)]"
                                  }`}
                                >
                                  {child.label}
                                  {childActive && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" aria-hidden="true" />
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="nav-link"
                    data-active={active}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Mobile menu overlay — rendered outside header so backdrop-blur doesn't trap fixed positioning */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[73px] z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <div
            className="mobile-menu-backdrop absolute inset-0 bg-[rgba(var(--scrim-rgb),0.96)] backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu panel — fully opaque so text stays legible over any page content */}
          <div
            className="mobile-menu-panel absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col border-l border-[rgba(201,168,76,0.20)] bg-[var(--background)] shadow-[-8px_0_60px_rgba(var(--ink-rgb),0.35)]"
          >
            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain p-5 pt-6">
              <div className="space-y-1.5">
                {headerNavLinks.map((link) => {
                  const active = isActive(link.href);
                  const dropdownActive = isDropdownActive(link);
                  const hasChildren = !!link.children?.length;
                  const isOpen = openMobileDropdown === link.href;

                  if (hasChildren) {
                    return (
                      <div key={link.href}>
                        <button
                          type="button"
                          onClick={() => setOpenMobileDropdown(isOpen ? null : link.href)}
                          className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-base font-extrabold tracking-wide transition-colors ${
                            dropdownActive
                              ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white shadow-[0_6px_20px_rgba(201,168,76,0.30)]"
                              : "text-[color:var(--rich-black)] hover:bg-[rgba(201,168,76,0.12)] hover:text-[color:var(--gold)] active:bg-[rgba(201,168,76,0.18)]"
                          }`}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-dropdown-${link.href.replace(/\//g, "-")}`}
                        >
                          <span className="flex items-center gap-3">
                            {dropdownActive && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                            )}
                            {link.label}
                          </span>
                          <svg
                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            aria-hidden="true"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {isOpen && (
                          <div
                            id={`mobile-dropdown-${link.href.replace(/\//g, "-")}`}
                            className="mobile-dropdown ml-4 mt-1 space-y-0.5 border-l-2 border-[rgba(201,168,76,0.20)] pl-3"
                          >
                            {link.children!.map((child) => {
                              const childActive = isActive(child.href);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                                    childActive
                                      ? "bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)]"
                                      : "text-[color:var(--foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                                  }`}
                                >
                                  {childActive && (
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gold)]" />
                                  )}
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
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3.5 text-base font-extrabold tracking-wide transition-colors ${
                        active
                          ? "bg-[linear-gradient(135deg,#C9A84C,#D4AF37_58%,#C9A84C)] text-white shadow-[0_6px_20px_rgba(201,168,76,0.30)]"
                          : "text-[color:var(--rich-black)] hover:bg-[rgba(201,168,76,0.12)] hover:text-[color:var(--gold)] active:bg-[rgba(201,168,76,0.18)]"
                      }`}
                    >
                      {active && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                      )}
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <hr className="my-5 border-t border-[rgba(var(--ink-rgb),0.10)]" />

              {/* Mobile WhatsApp */}
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-[rgba(201,168,76,0.20)] bg-[rgba(201,168,76,0.06)] px-4 py-3.5 text-base font-extrabold text-[color:var(--gold)] transition-colors hover:bg-[rgba(201,168,76,0.12)] active:bg-[rgba(201,168,76,0.18)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-[rgba(var(--ink-rgb),0.10)] bg-[var(--surface)] px-4 py-3.5 text-base font-extrabold text-[color:var(--rich-black)] transition-colors hover:bg-[rgba(201,168,76,0.12)] hover:text-[color:var(--gold)] active:bg-[rgba(201,168,76,0.18)]"
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

      <LuxurySearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}