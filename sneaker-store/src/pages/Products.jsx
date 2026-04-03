import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Filter, X, ChevronDown } from "lucide-react"
import ProductCard from "../components/ProductCard"
import "./Products.css"

/* ─── Static filter options ─── */
const CATEGORIES = ["Sneaker", "Running", "Basketball", "Jordan", "Slip-on"]
const BRANDS = ["Nike", "Adidas", "Puma", "Jordan", "New Balance", "Converse", "Vans"]
const GENDERS = ["Nam", "Nữ", "Unisex"]
const SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]

const PRICE_RANGES = [
  { id: "p1", label: "Dưới 2.000.000đ", min: 0, max: 2000000 },
  { id: "p2", label: "2.000.000đ - 5.000.000đ", min: 2000000, max: 5000000 },
  { id: "p3", label: "5.000.000đ - 10.000.000đ", min: 5000000, max: 10000000 },
  { id: "p4", label: "Trên 10.000.000đ", min: 10000000, max: 999999999 },
]

const SORTS = [
  { id: "default", label: "Sắp xếp: Mặc định" },
  { id: "price-asc", label: "Giá: Thấp đến Cao" },
  { id: "price-desc", label: "Giá: Cao đến Thấp" },
  { id: "newest", label: "Mới nhất" },
  { id: "bestselling", label: "Bán chạy nhất" },
]

function Products({ products = [] }) {
  // Mobile sidebar state
  const [showFilters, setShowFilters] = useState(false)

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedGenders, setSelectedGenders] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedPrice, setSelectedPrice] = useState(null)
  
  // Sort State
  const [sortParam, setSortParam] = useState("default")

  // Pagination
  const [visibleCount, setVisibleCount] = useState(12)

  // Toggle helpers
  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item))
    else setArray([...array, item])
    setVisibleCount(12) // reset pagination when filter changes
  }

  // Derived / Filtered list
  const filteredProducts = useMemo(() => {
    let list = [...products]

    // Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter(p => p.brand && selectedBrands.some(b => b.toLowerCase() === p.brand.toLowerCase()))
    }

    // Since our DB doesn't have Category/Gender/Size natively mapped perfectly, 
    // we use mock grouping or rely on title tags if present.
    if (selectedCategories.length > 0) {
      list = list.filter(p => {
        // mock logic: if product name contains category name
        return selectedCategories.some(c => p.name.toLowerCase().includes(c.toLowerCase()) || p.brand?.toLowerCase().includes(c.toLowerCase()))
      })
    }

    // Price filter
    if (selectedPrice) {
      const range = PRICE_RANGES.find(r => r.id === selectedPrice)
      if (range) {
        list = list.filter(p => p.price >= range.min && p.price < range.max)
      }
    }

    // Size + Gender is not fully typed in `products`, simulating a filter bypass if empty
    // If selected, just let them pass or do a basic string match (in real world requires DB support)

    // Sort
    if (sortParam === "price-asc") list.sort((a, b) => a.price - b.price)
    else if (sortParam === "price-desc") list.sort((a, b) => b.price - a.price)
    else if (sortParam === "newest") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (sortParam === "bestselling") list.sort((a, b) => b.price - a.price) // mocked best selling

    return list
  }, [products, selectedBrands, selectedCategories, selectedPrice, sortParam, selectedGenders, selectedSizes])

  const paginatedProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12)
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setSelectedGenders([])
    setSelectedSizes([])
    setSelectedPrice(null)
    setSortParam("default")
  }

  const actFilterCount = selectedBrands.length + selectedCategories.length + selectedGenders.length + selectedSizes.length + (selectedPrice ? 1 : 0)

  return (
    <div className="products-page">
      {/* ── Breadcrumb ── */}
      <div className="prd-breadcrumb">
        <Link to="/">Home</Link>
        <span className="prd-breadcrumb-sep">/</span>
        <span className="prd-breadcrumb-current">Products</span>
      </div>

      <div className="prd-container">
        
        {/* ── Sidebar Filters (Desktop & Mobile Drawer) ── */}
        <aside className={`prd-sidebar ${showFilters ? "show" : ""}`}>
          <div className="prd-sidebar-header">
            <h3>Bộ lọc</h3>
            <button className="prd-close-filter" onClick={() => setShowFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="prd-sidebar-content">
            
            {actFilterCount > 0 && (
              <div className="prd-filter-clear">
                <span>Đang áp dụng {actFilterCount} bộ lọc</span>
                <button onClick={clearFilters}>Xóa tất cả</button>
              </div>
            )}

            {/* Price Filter */}
            <div className="prd-filter-group">
              <h4 className="prd-filter-title">Theo giá <ChevronDown size={16} /></h4>
              <div className="prd-filter-options">
                {PRICE_RANGES.map(range => (
                  <label key={range.id} className="prd-checkbox">
                    <input 
                      type="radio" 
                      name="priceRange"
                      checked={selectedPrice === range.id}
                      onChange={() => {
                        setSelectedPrice(range.id === selectedPrice ? null : range.id)
                        setVisibleCount(12)
                      }}
                    />
                    <span className="prd-checkbox-box" style={{ borderRadius: '50%' }}></span>
                    <span className="prd-checkbox-label">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="prd-filter-group">
              <h4 className="prd-filter-title">Thương hiệu <ChevronDown size={16} /></h4>
              <div className="prd-filter-options">
                {BRANDS.map(brand => (
                  <label key={brand} className="prd-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleArrayItem(selectedBrands, setSelectedBrands, brand)}
                    />
                    <span className="prd-checkbox-box"></span>
                    <span className="prd-checkbox-label">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type/Category Filter */}
            <div className="prd-filter-group">
              <h4 className="prd-filter-title">Loại giày <ChevronDown size={16} /></h4>
              <div className="prd-filter-options">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="prd-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleArrayItem(selectedCategories, setSelectedCategories, cat)}
                    />
                    <span className="prd-checkbox-box"></span>
                    <span className="prd-checkbox-label">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="prd-filter-group">
              <h4 className="prd-filter-title">Giới tính <ChevronDown size={16} /></h4>
              <div className="prd-filter-options">
                {GENDERS.map(gen => (
                  <label key={gen} className="prd-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedGenders.includes(gen)}
                      onChange={() => toggleArrayItem(selectedGenders, setSelectedGenders, gen)}
                    />
                    <span className="prd-checkbox-box"></span>
                    <span className="prd-checkbox-label">{gen}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="prd-filter-group">
              <h4 className="prd-filter-title">Kích cỡ <ChevronDown size={16} /></h4>
              <div className="prd-size-grid">
                {SIZES.map(size => (
                  <button 
                    key={size}
                    className={`prd-size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => toggleArrayItem(selectedSizes, setSelectedSizes, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {showFilters && (
          <div className="prd-sidebar-overlay" onClick={() => setShowFilters(false)}></div>
        )}

        {/* ── Main Content Grid ── */}
        <main className="prd-main">
          {/* Top Bar: Title & Sort */}
          <div className="prd-topbar">
            <h1 className="prd-title">Tất cả sản phẩm ({filteredProducts.length})</h1>
            
            <div className="prd-actions">
              <button className="prd-filter-toggle" onClick={() => setShowFilters(true)}>
                <Filter size={18} /> Bộ lọc {actFilterCount > 0 && <span className="prd-badge">{actFilterCount}</span>}
              </button>
              
              <div className="prd-sort">
                <select 
                  value={sortParam} 
                  onChange={e => {
                    setSortParam(e.target.value)
                    setVisibleCount(12)
                  }}
                >
                  {SORTS.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="prd-empty-state">
              <div className="prd-empty-icon">👟</div>
              <h2>Không tìm thấy sản phẩm!</h2>
              <p>Rất tiếc, chưa có sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              <button className="prd-empty-btn" onClick={clearFilters}>Xóa bộ lọc</button>
            </div>
          ) : (
            <>
              <div className="prd-grid">
                {paginatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="prd-load-more">
                  <p>Hiển thị {paginatedProducts.length} trên tổng {filteredProducts.length} sản phẩm</p>
                  <div className="prd-progress-line">
                    <div 
                      className="prd-progress-fill" 
                      style={{ width: `${(paginatedProducts.length / filteredProducts.length) * 100}%` }}
                    />
                  </div>
                  <button className="prd-btn-load" onClick={handleLoadMore}>
                    Tải thêm hàng
                  </button>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default Products
