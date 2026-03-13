import { useParams } from "react-router-dom"
import products from "../data/products"

function ProductDetail() {

  const { id } = useParams()

  const product = products.find(p => p.id == id)

  return (
    <div style={{padding:"80px"}}>

      <img src={product.image} width="400"/>

      <h1>{product.name}</h1>

      <h2>${product.price}</h2>

      <p>
        Premium sneaker designed for comfort and street style.
      </p>

      <button>Add to Cart</button>

    </div>
  )
}

export default ProductDetail