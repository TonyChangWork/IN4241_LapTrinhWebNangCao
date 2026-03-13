import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ProductCard from "./components/ProductCard"
import products from "./data/products"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./components/Cart"

function App() {

  const [brandFilter, setBrandFilter] = useState("All")
  const [cart, setCart] = useState([])
  const addToCart = (product) => {

  const exist = cart.find(item => item.id === product.id)

  if(exist){
    setCart(
      cart.map(item =>
        item.id === product.id
          ? {...item, qty: item.qty + 1}
          : item
      )
    )
  }else{
    setCart([...cart, {...product, qty:1}])
  }

}

  return (
    <>
      <Navbar/>

      <ProductCard
        key={product.id}
        product={product}
        addToCart={addToCart}
      />

      <Routes>

        <Route path="/" element={
          <>
            <Hero/>

            <h2 style={{textAlign:"center", marginTop:"40px"}}>
              Trending Sneakers
            </h2>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(4,1fr)",
              gap:"30px",
              padding:"40px 80px"
            }}>

            {products
              .filter((product)=>
                brandFilter==="All" || product.brand===brandFilter
              )
              .map((product)=>(
                <ProductCard key={product.id} product={product}/>
            ))}

            </div>

            <div style={{
              display:"flex",
              justifyContent:"center",
              gap:"20px",
              marginTop:"30px"
            }}>

            <button onClick={()=>setBrandFilter("All")}>All</button>
            <button onClick={()=>setBrandFilter("Nike")}>Nike</button>
            <button onClick={()=>setBrandFilter("Adidas")}>Adidas</button>
            <button onClick={()=>setBrandFilter("Puma")}>Puma</button>
            <button onClick={()=>setBrandFilter("Jordan")}>Jordan</button>

            </div>

          </>
        }/>

        <Route path="/product/:id" element={<ProductDetail/>} />

        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

      </Routes>

    </>
  )
}

export default App