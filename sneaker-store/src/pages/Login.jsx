import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"
import axios from "axios"
import { toast } from "react-hot-toast"

function Login({ setUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin.")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("https://localhost:7178/api/auth/login", {
        email: form.email,
        password: form.password
      })
      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      toast.success(`Chào mừng ${userData.name}!`, { duration: 2500, position: "bottom-right" })
      navigate("/")
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng.")
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="auth-brand">SneakerHub</div>
        <h1 className="auth-headline">Step Into<br />Your Style</h1>
        <p className="auth-tagline">Khám phá bộ sưu tập sneaker độc quyền từ các thương hiệu hàng đầu thế giới.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <h2 className="auth-title">Đăng nhập</h2>
          <p className="auth-subtitle">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                className={error ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={error ? "input-error" : ""}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login
