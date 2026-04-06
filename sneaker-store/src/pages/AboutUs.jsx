import "./AboutUs.css"

function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Banner Space */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Về SneakerHub</h1>
          <p>Hành trình mang đam mê sneaker đến với mọi người.</p>
        </div>
      </div>

      {/* Story Content Space */}
      <div className="about-story-section">
        <div className="about-container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Câu Chuyện Của Chúng Tôi</h2>
              <p>
                SneakerHub ra đời từ niềm đam mê mãnh liệt với nền văn hóa sát mặt đất. 
                Chúng tôi hiểu rằng mỗi đôi giày không chỉ là phụ kiện để đi lại, mà còn là một câu chuyện, 
                là sự thể hiện cá tính và phong cách sống của người mang.
              </p>
              <p>
                Được thành lập vào năm 2024, SneakerHub nhanh chóng vươn lên thành một trong những điểm đến tin cậy nhất 
                cho cộng đồng yêu giày tại Việt Nam. Tại đây, bạn sẽ tìm thấy những phiên bản giới hạn, các bộ 
                sưu tập mới nhất từ các thương hiệu hàng đầu thế giới như Nike, Adidas, Jordan, và nhiều cái tên khác.
              </p>
              <h3>Sứ Mệnh</h3>
              <p>
                Chúng tôi không chỉ bán lẻ giày sneaker; SneakerHub mang sứ mệnh kết nối sự đam mê, nâng tầm trải nghiệm mua sắm và 
                cung cấp những sản phẩm chính hãng với dịch vụ tận tâm nhất từ những tín đồ sneaker thứ thiệt.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800" alt="Sneaker Store" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Promise Space */}
      <div className="about-promise">
        <h2>Cam Kết Từ SneakerHub</h2>
        <div className="promise-cards">
          <div className="promise-card">
            <h3>100% Chính Hãng</h3>
            <p>Mỗi sản phẩm đều qua quy trình kiểm định nghiêm ngặt trước khi đến tay bạn.</p>
          </div>
          <div className="promise-card">
            <h3>Tận Tâm Hỗ Trợ</h3>
            <p>Đội ngũ chăm sóc khách hàng nhiệt huyết, luôn sẵn sàng hỗ trợ 24/7.</p>
          </div>
          <div className="promise-card">
            <h3>Giao Hàng Tuyệt Đối Tốc Độ</h3>
            <p>Double box đóng gói cẩn thận, vận chuyển an toàn và nhanh chóng toàn quốc.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
