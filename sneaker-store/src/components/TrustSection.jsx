import "./TrustSection.css"

import { ShieldCheck, RefreshCw, Rocket, Headset } from "lucide-react"

const features = [
  { icon: <ShieldCheck size={28} />, title: "Chính hãng 100%", desc: "Cam kết nguồn gốc rõ ràng" },
  { icon: <RefreshCw size={28} />, title: "7 Ngày đổi trả", desc: "Hỗ trợ đổi size linh hoạt" },
  { icon: <Rocket size={28} />, title: "Giao hàng nhanh", desc: "Ship COD toàn quốc 24h" },
  { icon: <Headset size={28} />, title: "Hỗ trợ 24/7", desc: "Tư vấn tận tâm mọi lúc" },
]

function TrustSection() {
  return (
    <div className="trust-section">
      {features.map((f, i) => (
        <div key={i} className="trust-item">
          <span className="trust-icon">{f.icon}</span>
          <div className="trust-text">
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrustSection
