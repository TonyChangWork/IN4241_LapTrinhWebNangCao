import "./CategoryList.css"

const cats = [
  { name: "Nike", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { name: "Adidas", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
  { name: "Jordan", img: "https://images.unsplash.com/photo-1597045566774-bf1929c09335?w=400" },
  { name: "Converse", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400" },
]

function CategoryList({ onSelect }) {
  return (
    <div className="cat-section">
      <h2 className="section-title">Shop by Brand</h2>
      <div className="cat-list">
        {cats.map((cat, i) => (
          <div key={i} className="cat-card" onClick={() => onSelect(cat.name)}>
            <img src={cat.img} alt={cat.name} />
            <div className="cat-overlay">
              <h3>{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
