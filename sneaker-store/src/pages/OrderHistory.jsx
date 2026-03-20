import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { formatVND } from "../utils/currency"
import "./OrderHistory.css"

const API_URL = "https://localhost:7178"

const STATUS_MAP = {
  pending:    { label: "Chờ xác nhận", color: "#f59e0b" },
  confirmed:  { label: "Đã xác nhận",  color: "#3b82f6" },
  shipping:   { label: "Đang giao",    color: "#8b5cf6" },
  delivered:  { label: "Đã giao",      color: "#22c55e" },
  cancelled:  { label: "Đã huỷ",       color: "#ef4444" },
}

function OrderHistory({ user }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    axios.get(`${API_URL}/api/orders/user/${user.id}`)
      .then(res => { setOrders(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return <div className="oh-loading">Đang tải đơn hàng...</div>

  return (
    <div className="oh-page">
      <h2 className="oh-title">Lịch sử đơn hàng</h2>

      {orders.length === 0 ? (
        <div className="oh-empty">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/"><button className="oh-shop-btn">Mua sắm ngay</button></Link>
        </div>
      ) : (
        <div className="oh-list">
          {orders.map(order => {
            const status = STATUS_MAP[order.status] || STATUS_MAP.pending
            const isOpen = expanded === order.id

            return (
              <div key={order.id} className="oh-card">
                <div className="oh-card-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className="oh-card-left">
                    <span className="oh-order-id">Đơn #{order.id}</span>
                    <span className="oh-order-date">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="oh-card-right">
                    <span className="oh-status" style={{ background: status.color + "20", color: status.color }}>
                      {status.label}
                    </span>
                    <span className="oh-total">{formatVND(order.total)}</span>
                    <span className="oh-chevron">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="oh-card-body">
                    <div className="oh-info-row">
                      <span>📍 {order.address}</span>
                      <span>📞 {order.phone}</span>
                    </div>

                    <div className="oh-items">
                      {order.items?.map(item => (
                        <div key={item.id} className="oh-item">
                          {item.product && (
                            <img src={item.product.image} alt={item.product.name}/>
                          )}
                          <div className="oh-item-info">
                            <p className="oh-item-name">{item.product?.name || "Sản phẩm"}</p>
                            <p className="oh-item-meta">x{item.quantity} • {formatVND(item.price)}/đôi</p>
                          </div>
                          <span className="oh-item-total">{formatVND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="oh-card-footer">
                      <span>Tổng cộng</span>
                      <span className="oh-grand-total">{formatVND(order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
