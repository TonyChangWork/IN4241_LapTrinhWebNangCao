import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import "./ProductDetail.css"
import { formatVND } from "../utils/currency"

const API_URL = "https://localhost:7178"
const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45]

function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, selectedSize })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="pd-loading">Đang tải sản phẩm...</div>
  if (!product) return <div className="pd-loading">Không tìm thấy sản phẩm.</div>

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <span onClick={() => navigate("/")} className="pd-breadcrumb-link">Trang chủ</span>
        <span> / </span>
        <span>{product.brand}</span>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <div className="pd-container">
        <div className="pd-image-wrap">
          <img src={product.image} alt={product.name} className="pd-image"/>
        </div>

        <div className="pd-info">
          <p className="pd-brand">{product.brand}</p>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-price">{formatVND(product.price)}</p>

          <p className="pd-desc">
            Premium sneaker được thiết kế cho sự thoải mái và phong cách đường phố.
            Phù hợp cho mọi hoạt động hàng ngày, từ dạo phố đến tập luyện nhẹ.
          </p>

          <div className="pd-section">
            <div className="pd-section-title">
              Chọn size
              {sizeError && <span className="pd-size-error">Vui lòng chọn size!</span>}
            </div>
            <div className="pd-sizes">
              {SIZES.map(size => (
                <button
                  key={size}
                  className={"pd-size-btn" + (selectedSize === size ? " active" : "")}
                  onClick={() => { setSelectedSize(size); setSizeError(false) }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pd-section">
            <div className="pd-section-title">Số lượng</div>
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
              <span className="pd-qty-val">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="pd-qty-btn">+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button className={"pd-add-btn" + (added ? " added" : "")} onClick={handleAddToCart}>
              {added ? "✓ Đã thêm vào giỏ!" : `Thêm vào giỏ • ${formatVND(product.price * qty)}`}
            </button>
            <button className="pd-buy-btn" onClick={() => { handleAddToCart(); if(selectedSize) navigate("/cart") }}>
              Mua ngay
            </button>
          </div>

          <div className="pd-features">
            <div className="pd-feature"><span>🚚</span><span>Miễn phí vận chuyển toàn quốc</span></div>
            <div className="pd-feature"><span>↩️</span><span>Đổi trả trong 30 ngày</span></div>
            <div className="pd-feature"><span>✅</span><span>Sản phẩm chính hãng 100%</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
