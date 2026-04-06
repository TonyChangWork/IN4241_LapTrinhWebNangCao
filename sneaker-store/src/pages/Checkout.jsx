import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatVND } from "../utils/currency"
import "./Checkout.css"
import { toast } from "react-hot-toast"
import { orderService } from "../services/api"
import { Truck, QrCode, CreditCard, Wallet } from "lucide-react"

const checkoutLineKey = (item) => `${item.id}-${item.selectedColorIndex ?? "na"}-${item.selectedSize ?? "na"}`

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng", icon: <Truck size={24} />, desc: "Trả tiền mặt khi nhận hàng" },
  { id: "qr", label: "Chuyển khoản QR", icon: <QrCode size={24} />, desc: "Quét mã QR để thanh toán ngay" },
  { id: "card", label: "Thẻ tín dụng / Ghi nợ", icon: <CreditCard size={24} />, desc: "Visa, Mastercard, JCB" },
  { id: "momo", label: "Ví MoMo", icon: <Wallet size={24} color="#d82d8b" />, desc: "Thanh toán qua ví MoMo" },
]

const formatImg = (url) => (url?.startsWith("/") ? `https://localhost:7178${url}` : (url || "https://via.placeholder.com/150?text=No+Image"));

function Checkout({ cart, setCart, user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", phone: "", address: "" })
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleCardChange = (e) => {
    let value = e.target.value
    if (e.target.name === "number") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
    if (e.target.name === "expiry") value = value.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/")
    if (e.target.name === "cvv") value = value.replace(/\D/g, "").slice(0, 3)
    setCardForm({ ...cardForm, [e.target.name]: value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên."
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại."
    else if (!/^[0-9]{10,11}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ."
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ."
    if (paymentMethod === "card") {
      if (cardForm.number.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Số thẻ không hợp lệ."
      if (!cardForm.name.trim()) newErrors.cardName = "Vui lòng nhập tên chủ thẻ."
      if (cardForm.expiry.length < 5) newErrors.cardExpiry = "Ngày hết hạn không hợp lệ."
      if (cardForm.cvv.length < 3) newErrors.cardCvv = "CVV không hợp lệ."
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    if (!user) { navigate("/login"); return }

    setLoading(true)
    try {
      const res = await orderService.create({
        userId: user.id,
        total: total,
        address: form.address,
        phone: form.phone,
        items: cart.map(item => ({
          productId: item.id,
          shoeSize: item.selectedSize ?? null,
          quantity: item.qty,
          price: item.price,
        }))
      })
      setOrderId(res.data.orderId)
      setSuccess(true)
      setCart([])
      toast.success("Đặt hàng thành công!", { duration: 3000, position: "bottom-right" })
    } catch (err) {
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
        {paymentMethod === "qr" && <p style={{ color: "#22c55e" }}>✓ Đã xác nhận thanh toán QR</p>}
        {paymentMethod === "card" && <p style={{ color: "#22c55e" }}>✓ Đã xác nhận thanh toán thẻ</p>}
        {paymentMethod === "momo" && <p style={{ color: "#22c55e" }}>✓ Đã xác nhận thanh toán MoMo</p>}
        <Link to="/"><button className="back-home-btn">Tiếp tục mua sắm</button></Link>
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
            <input type="text" name="name" placeholder="Nguyễn Văn A" value={form.name} onChange={handleChange} className={errors.name ? "input-error" : ""} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="text" name="phone" placeholder="0901234567" value={form.phone} onChange={handleChange} className={errors.phone ? "input-error" : ""} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea name="address" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" value={form.address} onChange={handleChange} rows={3} className={errors.address ? "input-error" : ""} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Hình thức thanh toán</label>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(method => (
                <div
                  key={method.id}
                  className={"payment-option" + (paymentMethod === method.id ? " active" : "")}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <span className="payment-icon">{method.icon}</span>
                  <div className="payment-info">
                    <p className="payment-label">{method.label}</p>
                    <p className="payment-desc">{method.desc}</p>
                  </div>
                  <div className={"payment-radio" + (paymentMethod === method.id ? " checked" : "")} />
                </div>
              ))}
            </div>
          </div>

          {paymentMethod === "qr" && (
            <div className="qr-section">
              <p className="qr-title">Quét mã QR để thanh toán</p>
              <div className="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SneakerHub-Payment" alt="QR Code" />
              </div>
              <p className="qr-amount">Số tiền: <strong>{formatVND(total)}</strong></p>
              <p className="qr-bank">MB Bank — 0123456789 — SNEAKERHUB</p>
              <p className="qr-note" style={{ color: "#888", fontSize: "12px" }}>Nội dung chuyển khoản: SneakerHub + SĐT của bạn</p>
            </div>
          )}

          {paymentMethod === "momo" && (
            <div className="qr-section">
              <p className="qr-title">Quét mã MoMo để thanh toán</p>
              <div className="qr-code" style={{ background: "#d82d8b", borderRadius: "12px", padding: "12px" }}>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MoMo-SneakerHub&color=ffffff&bgcolor=d82d8b" alt="MoMo QR" />
              </div>
              <p className="qr-amount">Số tiền: <strong>{formatVND(total)}</strong></p>
              <p className="qr-bank" style={{ color: "#d82d8b" }}>MoMo — 0901 234 567 — SNEAKERHUB</p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="card-section">
              <p className="card-title">Thông tin thẻ</p>
              <div className="form-group">
                <label>Số thẻ</label>
                <input type="text" name="number" placeholder="1234 5678 9012 3456" value={cardForm.number} onChange={handleCardChange} className={errors.cardNumber ? "input-error" : ""} />
                {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
              </div>
              <div className="form-group">
                <label>Tên chủ thẻ</label>
                <input type="text" name="name" placeholder="NGUYEN VAN A" value={cardForm.name} onChange={handleCardChange} className={errors.cardName ? "input-error" : ""} />
                {errors.cardName && <span className="field-error">{errors.cardName}</span>}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày hết hạn</label>
                  <input type="text" name="expiry" placeholder="MM/YY" value={cardForm.expiry} onChange={handleCardChange} className={errors.cardExpiry ? "input-error" : ""} />
                  {errors.cardExpiry && <span className="field-error">{errors.cardExpiry}</span>}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>CVV</label>
                  <input type="text" name="cvv" placeholder="123" value={cardForm.cvv} onChange={handleCardChange} className={errors.cardCvv ? "input-error" : ""} />
                  {errors.cardCvv && <span className="field-error">{errors.cardCvv}</span>}
                </div>
              </div>
              <div className="card-brands">
                <span>VISA</span><span>Mastercard</span><span>JCB</span>
              </div>
            </div>
          )}

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
            <div key={checkoutLineKey(item)} className="checkout-item">
              <img src={formatImg(item.image || item.Image)} alt={item.name} />
              <div className="checkout-item-info">
                <p className="checkout-item-name">{item.name}</p>
                <p className="checkout-item-brand">{item.brand}</p>
                <p className="checkout-item-size">Size: {item.selectedSize != null ? item.selectedSize : "—"}</p>
                <p className="checkout-item-size">Màu: {item.selectedColorName ? item.selectedColorName : "—"}</p>
                <p className="checkout-item-qty">x{item.qty}</p>
              </div>
              <span className="checkout-item-price">{formatVND(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="checkout-summary">
          <div className="summary-row"><span>Tạm tính</span><span>{formatVND(total)}</span></div>
          <div className="summary-row"><span>Phí giao hàng</span><span style={{ color: "#22c55e" }}>Miễn phí</span></div>
          <div className="summary-row"><span>Hình thức</span><span>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span></div>
          <div className="summary-row total"><span>Tổng cộng</span><span>{formatVND(total)}</span></div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
