import "./Navbar.css";
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className='navbar'>
        <div className='navbar-logo'>
            SneakerHub
        </div>

        <ul className='nav-links'>
            <li>Home</li>
            <li>Products</li>
            <li>Brands</li>
            <li>Contact</li>
        </ul>

        <div className="nav-icons">
        🔍
        🛒
      </div>
      <Link to="/cart">Cart</Link>
    </nav>
  )
}

export default Navbar