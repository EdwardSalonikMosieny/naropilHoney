import { Facebook, Instagram, Menu, Music2, Phone, ShoppingBag, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100070830824748",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/narropilhoney.2020?igsh=MTQ4aDc2emJtM295ZQ==",
    Icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@narropilhoney?_r=1&_t=ZM-92GetkWCFtA",
    Icon: Music2,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/254713227238?text=Hello%20Narropil",
    Icon: Phone,
  },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#home">
          {/* <span className="brand-logo"> */}
            <img src="/assets/images/narropill logo.jpg" alt="Narropil Honey Logo" className="brand-logo" />
          {/* </span> */}
          <span className="brand-text">
            <span className="brand-title">Narropil Honey</span>
            <span className="brand-sub">Natural � Authentic � Pesticide-free</span>
          </span>
        </a>

        <nav className="nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Button
            variant="primary"
            className="btn-sm"
            onClick={() => {
              window.location.href = "#products";
            }}
          >
            <span>Shop</span>
            <ShoppingBag size={16} />
          </Button>

          <div className="socials">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                className="icon-btn"
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mobile-trigger"
                aria-label="Open menu"
              >
                <Menu size={18} className="trigger-icon"/>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mobile-header">
                <SheetTitle className="sheet-title">Navigation</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" aria-label="Close menu">
                    <X size={18} />
                  </Button>
                </SheetClose>
              </div>
              <nav className="mobile-nav" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a className="mobile-link" href={link.href}>
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mobile-socials">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    className="icon-btn"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
