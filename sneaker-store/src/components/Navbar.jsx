import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Search, X, ShoppingCart, User, LogOut } from "lucide-react"
import { formatVND } from "../utils/currency"

function Navbar({ cartCount, user, logout, onSearch, products = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
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
          <div className="nav-user">
            <User size={16} strokeWidth={2}/>
            <span className="nav-username">{user.name}</span>
            <Link to="/orders" className="nav-orders-btn">Đơn hàng</Link>
            <button className="nav-logout-btn" onClick={logout}>
              <LogOut size={15} strokeWidth={2}/>
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-login-btn">Đăng nhập</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar