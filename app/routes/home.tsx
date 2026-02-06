import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { Leaf, ShieldCheck, Sprout, X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "~/components/site-header";
import { useFetcher } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  // Contact form POST -> send email via SMTP.
  const form = await request.formData();
  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!fullName || !email || !message) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_TO = process.env.SMTP_TO || "narropilhoneyltd@gmail.com";
  const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || "no-reply@narropilhoney.co.ke";

  if (!SMTP_USER || !SMTP_PASS) {
    return Response.json(
      { ok: false, error: "Email service is not configured (missing SMTP credentials)." },
      { status: 500 },
    );
  }

  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `Website message from ${fullName}`;
    const text = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: SMTP_FROM,
      to: SMTP_TO,
      replyTo: email,
      subject,
      text,
      html: `<p><b>Name:</b> ${escapeHtml(fullName)}</p>
<p><b>Email:</b> ${escapeHtml(email)}</p>
${phone ? `<p><b>Phone:</b> ${escapeHtml(phone)}</p>` : ""}
<p><b>Message:</b></p>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>`,
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send email.";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type Product = {
  id: string;
  name: string;
  desc: string;
  price: string;
  category: "All" | "Liquid" | "Comb" | "By-products";
  image: string;
};

const products: Product[] = [
  { id: "liquid", name: "Liquid Honey", desc: "Raw, pesticide-free, golden honey - bottled with care.", price: "KSh 750 / 500g", category: "Liquid", image: "/assets/images/liquidhoney.png" },
  { id: "comb", name: "Comb Honey", desc: "Honey in its purest honeycomb form.", price: "KSh 1200 / piece", category: "Comb", image: "/assets/images/combhoney.png" },
  { id: "propolis", name: "Propolis", desc: "A natural bee resin for wellness & immunity.", price: "KSh 600 / pack", category: "By-products", image: "/assets/images/propolis.png" },
  { id: "beeswax", name: "Beeswax", desc: "Natural beeswax for crafts & cosmetics.", price: "KSh 900 / 250g", category: "By-products", image: "/assets/images/beewax.png" },
  { id: "pollen", name: "Bee Pollen", desc: "Nutrient-rich pollen collected with care.", price: "KSh 600 / 100g", category: "By-products", image: "/assets/images/pollen.png" },
  { id: "royal", name: "Royal Jelly", desc: "Premium royal jelly harvested with care.", price: "KSh 2500 / 50g", category: "By-products", image: "/assets/images/royal%20jelly.png" },
];

