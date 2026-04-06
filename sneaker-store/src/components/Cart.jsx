import { Link, useNavigate } from "react-router-dom"
import { formatVND } from "../utils/currency"
import "./Cart.css"

const lineKey = (item) => `${item.id}-${item.selectedColorIndex ?? "na"}-${item.selectedSize ?? "na"}`

const formatImg = (url) => (url?.startsWith("/") ? `https://localhost:7178${url}` : (url || "https://via.placeholder.com/150?text=No+Image"));

function Cart({ cart, setCart }) {
  const navigate = useNavigate()

  const increaseQty = (key) => {
    setCart(cart.map(item => lineKey(item) === key ? { ...item, qty: item.qty + 1 } : item))
  }

  const decreaseQty = (key) => {
    setCart(cart.map(item => lineKey(item) === key ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0))
  }

  const removeItem = (key) => {
    setCart(cart.filter(item => lineKey(item) !== key))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div style={{ padding:"40px", maxWidth:"700px", margin:"0 auto" }}>
      <h2>Giỏ hàng</h2>

      {cart.length === 0 && (
        <div style={{ textAlign:"center", marginTop:"60px" }}>
          <p style={{ fontSize:"18px", color:"#888" }}>Giỏ hàng trống</p>
          <Link to="/">
            <button
              style={{
                marginTop: "16px",
                padding: "12px 32px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Tiếp tục mua sắm
            </button>
          </Link>
        </div>
      )}

      {cart.map(item => {
        const key = lineKey(item)
        return (
        <div key={key} style={{ display:"flex", gap:"20px", alignItems:"center", marginBottom:"16px", padding:"12px", border:"1px solid #eee", borderRadius:"8px" }}>
          <img src={formatImg(item.image || item.Image)} width="80" height="80" style={{ objectFit:"cover", borderRadius:"6px" }} alt={item.name}/>
          <div style={{ flex:1 }}>
            <h4 style={{ margin:"0 0 4px" }}>{item.name}</h4>
            <p style={{ margin:"0 0 2px", color:"#888", fontSize:"13px" }}>
              Size: {item.selectedSize != null ? item.selectedSize : "—"}
            </p>
            <p style={{ margin:"0 0 2px", color:"#888", fontSize:"13px" }}>
              Màu: {item.selectedColorName ? item.selectedColorName : "—"}
            </p>
            <p style={{ margin:0, color:"#888" }}>{formatVND(item.price)} / đôi</p>
          </div>
          <div className="cart-qty" aria-label="Quantity controls">
            <button type="button" onClick={() => decreaseQty(key)} className="cart-qty-btn">−</button>
            <span className="cart-qty-val">{item.qty}</span>
            <button type="button" onClick={() => increaseQty(key)} className="cart-qty-btn">+</button>
          </div>
          <span style={{ minWidth:"100px", textAlign:"right", fontWeight:"bold" }}>
            {formatVND(item.price * item.qty)}
          </span>
          <button type="button" onClick={() => removeItem(key)} style={{ color:"red", background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}>✕</button>
        </div>
        )
      })}

      {cart.length > 0 && (
        <div style={{ marginTop:"24px", borderTop:"2px solid #eee", paddingTop:"20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ margin:0, color:"#888" }}>Tổng cộng ({cart.reduce((s,i)=>s+i.qty,0)} sản phẩm)</p>
            <h3 style={{ margin:"4px 0 0", fontSize:"24px" }}>{formatVND(total)}</h3>
          </div>
          <button
            style={{ padding:"12px 32px", background:"black", color:"white", border:"none", borderRadius:"8px", fontSize:"16px", cursor:"pointer" }}
            onClick={() => navigate("/checkout")}
          >
            Thanh toán
          </button>
        </div> 
      )}
    </div>
  )
}

export default Cart
