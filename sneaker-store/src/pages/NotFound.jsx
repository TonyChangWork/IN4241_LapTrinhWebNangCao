import { Link } from "react-router-dom"
import "./NotFound.css"

function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-content">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Trang không tồn tại</h2>
        <p className="nf-desc">Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc không tồn tại.</p>
        <Link to="/">
          <button className="nf-btn">Về trang chủ</button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