const galleryItems = [
  "/assets/images/pic1.png",
  "/assets/images/pic2.png",
  "/assets/images/pic3.png",
  "/assets/images/pic4.png",
  "/assets/images/pic6.jpg",
  "/assets/images/pic5.png",
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Narropil Honey Enterprises — Pure & Natural" },
    {
      name: "description",
      content: "Narropil Honey Enterprises — Natural honey, comb, and bee-products produced with care for nature.",
    },
  ];
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Liquid" | "Comb" | "By-products">("All");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const contactFetcher = useFetcher<{ ok: boolean; error?: string }>();

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const activeIndex = activeProductId ? products.findIndex((p) => p.id === activeProductId) : -1;
  const activeProduct = activeIndex >= 0 ? products[activeIndex] : null;

  const nextProduct = () => {
    if (activeIndex < 0) return;
    const next = (activeIndex + 1) % products.length;
    setActiveProductId(products[next].id);
  };

  const prevProduct = () => {
    if (activeIndex < 0) return;
    const prev = (activeIndex - 1 + products.length) % products.length;
    setActiveProductId(products[prev].id);
  };

  const nextGallery = () => {
    if (activeGallery === null) return;
    setActiveGallery((activeGallery + 1) % galleryItems.length);
  };

  const prevGallery = () => {
    if (activeGallery === null) return;
    setActiveGallery((activeGallery - 1 + galleryItems.length) % galleryItems.length);
  };

  const isSending = contactFetcher.state !== "idle";
  const contactOk = contactFetcher.data?.ok === true;
  const contactErr = contactFetcher.data?.ok === false ? contactFetcher.data?.error || "Unable to send right now." : null;

  return (
    <>
      <SiteHeader />
      <main>
        <section id="home" className="section hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-inner wrap">
            <div className="hero-left">
              <h1 className="hero-title">
                Kenya Drylands'
                <br />
                Organic Honey.
              </h1>
              <p className="hero-lead">
                Hand-harvested honey, comb and bee-products — preserved in purity and produced with care for nature.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary" href="#products">
                  Shop Products
                </a>
              </div>
              <div className="trust-row">
                <div className="trust-item">
                  <Leaf size={22} />
                  <span>Eco-friendly</span>
                </div>
                <div className="trust-item">
                  <ShieldCheck size={22} />
                  <span>Sanitary Process</span>
                </div>
                <div className="trust-item">
                  <Sprout size={22} />
                  <span>Free-range Apiaries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-shell" aria-label="About Narropil Honey">
          <div className="wrap about-inner">
            <div className="about-left">
              <h2 className="about-title">What we do</h2>
              <p className="about-lead">
                Narropil Honey Enterprises produces and markets high-quality liquid honey and honeycomb. We pride
                ourselves in producing and supplying honey in its natural state and taste, in sanitary conditions, and
                using methods that are environmentally conscious and protective of the ecosystem.
              </p>

              <div className="about-cards">
                <div className="about-card">
                  <h3>Vision</h3>
                  <p>
                    We envision a world where people have access to natural authentic honey that promotes good health
                    and wellbeing.
                  </p>
                </div>
                <div className="about-card">
                  <h3>Mission</h3>
                  <p>
                    To be a sustainable producer and supplier of natural authentic honey and bee by-products in Kenya
                    and beyond.
                  </p>
                </div>
              </div>

              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Natural</span>
                </div>
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Kg produced / month</span>
                </div>
                <div className="stat">
                  <span className="stat-number">618+</span>
                  <span className="stat-label">Local farmers engaged</span>
                </div>
              </div>
            </div>

            <div className="about-right">
              <div className="about-image-card">
                <img src="/assets/images/Apy%20pic.jpeg" alt="Free-range apiaries" />
                <div className="about-image-body">
                  <h3>Why choose Narropil?</h3>
                  <p>
                    We maintain hygienic processing, protect the bees, and ensure every jar retains its authentic
                    flavor.
                  </p>
                  <a className="btn btn-outline" href="#contact">
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="section wrap" aria-label="Products section">
          <div className="products-shell">
            <div className="products-head">
              <div>
                <h2 className="products-title">Our Products</h2>
                <p className="products-subtitle">From comb to royal jelly — discover our bee products.</p>
              </div>
              <div className="filters">
                {(["All", "Liquid", "Comb", "By-products"] as const).map((f) => (
                  <button
                    key={f}
                    className={`filter-chip ${activeFilter === f ? "is-active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                    type="button"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((item) => (
                <article key={item.id} className="product-card">
                  <div className="product-media">
                    <img src={item.image} alt={item.name} />
                    <button className="view-btn" type="button" onClick={() => setActiveProductId(item.id)}>
                      View
                    </button>
                  </div>
                  <div className="product-body">
                    <h3>{item.name}</h3>
                    <p className="product-desc">{item.desc}</p>
                    <p className="product-price">{item.price}</p>
                    <div className="product-actions-row">
                      <button className="btn btn-primary btn-sm" type="button">
                        Add to cart
                      </button>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => setActiveProductId(item.id)}>
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {activeProduct && (
          <div className="lightbox" role="dialog" aria-modal="true">
            <div className="lightbox-body product-lightbox">
              <button className="lightbox-close" onClick={() => setActiveProductId(null)} aria-label="Close">
                <X size={18} />
              </button>
              <div className="lightbox-media">
                <img src={activeProduct.image} alt={activeProduct.name} />
              </div>
              <div className="lightbox-info">
                <h3>{activeProduct.name}</h3>
                <p>{activeProduct.desc}</p>
                <p className="product-price">{activeProduct.price}</p>
              </div>
              <div className="lightbox-nav">
                <button className="btn btn-outline btn-sm" onClick={prevProduct} aria-label="Previous product">
                  <ChevronLeft size={16} /> Prev
                </button>
                <button className="btn btn-outline btn-sm" onClick={nextProduct} aria-label="Next product">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <section id="gallery" className="section wrap" aria-label="Gallery section">
          <div className="products-shell">
            <div className="products-head">
              <div>
                <h2 className="products-title">Gallery</h2>
                <p className="products-subtitle">A visual overview of our apiculture practices.</p>
              </div>
            </div>
            <div className="product-grid">
              {galleryItems.map((src, idx) => (
                <article key={src} className="product-card">
                  <div className="product-media">
                    <img src={src} alt={`Gallery ${idx + 1}`} />
                    <button className="view-btn" type="button" onClick={() => setActiveGallery(idx)}>
                      View
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {activeGallery !== null && (
          <div className="lightbox" role="dialog" aria-modal="true">
            <div className="lightbox-body product-lightbox">
              <button className="lightbox-close" onClick={() => setActiveGallery(null)} aria-label="Close">
                <X size={18} />
              </button>
              <div className="lightbox-media">
                <img src={galleryItems[activeGallery]} alt={`Gallery ${activeGallery + 1}`} />
              </div>
              <div className="lightbox-nav">
                <button className="btn btn-outline btn-sm" onClick={prevGallery} aria-label="Previous photo">
                  <ChevronLeft size={16} /> Prev
                </button>
                <button className="btn btn-outline btn-sm" onClick={nextGallery} aria-label="Next photo">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <section id="contact" className="section contact-shell" aria-label="Contact">
          <div className="wrap contact-grid">
            <div className="contact-card contact-info">
              <h2 className="contact-title">Let's talk</h2>
              <p className="contact-lead">
                For orders, partnerships, or wholesale enquiries reach us via phone, email or WhatsApp.
              </p>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span className="contact-icon"><Phone size={18} /></span>
                  <div>
                    <p className="contact-label">Phone</p>
                    <p className="contact-value">+254 713227238</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-icon"><Mail size={18} /></span>
                  <div>
                    <p className="contact-label">Email</p>
                    <p className="contact-value contact-email">narropilhoneyltd@gmail.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-icon"><MapPin size={18} /></span>
                  <div>
                    <p className="contact-label">Location</p>
                    <p className="contact-value">P.O BOX 2022-10400 Nanyuki, Kenya</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-icon"><Clock size={18} /></span>
                  <div>
                    <p className="contact-label">Business hours</p>
                    <p className="contact-value">Mon–Sat: 8:00am – 6:00pm</p>
                    <p className="contact-value">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <a className="btn btn-primary contact-whatsapp" href="https://wa.me/254713227238" target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
            <div className="contact-card contact-form-card">
              <h3 className="contact-title-sm">Send us a message</h3>
              <p className="contact-subtle">We usually respond within 24 hours.</p>
              <contactFetcher.Form className="contact-form" method="post">
                <label className="field">
                  <span>Full name</span>
                  <input type="text" name="fullName" required placeholder="your name" />
                </label>
                <label className="field">
                  <span>Email address</span>
                  <input type="email" name="email" required placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span>Phone (optional)</span>
                  <input type="tel" name="phone" placeholder="+254 700 000 000" />
                </label>
                <label className="field">
                  <span>Message</span>
                  <textarea name="message" rows={5} required placeholder="How can we help?" />
                </label>
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Send message"}
                  </button>
                  {contactOk && <span className="status success">Message sent.</span>}
                  {contactErr && <span className="status error">{contactErr}</span>}
                </div>
              </contactFetcher.Form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}








