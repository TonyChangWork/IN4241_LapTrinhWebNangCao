import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import "./Brands.css"

/* ─── Brand definitions ─── */
const BRANDS = [
  {
    name: "Nike",
    tagline: "Just Do It",
    description: "Thương hiệu sneaker số 1 thế giới — phong cách đường phố, hiệu suất đỉnh cao.",
    bg: "linear-gradient(135deg, #111 0%, #333 100%)",
    accent: "#fff",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    banner: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
  },
  {
    name: "Adidas",
    tagline: "Impossible Is Nothing",
    description: "Biểu tượng của 3 sọc — kết hợp giữa thời trang và thể thao đỉnh cao.",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    accent: "#fff",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    banner: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80",
  },
  {
    name: "Puma",
    tagline: "Forever Faster",
    description: "Tốc độ và phong cách — Puma là lựa chọn của các vận động viên đẳng cấp.",
    bg: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
    accent: "#fff",
    textColor: "#fff",
    logo: "/puma.svg",
    banner: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80",
  },
  {
    name: "Jordan",
    tagline: "Be Like Mike",
    description: "Huyền thoại sân bóng rổ — Jordan mang lại phong cách không thể nhầm lẫn.",
    bg: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    accent: "#fff",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
    banner: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80",
  },
  {
    name: "New Balance",
    tagline: "Fearlessly Independent",
    description: "Sự thoải mái thuần túy — NB kết hợp hoàn hảo giữa cổ điển và hiện đại.",
    bg: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
    accent: "#fff",
    textColor: "#fff",
    logo: "/newbalance.svg",
    banner: "https://images.unsplash.com/photo-1556906781-9a412961a28d?w=900&q=80",
  },
  {
    name: "Converse",
    tagline: "Shoes Are Boring. Wear Sneakers.",
    description: "Chuck Taylor bất hủ — biểu tượng văn hoá của giới trẻ suốt hàng thập kỷ.",
    bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
    accent: "#111",
    textColor: "#111",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg",
    banner: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=900&q=80",
  },
  {
    name: "Vans",
    tagline: "Off The Wall",
    description: "Skateboarding culture — Vans là linh hồn của phong trào street và thể thao cực hạn.",
    bg: "linear-gradient(135deg, #1c1c1c 0%, #3d3d3d 100%)",
    accent: "#ef4444",
    textColor: "#fff",
    logo: "/vans.svg",
    banner: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80",
  },
]

/* ─── Sort options ─── */
const SORTS = [
  { key: "default", label: "Mặc định" },
  { key: "price-asc", label: "Giá tăng dần" },
  { key: "price-desc", label: "Giá giảm dần" },
  { key: "new", label: "Mới nhất" },
]

function Brands({ products = [] }) {
  const navigate = useNavigate()
  const [activeBrand, setActiveBrand] = useState(null)
  const [sortKey, setSortKey] = useState("default")
  const [searchQ, setSearchQ] = useState("")

  const brandProducts = useMemo(() => {
    if (!activeBrand) return []
    let list = products.filter(p =>
      p.brand?.toLowerCase() === activeBrand.name.toLowerCase()
    )
    if (searchQ.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()))
    }
    if (sortKey === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    else if (sortKey === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    else if (sortKey === "new") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    return list
  }, [activeBrand, products, sortKey, searchQ])

  const handleBrandClick = (brand) => {
    setActiveBrand(brand)
    setSortKey("default")
    setSearchQ("")
    setTimeout(() => {
      document.getElementById("brand-products-section")?.scrollIntoView({ behavior: "smooth" })
    }, 80)
  }

  return (
    <div className="brands-page">

      {/* ── Hero banner ── */}
      <div className="brands-hero">
        <div className="brands-hero-overlay" />
        <div className="brands-hero-content">
          <p className="brands-hero-eyebrow">Thương hiệu</p>
          <h1 className="brands-hero-title">Đỉnh cao sneaker<br />từ các thương hiệu hàng đầu</h1>
          <p className="brands-hero-sub">
            Nike · Adidas · Jordan · Puma · New Balance · Converse · Vans
          </p>
        </div>
      </div>

      {/* ── Brand grid ── */}
      <div className="brands-grid-section">
        <h2 className="brands-section-title">Chọn thương hiệu</h2>
        <div className="brands-grid">
          {BRANDS.map(brand => (
            <div
              key={brand.name}
              className={"brand-showcase-card" + (activeBrand?.name === brand.name ? " selected" : "")}
              style={{ background: brand.bg, "--accent": brand.accent }}
              onClick={() => handleBrandClick(brand)}
            >
              {/* Banner image */}
              <div
                className="bsc-banner"
                style={{ backgroundImage: `url(${brand.banner})` }}
              />
              <div className="bsc-overlay" style={{ background: brand.bg }} />

              {/* Logo */}
              <div className="bsc-logo-wrap">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="bsc-logo"
                  style={{
                    filter: brand.textColor === "#fff"
                      ? "brightness(0) invert(1)"
                      : "brightness(0)",
                  }}
                />
              </div>

              {/* Info */}
              <div className="bsc-info" style={{ color: brand.textColor }}>
                <p className="bsc-tagline" style={{ color: brand.accent }}>{brand.tagline}</p>
                <h3 className="bsc-name">{brand.name}</h3>
                <p className="bsc-desc">{brand.description}</p>
                <span className="bsc-cta" style={{ borderColor: brand.accent, color: brand.accent }}>
                  Xem sản phẩm →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product section for selected brand ── */}
      {activeBrand && (
        <div id="brand-products-section" className="brand-products-section">
          {/* Brand header */}
          <div
            className="brand-products-header"
            style={{ background: activeBrand.bg }}
          >
            <div className="brand-products-header-content">
              <img
                src={activeBrand.logo}
                alt={activeBrand.name}
                className="bph-logo"
                style={{
                  filter: activeBrand.textColor === "#fff"
                    ? "brightness(0) invert(1)"
                    : "brightness(0)",
                }}
              />
              <div style={{ color: activeBrand.textColor }}>
                <h2 className="bph-name">{activeBrand.name}</h2>
                <p className="bph-desc">{activeBrand.description}</p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="brand-products-toolbar">
            <div className="bpt-left">
              <span className="bpt-count">
                {brandProducts.length} sản phẩm của <strong>{activeBrand.name}</strong>
              </span>
            </div>
            <div className="bpt-right">
              <input
                type="text"
                className="bpt-search"
                placeholder="Tìm trong thương hiệu..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              <select
                className="bpt-sort"
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
              >
                {SORTS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product grid */}
          {brandProducts.length === 0 ? (
            <div className="brand-products-empty">
              <div className="bpe-icon">📦</div>
              <p>Chưa có sản phẩm {activeBrand.name} trong kho.</p>
              <button className="bpe-back-btn" onClick={() => navigate("/")}>Về trang chủ</button>
            </div>
          ) : (
            <div className="brand-products-grid">
              {brandProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Brands
