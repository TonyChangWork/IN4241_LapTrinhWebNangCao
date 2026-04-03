import "./ProductCard.css"
import { Link } from "react-router-dom"
import { formatVND } from "../utils/currency"

function ProductCard({ product }) {
  const discount = product.discountPercent;
  const isSale = product.oldPrice && product.oldPrice > product.price;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="image-container" style={{ position: "relative" }}>
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="badge-new" style={{ position: "absolute", top: "10px", left: "10px", background: "#3b82f6", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>NEW</span>}
        {isSale && <span className="badge-sale" style={{ position: "absolute", top: "10px", right: "10px", background: "#ef4444", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>-{discount || Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}%</span>}
      </div>
      <div className="card-info">
        <h3>{product.name}</h3>
        <p className="brand" style={{ color: "#666", fontSize: "14px", margin: "4px 0" }}>{product.brand}</p>
        <div className="price-row" style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <span className="current-price" style={{ fontWeight: "bold", fontSize: "16px" }}>{formatVND(product.price)}</span>
          {isSale && <span className="old-price" style={{ textDecoration: "line-through", color: "#999", fontSize: "14px" }}>{formatVND(product.oldPrice)}</span>}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
