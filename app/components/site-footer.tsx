import React from "react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="brand footer-brand">
          <img src="/assets/images/narropill logo.jpg" alt="Narropil Honey logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">Narropil Honey</span>
            <span className="brand-sub"></span>
          </div>
        </div>
        
        <div className="footer-contact footer-contact-row">
          <span>© {year} Narropil Honey Enterprises Ltd. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}





