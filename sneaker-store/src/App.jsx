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
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"

const API_URL = "https://localhost:7178"

function App() {

  const [brandFilter, setBrandFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi fetch products:", err)
        setLoading(false)
      })
  }, [])
  const addToCart = (product) => {
    const exist = cart.find(item => item.id === product.id)
    if(exist){
      setCart(cart.map(item =>
        item.id === product.id ? {...item, qty: item.qty + 1} : item
      ))
    } else {
      setCart([...cart, {...product, qty:1}])
    }
    toast.success(`Đã thêm ${product.name} vào giỏ!`, {
      duration: 2000,
      position: "bottom-right",
      style: { fontFamily: "Inter, sans-serif", fontSize: "14px" }
    })
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <Toaster/>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} user={user} logout={logout} onSearch={setSearchTerm} products={products}/>

      <div style={{ flex:1 }}>
      <Routes>

        <Route path="/" element={
          <>
            <Hero/>

            <BrandFilter active={brandFilter} onChange={setBrandFilter}/>

            <h2 style={{textAlign:"center", marginTop:"10px", marginBottom:"10px"}}>
              Trending Sneakers
            </h2>

            {loading ? (
              <p style={{ textAlign:"center", padding:"40px", color:"#888" }}>Đang tải sản phẩm...</p>
            ) : (
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
                gap:"30px",
                padding:"20px 60px 60px"
              }}>
                {products
                  .filter(product =>
                    (brandFilter === "All" || product.brand === brandFilter) &&
                    (searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart}/>
                  ))
                }
              </div>
            )}

          </>
        }/>

        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart}/>} />

        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user}/>} />
        <Route path="/orders" element={<OrderHistory user={user}/>} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
        <Route path="*" element={<NotFound/>} />

      </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App