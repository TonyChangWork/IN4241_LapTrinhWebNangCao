import "./ProductCard.css"
import { Link } from "react-router-dom"

function ProductCard({product, addToCart}) {
  return (

    <Link to={`/product/${product.id}`}>

      <div className="product-card">

        <img src={product.image} alt={product.name}/>

        <h3>{product.name}</h3>

        <p className="price">${product.price}</p>

        <button onClick={(e)=>{
          e.preventDefault()
          addToCart(product)
        }}>
        Add to Cart
        </button>

      </div>

    </Link>
    

  )
}

export default ProductCard