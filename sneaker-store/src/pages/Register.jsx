import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên."
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email."
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ."
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu."
    else if (form.password.length < 6) newErrors.password = "Mật khẩu tối thiểu 6 ký tự."
    if (form.confirm !== form.password) newErrors.confirm = "Mật khẩu xác nhận không khớp."
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    // Giả lập gọi API — sau này thay bằng fetch ASP.NET
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => navigate("/login"), 1500)
    }, 800)
  }

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="auth-brand">SneakerHub</div>
        <h1 className="auth-headline">Join The<br/>Sneaker Club</h1>
        <p className="auth-tagline">Tạo tài khoản để lưu giỏ hàng, theo dõi đơn hàng và nhận ưu đãi độc quyền.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <h2 className="auth-title">Đăng ký</h2>
          <p className="auth-subtitle">Tạo tài khoản miễn phí chỉ trong vài giây.</p>

          {success ? (
            <div className="success-box">
              Đăng ký thành công! Đang chuyển đến trang đăng nhập...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">

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
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirm"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirm}
                  onChange={handleChange}
                  className={errors.confirm ? "input-error" : ""}
                />
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>

            </form>
          )}

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register
