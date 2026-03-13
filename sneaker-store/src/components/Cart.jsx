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

  return (
    <div style={{padding:"40px"}}>

      <h2>Your Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div key={item.id} style={{
          display:"flex",
          gap:"20px",
          alignItems:"center",
          marginBottom:"20px"
        }}>

          <img src={item.image} width="80"/>

          <div>
            <h4>{item.name}</h4>
            <p>${item.price}</p>
          </div>

          <button onClick={()=>decreaseQty(item.id)}>-</button>

          <span>{item.qty}</span>

          <button onClick={()=>increaseQty(item.id)}>+</button>

        </div>
      ))}

    </div>
  )
}

export default Cart