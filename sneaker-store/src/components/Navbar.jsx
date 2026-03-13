import "./Navbar.css";
import { Link } from "react-router-dom"

function Navbar({ cartCount }) {
  return (
    <nav className='navbar'>
        <div className='navbar-logo'>
            SneakerHub
        </div>

        <ul className='nav-links'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Products</Link></li>
            <li><Link to="/">Brands</Link></li>
        </ul>

        <div className="nav-icons">
          <Link to="/cart" style={{ position:"relative", textDecoration:"none", fontSize:"22px" }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position:"absolute",
                top:"-8px",
                right:"-10px",
                background:"red",
                color:"white",
                borderRadius:"50%",
                width:"18px",
                height:"18px",
                fontSize:"11px",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontWeight:"bold"
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
    </nav>
  )
}

export default Navbar