import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { userService, orderService } from "../services/api"
import { formatVND } from "../utils/currency"
import { User, Lock, Package, LogOut, Camera, MapPin, Phone } from "lucide-react"
import "./Profile.css"

const formatImg = (url) => (url?.startsWith("/") ? `https://localhost:7178${url}` : (url || "https://via.placeholder.com/150?text=No+Image"));

const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "#f59e0b" },
  confirmed: { label: "Đã xác nhận",  color: "#3b82f6" },
  shipping:  { label: "Đang giao",    color: "#8b5cf6" },
  delivered: { label: "Đã giao",      color: "#22c55e" },
  cancelled: { label: "Đã huỷ",       color: "#ef4444" },
}

function normalizeOrders(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.$values)
    ? data.$values
    : []
  return list.map(o => ({
    ...o,
    items: Array.isArray(o.items)
      ? o.items
      : Array.isArray(o.items?.$values)
      ? o.items.$values
      : [],
  }))
}

const getInitial = (name) => (name?.trim()?.[0] || "U").toUpperCase()

function Profile({ user, onUserUpdated, logout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")

  // --- Info tab ---
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" })
  const [savingProfile, setSavingProfile] = useState(false)

  // --- Password tab ---
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [pwError, setPwError] = useState("")
  const [savingPw, setSavingPw] = useState(false)

  // --- Orders tab ---
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [ordersFetched, setOrdersFetched] = useState(false)

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    })
  }, [user])

  // Fetch orders when switching to that tab
  useEffect(() => {
    if (activeTab === "orders" && !ordersFetched && user) {
      setOrdersLoading(true)
      orderService.getByUser(user.id)
        .then(res => { setOrders(normalizeOrders(res.data)); setOrdersFetched(true) })
        .catch(() => toast.error("Không tải được đơn hàng."))
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab, ordersFetched, user])

  const handleProfileChange = (e) =>
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handlePwChange = (e) => {
    setPwError("")
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submitProfile = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSavingProfile(true)
    try {
      const res = await userService.update(user.id, {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
      })
      const updated = {
        ...user,
        name: res.data?.name ?? profileForm.name,
        phone: res.data?.phone ?? profileForm.phone,
        address: res.data?.address ?? profileForm.address,
      }
      onUserUpdated?.(updated)
      toast.success("Đã cập nhật thông tin cá nhân!")
    } catch {
      toast.error("Không thể cập nhật. Vui lòng thử lại.")
    } finally {
      setSavingProfile(false)
    }
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPwError("Vui lòng nhập đầy đủ thông tin.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError("Mật khẩu mới không khớp.")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPwError("Mật khẩu mới phải có ít nhất 6 ký tự.")
      return
    }
    setSavingPw(true)
    try {
      await userService.changePassword(user.id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
      toast.success("Đổi mật khẩu thành công!")
    } catch (err) {
      setPwError(err.response?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.")
    } finally {
      setSavingPw(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      try {
        await userService.update(user.id, { avatarUrl: base64String })
        const updated = { ...user, avatarUrl: base64String }
        onUserUpdated?.(updated)
        toast.success("Thay đổi ảnh đại diện thành công!")
      } catch {
        toast.error("Không thể thay đổi ảnh đại diện. Vui lòng thử lại sau.")
      }
    }
    reader.readAsDataURL(file)
  }

  if (!user) return null

  const TAB_ITEMS = [
    { key: "info",     icon: <User size={18} />, label: "Thông tin cá nhân" },
    { key: "password", icon: <Lock size={18} />, label: "Đổi mật khẩu" },
    { key: "orders",   icon: <Package size={18} />, label: "Đơn hàng" },
  ]

  return (
    <div className="profile-page">
      {/* ── SIDEBAR ── */}
      <aside className="profile-sidebar">
        <label className="profile-avatar-wrap" title="Đổi ảnh đại diện">
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: "none" }} 
            onChange={handleAvatarChange} 
          />
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="profile-avatar-img"
            />
          ) : (
            <div
              className="nav-user-initial"
              style={{
                width: 88, height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 32, fontWeight: 800,
                fontFamily: "inherit",
                flexShrink: 0,
              }}
            >
              {getInitial(user.name)}
            </div>
          )}
          <div className="profile-avatar-overlay">
            <Camera size={22} />
          </div>
        </label>

        <p className="profile-user-name">{user.name || "Người dùng"}</p>
        <p className="profile-user-email">{user.email}</p>

        {TAB_ITEMS.map(tab => (
          <button
            key={tab.key}
            className={"profile-nav-btn" + (activeTab === tab.key ? " active" : "")}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <button
          className="profile-nav-btn"
          style={{ color: "#ef4444", marginTop: "auto" }}
          onClick={() => { logout(); navigate("/") }}
        >
          <span className="nav-icon"><LogOut size={18} /></span>
          Đăng xuất
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="profile-main">

        {/* ─── TAB: THÔNG TIN CÁ NHÂN ─── */}
        {activeTab === "info" && (
          <>
            <h2 className="profile-section-title">Thông tin cá nhân</h2>
            <div className="profile-card">
              <form onSubmit={submitProfile}>
                <div className="profile-form-row">
                  <div className="pf-group">
                    <label>Họ và tên</label>
                    <input
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="pf-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="pf-group">
                    <label>Số điện thoại</label>
                    <input
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="0901 234 567"
                    />
                  </div>
                  <div className="pf-group">
                    <label>Địa chỉ</label>
                    <input
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      placeholder="Số nhà, đường, quận, thành phố"
                    />
                  </div>
                </div>

                <button type="submit" className="pf-save-btn" disabled={savingProfile}>
                  {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ─── TAB: ĐỔI MẬT KHẨU ─── */}
        {activeTab === "password" && (
          <>
            <h2 className="profile-section-title">Đổi mật khẩu</h2>
            <div className="profile-card">
              <form onSubmit={submitPassword}>
                <div className="profile-form-row single">
                  <div className="pf-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePwChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="pf-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePwChange}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                  </div>
                  <div className="pf-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePwChange}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                {pwError && <p className="pf-error">{pwError}</p>}

                <button type="submit" className="pf-save-btn" disabled={savingPw}>
                  {savingPw ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ─── TAB: ĐƠN HÀNG ─── */}
        {activeTab === "orders" && (
          <>
            <h2 className="profile-section-title">Lịch sử đơn hàng</h2>

            {ordersLoading ? (
              <div className="oh-loading">Đang tải đơn hàng...</div>
            ) : orders.length === 0 ? (
              <div className="oh-empty">
                <p style={{ marginBottom: 16 }}>Bạn chưa có đơn hàng nào.</p>
                <Link to="/">
                  <button className="pf-save-btn">Mua sắm ngay</button>
                </Link>
              </div>
            ) : (
              <div className="oh-tab-list">
                {orders.map(order => {
                  const status = STATUS_MAP[order.status] || STATUS_MAP.pending
                  const isOpen = expanded === order.id
                  return (
                    <div key={order.id} className="oh-card">
                      <div
                        className="oh-card-header"
                        onClick={() => setExpanded(isOpen ? null : order.id)}
                      >
                        <div className="oh-card-left">
                          <span className="oh-order-id">Đơn #{order.id}</span>
                          <span className="oh-order-date">
                            {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="oh-card-right">
                          <span
                            className="oh-status"
                            style={{ background: status.color + "20", color: status.color }}
                          >
                            {status.label}
                          </span>
                          <span className="oh-total">{formatVND(order.total)}</span>
                          <span className="oh-chevron">{isOpen ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="oh-card-body">
                          <div className="oh-info-row">
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14} /> {order.address || "—"}</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Phone size={14} /> {order.phone || "—"}</span>
                          </div>
                          <div className="oh-items">
                            {order.items?.map(item => (
                              <div key={item.id} className="oh-item">
                                {item.product && (
                                  <img src={formatImg(item.product.image || item.product.Image)} alt={item.product.name || item.product.Name} />
                                )}
                                <div className="oh-item-info">
                                  <p className="oh-item-name">
                                    {item.product?.name || item.product?.Name || "Sản phẩm"}
                                  </p>
                                  <p className="oh-item-meta">
                                    Size: {item.shoeSize ?? item.ShoeSize ?? "—"}
                                    {" · "}x{item.quantity} · {formatVND(item.price)}/đôi
                                  </p>
                                </div>
                                <span className="oh-item-total">
                                  {formatVND(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="oh-card-footer">
                            <span>Tổng cộng</span>
                            <span className="oh-grand-total">{formatVND(order.total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
