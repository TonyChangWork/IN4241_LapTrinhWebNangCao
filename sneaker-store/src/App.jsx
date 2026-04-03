import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ProductCard from "./components/ProductCard"
import BrandFilter from "./components/BrandFilter"
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./components/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Checkout from "./pages/Checkout"
import Footer from "./components/Footer"
import OrderHistory from "./pages/OrderHistory"
import NotFound from "./pages/NotFound"
import TrustSection from "./components/TrustSection"
import PromoBanner from "./components/PromoBanner"
import CategoryList from "./components/CategoryList"
import { Toaster, toast } from "react-hot-toast"
import { productService } from "./services/api"
import fallbackProducts from "./data/products"

function App() {
  const [brandFilter, setBrandFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Cart: load từ localStorage khi khởi động
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })

  // Tự động lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    toast.success("Đã đăng xuất!", { position: "bottom-right" })
  }

  const normalizeProducts = (rawProducts) => {
    const list = Array.isArray(rawProducts)
      ? rawProducts
      : Array.isArray(rawProducts?.$values)
      ? rawProducts.$values
      : []

    return list
      .map((p, i) => {
        const rawPrice = Number(p.price ?? p.Price ?? 0)
        // Một số nguồn trả giá rút gọn (vd: 120 => 1.200.000), chuẩn hoá để UI hiển thị đúng VND
        const price = rawPrice > 0 && rawPrice < 10000 ? rawPrice * 10000 : rawPrice
        const oldPriceValue = p.oldPrice ?? p.OldPrice
        const oldPriceRaw = oldPriceValue !== undefined && oldPriceValue !== null ? Number(oldPriceValue) : null
        const oldPrice = oldPriceRaw && oldPriceRaw < 10000 ? oldPriceRaw * 10000 : oldPriceRaw
        return {
          id: p.id ?? p.Id ?? i + 1,
          name: p.name ?? p.Name ?? `Sản phẩm ${i + 1}`,
          brand: p.brand ?? p.Brand ?? "Sneaker",
          image: p.image ?? p.Image ?? "https://via.placeholder.com/400x300?text=Sneaker",
          price,
          stock: p.stock ?? p.Stock ?? 0,
          isNew: Boolean(p.isNew ?? p.IsNew ?? i < 4),
          oldPrice: oldPrice || (i % 3 === 0 ? Number((price * 1.2).toFixed(2)) : null),
          discountPercent: p.discountPercent ?? p.DiscountPercent ?? (i % 3 === 0 ? 20 : null),
        }
      })
      .filter((p) => p.price > 0)
  }

  useEffect(() => {
    productService.getAll()
      .then(res => {
        const normalized = normalizeProducts(res.data)
        if (normalized.length > 0) {
          setProducts(normalized)
        } else {
          // API có thể trả rỗng khi DB chưa seed, fallback để homepage luôn có dữ liệu hiển thị
          setProducts(normalizeProducts(fallbackProducts))
          toast("API chưa có dữ liệu, đang hiển thị dữ liệu mẫu.", { position: "bottom-right" })
        }
        setLoading(false)
      })
      .catch((err) => {
        setProducts(normalizeProducts(fallbackProducts))
        toast.error("Không lấy được dữ liệu từ API, đang dùng dữ liệu mẫu.")
        console.error("Lỗi fetch products:", err)
        setLoading(false)
      })
  }, [])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exist = prev.find(item =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.selectedColorIndex === product.selectedColorIndex
      )
      if (exist) {
        return prev.map(item =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColorIndex === product.selectedColorIndex
            ? { ...item, qty: item.qty + qty }
            : item
        )
      } else {
        return [...prev, { ...product, qty }]
      }
    })
    toast.success(`Đã thêm ${product.name} vào giỏ!`, {
      duration: 2000,
      position: "bottom-right",
      style: { fontFamily: "Inter, sans-serif", fontSize: "14px" }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Toaster />
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        user={user}
        logout={logout}
        onUserUpdated={(updatedUser) => {
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }}
        onSearch={setSearchTerm}
        products={products}
      />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={
            <div className="home-content">
              <Hero />

              <CategoryList onSelect={setBrandFilter} />

              {/* Flash Sale Section */}
              {products.some(p => p.oldPrice && p.oldPrice > p.price) && (
                <div className="section-container sale-section" style={{ padding: "40px 60px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>🔥 FLASH SALE</h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "30px"
                  }}>
                    {products
                      .filter(p => p.oldPrice && p.oldPrice > p.price)
                      .slice(0, 4)
                      .map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    }
                  </div>
                </div>
              )}

              <PromoBanner
                title="SỰ KIỆN LỚN NHẤT NĂM"
                subtitle="Mua 2 đôi giảm thêm 15% | Free Ship toàn quốc"
                btnText="Săn Sale Ngay"
                color="#ef4444"
              />

              {/* New Arrivals */}
              <div className="section-container" style={{ padding: "40px 60px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>✨ NEW ARRIVALS</h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "30px"
                }}>
                  {products
                    .filter(p => p.isNew || p.id > (products.length - 8))
                    .slice(0, 8)
                    .map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  }
                </div>
              </div>

              <PromoBanner
                title="BỘ SƯU TẬP GIỚI HẠN"
                subtitle="Đừng bỏ lỡ những mẫu collab hiếm nhất thị trường"
                btnText="Khám Phá"
                color="#3b82f6"
              />

              {/* All / Filtered Products */}
              <div id="all-products" className="section-container" style={{ padding: "40px 60px" }}>
                <div style={{ marginBottom: "30px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 14px" }}>EXPLORE MORE</h2>
                  <BrandFilter active={brandFilter} onChange={setBrandFilter} />
                </div>
                {loading ? (
                  <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>Đang tải sản phẩm...</p>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "30px"
                  }}>
                    {products
                      .filter(product =>
                        (brandFilter === "All" || product.brand === brandFilter) &&
                        (searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    }
                  </div>
                )}
              </div>

              <TrustSection />
            </div>
          } />

          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} products={products} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user} />} />
          <Route path="/orders" element={<OrderHistory user={user} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
