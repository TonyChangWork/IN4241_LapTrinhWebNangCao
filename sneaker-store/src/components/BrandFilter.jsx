import "./BrandFilter.css"

const brands = [
  {
    name: "All",
    logo: null,
    label: "Tất cả"
  },
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    label: "Nike"
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
    label: "Adidas"
  },
  {
    name: "Puma",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-Logo.png",
    label: "Puma"
  },
  {
    name: "Jordan",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/jordan-logo-png-transparent.png",
    label: "Jordan"
  }
]

function BrandFilter({ active, onChange }) {
  return (
    <div className="brand-filter-section">
      <h3 className="brand-filter-title">Shop by Brand</h3>
      <div className="brand-filter-grid">
        {brands.map(brand => (
          <button
            key={brand.name}
            className={`brand-card ${active === brand.name ? "active" : ""}`}
            onClick={() => onChange(brand.name)}
          >
            {brand.logo ? (
              <img src={brand.logo} alt={brand.label} className="brand-logo"/>
            ) : (
              <span className="brand-all-text">ALL</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BrandFilter
