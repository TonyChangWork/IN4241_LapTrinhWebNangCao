import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Search, X, ShoppingCart, User, LogOut, KeyRound, Package } from "lucide-react"
import { formatVND } from "../utils/currency"
import { toast } from "react-hot-toast"
import { userService } from "../services/api"

function Navbar({ cartCount, user, logout, onSearch, products = [], onUserUpdated }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", avatarUrl: "" })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" })
  const profileRef = useRef(null)
  const navigate = useNavigate()

  const filtered = searchTerm.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : []

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
    setShowDropdown(true)
  }

  const handleSelect = (product) => {
    setSearchTerm("")
    onSearch("")
    setShowDropdown(false)
    setShowSearch(false)
    navigate(`/product/${product.id}`)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchTerm("")
      onSearch("")
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    if (!user) return
    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    })
  }, [user])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const getInitial = (name) => (name?.trim()?.[0] || "U").toUpperCase()

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submitProfile = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSavingProfile(true)
    try {
      const res = await userService.update(user.id, {
        name: profileForm.name,
        phone: profileForm.phone,
        avatarUrl: profileForm.avatarUrl,
      })
      const updatedUser = {
        ...user,
        name: res.data.name || profileForm.name,
        phone: res.data.phone || profileForm.phone,
        avatarUrl: res.data.avatarUrl || profileForm.avatarUrl,
      }
      onUserUpdated?.(updatedUser)
      toast.success("Đã cập nhật thông tin cá nhân.")
    } catch {
      toast.error("Không thể cập nhật thông tin.")
    } finally {
      setSavingProfile(false)
    }
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      toast.error("Vui lòng nhập đủ mật khẩu cũ và mới.")
      return
    }
    setSavingPassword(true)
    try {
      await userService.changePassword(user.id, passwordForm)
      setPasswordForm({ oldPassword: "", newPassword: "" })
      toast.success("Đổi mật khẩu thành công.")
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại.")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>SneakerHub</div>

      <ul className='nav-links'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/">Products</Link></li>
        <li><Link to="/">Brands</Link></li>
      </ul>

      <div className="nav-icons">

        <div className="nav-search-wrap">
          {showSearch && (
            <input
              type="text"
              className="nav-search-input"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={handleSearch}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              autoFocus
            />
          )}

          {showSearch && showDropdown && filtered.length > 0 && (
            <div className="search-dropdown">
              {filtered.map(product => (
                <div
                  key={product.id}
                  className="search-dropdown-item"
                  onMouseDown={() => handleSelect(product)}
                >
                  <img src={product.image} alt={product.name}/>
                  <div>
                    <p className="dropdown-name">{product.name}</p>
                    <p className="dropdown-brand">{product.brand} • {formatVND(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="nav-search-btn" onClick={toggleSearch}>
            {showSearch
              ? <X size={20} strokeWidth={2}/>
              : <Search size={20} strokeWidth={2}/>
            }
          </button>
        </div>

        <Link to="/cart" className="nav-cart-btn">
          <ShoppingCart size={22} strokeWidth={2}/>
          {cartCount > 0 && (
            <span className="nav-cart-badge">{cartCount}</span>
          )}
        </Link>

        {user ? (
          <div className="nav-user-menu" ref={profileRef}>
            <button className="nav-user-trigger" onClick={() => setProfileOpen((prev) => !prev)}>
              {profileForm.avatarUrl ? (
                <img src={profileForm.avatarUrl} alt={user.name} className="nav-user-avatar" />
              ) : (
                <span className="nav-user-initial">{getInitial(user.name)}</span>
              )}
              <span className="nav-username">{user.name}</span>
            </button>

            {profileOpen && (
              <div className="nav-user-dropdown">
                <div className="nav-user-head">
                  {profileForm.avatarUrl ? (
                    <img src={profileForm.avatarUrl} alt={user.name} className="nav-user-avatar lg" />
                  ) : (
                    <span className="nav-user-initial lg">{getInitial(user.name)}</span>
                  )}
                  <div>
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                </div>

                <div className="profile-tabs">
                  <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
                    <User size={14} />
                    Cá nhân
                  </button>
                  <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
                    <KeyRound size={14} />
                    Mật khẩu
                  </button>
                </div>

                {activeTab === "info" ? (
                  <form className="profile-form" onSubmit={submitProfile}>
                    <label>Tên hiển thị</label>
                    <input name="name" value={profileForm.name} onChange={handleProfileChange} />
                    <label>Số điện thoại</label>
                    <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="0901xxxxxx" />
                    <label>Link avatar</label>
                    <input name="avatarUrl" value={profileForm.avatarUrl} onChange={handleProfileChange} placeholder="https://..." />
                    <button type="submit" disabled={savingProfile}>
                      {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
                    </button>
                  </form>
                ) : (
                  <form className="profile-form" onSubmit={submitPassword}>
                    <label>Mật khẩu cũ</label>
                    <input type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} />
                    <label>Mật khẩu mới</label>
                    <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                    <button type="submit" disabled={savingPassword}>
                      {savingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                    </button>
                  </form>
                )}

                <div className="dropdown-actions">
                  <Link to="/orders" className="nav-orders-btn" onClick={() => setProfileOpen(false)}>
                    <Package size={14} />
                    Đơn hàng
                  </Link>
                  <button className="nav-logout-btn" onClick={logout}>
                    <LogOut size={15} strokeWidth={2} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-login-btn">Đăng nhập</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar