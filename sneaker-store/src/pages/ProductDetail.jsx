import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./ProductDetail.css"
import { formatVND } from "../utils/currency"
import { productService } from "../services/api"
const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45]

function ProductDetail({ addToCart, products = [] }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  const colorOptions = product
    ? [
        { name: product.color1Name, image: product.color1Image, index: 1 },
        { name: product.color2Name, image: product.color2Image, index: 2 },
        { name: product.color3Name, image: product.color3Image, index: 3 },
        { name: product.color4Name, image: product.color4Image, index: 4 },
      ].filter((c) => c.image)
    : []

  // Nếu database chưa có màu (null), vẫn render ít nhất 1 "màu mặc định"
  const normalizedColorOptions =
    colorOptions.length > 0
      ? colorOptions
      : product
        ? [{ name: "Mặc định", image: product.image, index: 1 }]
        : []

  const selectedColor = normalizedColorOptions[selectedColorIndex] || null

  useEffect(() => {
    const localProduct = products.find((p) => String(p.id) === String(id))
    if (localProduct) {
      setProduct(localProduct)
      setLoading(false)
      return
    }

    setLoading(true)
    productService.getById(id)
      .then(res => {
        setProduct(res.data)
      })
      .catch(() => {
        setProduct(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, products])

  useEffect(() => {
    // Khi đổi sản phẩm, reset màu về màu đầu tiên có ảnh (nếu có)
    if (product) setSelectedColorIndex(0)
  }, [product])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    for (let i = 0; i < qty; i++) {
      addToCart({
        ...product,
        selectedSize,
        selectedColorIndex: selectedColor?.index ?? null,
        selectedColorName: selectedColor?.name ?? null,
        // Đổi ảnh theo màu để cart/checkout hiển thị đúng màu đang chọn
        image: selectedColor?.image ?? product.image,
      })
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
          <img
            src={selectedColor?.image ?? product.image}
            alt={selectedColor?.name ? `${product.name} - ${selectedColor.name}` : product.name}
            className="pd-image"
          />
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

          {normalizedColorOptions.length > 0 && (
            <div className="pd-section">
              <div className="pd-section-title">Chọn màu</div>
              <div className="pd-colors">
                {normalizedColorOptions.map((c, idx) => (
                  <button
                    key={c.index}
                    type="button"
                    className={"pd-color-btn" + (selectedColorIndex === idx ? " active" : "")}
                    onClick={() => setSelectedColorIndex(idx)}
                    aria-label={`Chọn màu: ${c.name || `Màu ${c.index}`}`}
                  >
                    <span className="pd-color-thumb" style={{ backgroundImage: `url(${c.image})` }} />
                    <span className="pd-color-label">{c.name || `Màu ${c.index}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-section">
            <div className="pd-section-title">Số lượng</div>
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
              <span className="pd-qty-val">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="pd-qty-btn">+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button type="button" className={"pd-add-btn" + (added ? " added" : "")} onClick={handleAddToCart}>
              {added ? (
                <span className="pd-add-btn-label">✓ Đã thêm vào giỏ!</span>
              ) : (
                <>
                  <span className="pd-add-btn-label">Thêm vào giỏ</span>
                  <span className="pd-add-btn-price">{formatVND(product.price * qty)}</span>
                </>
              )}
            </button>
            <button className="pd-buy-btn" onClick={() => { handleAddToCart(); if (selectedSize) navigate("/cart") }}>
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
