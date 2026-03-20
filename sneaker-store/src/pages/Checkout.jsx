import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { formatVND } from "../utils/currency"
import "./Checkout.css"

const API_URL = "https://localhost:7178"

function Checkout({ cart, setCart, user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", phone: "", address: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên."
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại."
    else if (!/^[0-9]{10,11}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ."
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ."
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!user) {
      navigate("/login")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/orders`, {
        userId: user.id,
        total: total,
        address: form.address,
        phone: form.phone,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price
        }))
      })
      setOrderId(res.data.orderId)
      setSuccess(true)
      setCart([])
    } catch (err) {
      console.error("Lỗi đặt hàng:", err)
      setErrors({ general: "Đặt hàng thất bại, vui lòng thử lại." })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="checkout-success">
        <div className="success-icon">✓</div>
        <h2>Đặt hàng thành công!</h2>
        <p>Mã đơn hàng của bạn: <strong>#{orderId}</strong></p>
        <p>Chúng tôi sẽ liên hệ xác nhận qua số <strong>{form.phone}</strong></p>
        <Link to="/">
          <button className="back-home-btn">Tiếp tục mua sắm</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">

      <div className="checkout-left">
        <h2>Thông tin giao hàng</h2>

        {!user && (
          <div className="checkout-login-warn">
            Bạn chưa đăng nhập. <Link to="/login">Đăng nhập</Link> để tiếp tục.
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              placeholder="0901234567"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea
              name="address"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          {errors.general && <p className="error-msg">{errors.general}</p>}

          <button type="submit" className="place-order-btn" disabled={loading || !user}>
            {loading ? "Đang xử lý..." : `Đặt hàng • ${formatVND(total)}`}
          </button>
        </form>
      </div>

      <div className="checkout-right">
        <h2>Đơn hàng ({cart.reduce((s, i) => s + i.qty, 0)} sản phẩm)</h2>

        <div className="checkout-items">
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div className="checkout-item-info">
                <p className="checkout-item-name">{item.name}</p>
                <p className="checkout-item-brand">{item.brand}</p>
                <p className="checkout-item-qty">x{item.qty}</p>
              </div>
              <span className="checkout-item-price">{formatVND(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatVND(total)}</span>
          </div>
          <div className="summary-row">
            <span>Phí giao hàng</span>
            <span style={{ color: "#22c55e" }}>Miễn phí</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span>{formatVND(total)}</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Checkout
