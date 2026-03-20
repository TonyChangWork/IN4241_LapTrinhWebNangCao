import "./Footer.css"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2 className="footer-logo">SneakerHub</h2>
          <p className="footer-tagline">
            Điểm đến của những tín đồ sneaker.<br/>
            Chính hãng — Uy tín — Phong cách.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn">Facebook</a>
            <a href="#" className="social-btn">Instagram</a>
            <a href="#" className="social-btn">TikTok</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Sản phẩm</h4>
          <ul>
            <li><Link to="/">Nike</Link></li>
            <li><Link to="/">Adidas</Link></li>
            <li><Link to="/">Puma</Link></li>
            <li><Link to="/">Jordan</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><Link to="/">Hướng dẫn mua hàng</Link></li>
            <li><Link to="/">Chính sách đổi trả</Link></li>
            <li><Link to="/">Chính sách bảo mật</Link></li>
            <li><Link to="/">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Liên hệ</h4>
          <ul>
            <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
            <li>📞 0901 234 567</li>
            <li>✉️ support@sneakerhub.vn</li>
            <li>🕐 8:00 - 22:00, Thứ 2 - Chủ nhật</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 SneakerHub. All rights reserved.</p>
        <p>Thiết kế bởi <strong>SneakerHub Team</strong></p>
      </div>
    </footer>
  )
}

export default Footer
