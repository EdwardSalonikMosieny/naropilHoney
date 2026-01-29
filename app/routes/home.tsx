import type { Route } from "./+types/home";
import { Leaf, ShieldCheck, Sprout } from "lucide-react";
import { SiteHeader } from "~/components/site-header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Narropil Honey Enterprises — Pure & Natural" },
    {
      name: "description",
      content:
        "Narropil Honey Enterprises — Natural honey, comb, propolis, pollen, beeswax and more. Sustainably produced in Nanyuki, Kenya.",
    },
  ];
}

export default function Home() {
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
                Hand-harvested honey, comb and bee-products — preserved in purity
                and produced with care for nature.
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
            {/* <div className="hero-right" aria-label="Featured products">
              <article className="hero-card">
                <img
                  src="https://narropilhoney.co.ke/images/liquidhoney.png"
                  alt="Liquid Honey"
                />
                <div>
                  <h4>Liquid Honey</h4>
                  <p>Unfiltered, raw &amp; golden.</p>
                </div>
              </article>
              <article className="hero-card">
                <img
                  src="https://narropilhoney.co.ke/images/combhoney.png"
                  alt="Comb Honey"
                />
                <div>
                  <h4>Comb Honey</h4>
                  <p>Natural honeycomb — chewy &amp; pure.</p>
                </div>
              </article>
              <article className="hero-card">
                <img
                  src="https://narropilhoney.co.ke/images/beewax.png"
                  alt="Beeswax"
                />
                <div>
                  <h4>Beeswax</h4>
                  <p>For candles, cosmetics &amp; crafts.</p>
                </div>
              </article>
              <span className="hero-drop" aria-hidden="true" />
            </div> */}
          </div>
        </section>

        <section id="about" className="section wrap" aria-label="About section">
          <p className="placeholder-text">About section placeholder.</p>
        </section>
        <section id="products" className="section wrap" aria-label="Products section">
          <p className="placeholder-text">Products section placeholder.</p>
        </section>
        <section id="gallery" className="section wrap" aria-label="Gallery section">
          <p className="placeholder-text">Gallery section placeholder.</p>
        </section>
        <section id="contact" className="section wrap" aria-label="Contact section">
          <p className="placeholder-text">Contact section placeholder.</p>
        </section>
      </main>
    </>
  );
}
