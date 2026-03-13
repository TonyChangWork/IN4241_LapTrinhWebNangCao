import { Link } from "react-router-dom"

function Cart({ cart, setCart }) {

  const increaseQty = (id) => {
    setCart(
      cart.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart(
      cart.map(item =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0)
    )
  }

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div style={{ padding:"40px", maxWidth:"700px", margin:"0 auto" }}>

      <h2>Your Cart</h2>

      {cart.length === 0 && (
        <div style={{ textAlign:"center", marginTop:"60px" }}>
          <p style={{ fontSize:"18px", color:"#888" }}>Giỏ hàng trống</p>
          <Link to="/">
            <button style={{ marginTop:"16px", padding:"10px 24px" }}>Tiếp tục mua sắm</button>
          </Link>
        </div>
      )}

      {cart.map(item => (
        <div key={item.id} style={{
          display:"flex",
          gap:"20px",
          alignItems:"center",
          marginBottom:"16px",
          padding:"12px",
          border:"1px solid #eee",
          borderRadius:"8px"
        }}>

          <img src={item.image} width="80" height="80"
            style={{ objectFit:"cover", borderRadius:"6px" }}/>

          <div style={{ flex:1 }}>
            <h4 style={{ margin:"0 0 4px" }}>{item.name}</h4>
            <p style={{ margin:0, color:"#888" }}>${item.price} / đôi</p>
          </div>

          <button onClick={() => decreaseQty(item.id)}>-</button>
          <span style={{ minWidth:"24px", textAlign:"center", fontWeight:"bold" }}>{item.qty}</span>
          <button onClick={() => increaseQty(item.id)}>+</button>

          <span style={{ minWidth:"70px", textAlign:"right", fontWeight:"bold" }}>
            ${item.price * item.qty}
          </span>

          <button
            onClick={() => removeItem(item.id)}
            style={{ color:"red", background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}
          >✕</button>

        </div>
      ))}

      {cart.length > 0 && (
        <div style={{
          marginTop:"24px",
          borderTop:"2px solid #eee",
          paddingTop:"20px",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
          <div>
            <p style={{ margin:0, color:"#888" }}>Tổng cộng ({cart.reduce((s,i)=>s+i.qty,0)} sản phẩm)</p>
            <h3 style={{ margin:"4px 0 0", fontSize:"24px" }}>${total}</h3>
          </div>
          <button
            style={{
              padding:"12px 32px",
              background:"black",
              color:"white",
              border:"none",
              borderRadius:"8px",
              fontSize:"16px",
              cursor:"pointer"
            }}
            onClick={() => alert("Tính năng Checkout sẽ được tích hợp với ASP.NET API!")}
          >
            Thanh toán
          </button>
        </div>
      )}

    </div>
  )
}

export default Cart