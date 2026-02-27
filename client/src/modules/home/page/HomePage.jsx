import { Link } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import { useGetProductsQuery } from "@/features/products/productsApi";
import HeroSection from "../components/HeroSection";
import FeaturesBar from "../components/FeaturesBar";
import GameCarousel from "../components/GameCarousel";
import CommunitySection from "../components/CommunitySection";
import DownloadCTA from "../components/DownloadCTA";

const HomePage = () => {
  const { data: apiData, isLoading } = useGetProductsQuery({ limit: 8 });
  const raw = apiData?.data?.items ?? apiData?.data ?? apiData?.products;
  const products = Array.isArray(raw) ? raw.slice(0, 8) : [];

  return (
    <div style={{ paddingTop: 0 }}>
      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ FEATURES BAR ═══ */}
      <FeaturesBar />

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section style={{ padding: "5rem 0" }} id="featured">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p
                className="badge badge-cyan"
                style={{ marginBottom: "0.75rem" }}
              >
                Hot Drops
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                Featured{" "}
                <span
                  style={{
                    color: "var(--color-neon-cyan)",
                    textShadow: "0 0 15px rgba(0,245,255,0.5)",
                  }}
                >
                  Products
                </span>
              </h2>
            </div>
            <Link
              to="/products"
              className="button button-secondary"
              id="view-all-products"
            >
              View All →
            </Link>
          </div>
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--color-text-muted)",
              }}
            >
              Loading products...
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* ═══ GAME SHOWCASE ═══ */}
      <GameCarousel />

      {/* ═══ COMMUNITY ═══ */}
      <CommunitySection />

      {/* ═══ DOWNLOAD CTA ═══ */}
      <DownloadCTA />
    </div>
  );
};

export default HomePage;
