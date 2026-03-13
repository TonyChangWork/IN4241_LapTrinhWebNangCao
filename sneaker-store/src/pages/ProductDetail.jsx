import { useParams } from "react-router-dom"
import products from "../data/products"

function ProductDetail({ addToCart }) {

  const { id } = useParams()

  const product = products.find(p => p.id == id)

  if (!product) return <p style={{ padding:"80px" }}>Không tìm thấy sản phẩm.</p>

  return (
    <div style={{ padding:"80px", display:"flex", gap:"60px", alignItems:"flex-start" }}>

      <img src={product.image} width="400" height="400"
        style={{ objectFit:"cover", borderRadius:"12px" }}/>

      <div>
        <p style={{ color:"#888", marginBottom:"8px" }}>{product.brand}</p>
        <h1 style={{ margin:"0 0 12px" }}>{product.name}</h1>
        <h2 style={{ margin:"0 0 20px", color:"#333" }}>${product.price}</h2>

        <p style={{ color:"#555", lineHeight:"1.6", maxWidth:"400px" }}>
          Premium sneaker designed for comfort and street style.
          Phù hợp cho mọi hoạt động hàng ngày.
        </p>

        <button
          onClick={() => addToCart(product)}
          style={{
            marginTop:"24px",
            padding:"14px 36px",
            background:"black",
            color:"white",
            border:"none",
            borderRadius:"8px",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

    </div>
  )
}

export default ProductDetail