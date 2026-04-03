import "./PromoBanner.css"

function PromoBanner({ title, subtitle, btnText, color = "#ff4d4f" }) {
  return (
    <div className="promo-banner" style={{ background: color }}>
      <div className="promo-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <button>{btnText}</button>
      </div>
    </div>
  )
}

export default PromoBanner
