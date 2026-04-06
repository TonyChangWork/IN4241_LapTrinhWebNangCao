import { useState, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import "./ProductReviews.css"

const MOCK_REVIEWS = [
  {
    id: 1,
    productId: 1,
    user: "Trương Hải",
    avatar: "https://ui-avatars.com/api/?name=Trương+Hải&background=111&color=fff",
    rating: 5,
    text: "Giày đi ôm chân cực kỳ, phối màu ngoài đời nhìn sắc nét và sang hơn trong ảnh rất nhiều! 10 điểm cho chất lượng.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
    date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 ngày trước
    likes: 12,
  },
  {
    id: 2,
    productId: 1,
    user: "Hoàng Oanh",
    avatar: "https://ui-avatars.com/api/?name=Hoàng+Oanh&background=f43f5e&color=fff",
    rating: 4,
    text: "Giao hàng chuẩn thời gian dự kiến. Box đôi xịn xò. Giày êm nhưng form hơi cứng lúc mới đi, chắc mang vài ngày mới mềm ra.",
    image: null,
    date: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 giờ trước
    likes: 4,
  },
]

function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSecs = Math.floor((now - date) / 1000)

  if (diffInSecs < 60) return "Vừa xong"
  const diffInMins = Math.floor(diffInSecs / 60)
  if (diffInMins < 60) return `${diffInMins} phút trước`
  const diffInHours = Math.floor(diffInMins / 60)
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} ngày trước`
  return date.toLocaleDateString("vi-VN")
}

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [sortBy, setSortBy] = useState("newest")
  const [likedReviews, setLikedReviews] = useState(new Set())

  // Form states
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  // Load reviews from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem(`reviews_${productId}`)
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
      // Dùng Mock ban đầu nếu là sp đầu tiên
      const initial = MOCK_REVIEWS.filter(r => String(r.productId) === String(productId))
      if (initial.length === 0 && Number(productId) === 1) {
          setReviews(MOCK_REVIEWS)
      } else {
          setReviews(initial)
      }
    }
  }, [productId])

  // Save changes automatically
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews))
    }
  }, [reviews, productId])

  // Compute aggregates
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0"

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => { if (starCounts[r.rating] !== undefined) starCounts[r.rating]++ })

  // Sorting
  const sortedReviews = useMemo(() => {
    const arr = [...reviews]
    if (sortBy === "newest") {
      arr.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === "highest") {
      arr.sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date))
    } else if (sortBy === "lowest") {
      arr.sort((a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date))
    }
    return arr
  }, [reviews, sortBy])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá nhé!")
      return
    }
    if (!text.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá!")
      return
    }

    const savedUser = JSON.parse(localStorage.getItem("user")) || { name: "Khách Vãng Lai" }

    const newReview = {
      id: Date.now(),
      productId: Number(productId),
      user: savedUser.name,
      avatar: `https://ui-avatars.com/api/?name=${savedUser.name.replace(" ", "+")}&background=random&color=fff`,
      rating,
      text,
      image: imagePreview,
      date: new Date().toISOString(),
      likes: 0,
    }

    setReviews([newReview, ...reviews])
    setRating(0)
    setText("")
    setImagePreview(null)
    toast.success("Đã đăng đánh giá thành công!")
  }

  const handleLike = (id) => {
    const hasLiked = likedReviews.has(id)
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, likes: hasLiked ? r.likes - 1 : r.likes + 1 } : r
    ))
    
    setLikedReviews(prev => {
      const next = new Set(prev)
      if (hasLiked) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="product-reviews-section">
      <h2 className="pr-title">Đánh giá sản phẩm</h2>

      {/* Summary Area */}
      <div className="pr-summary-card">
        <div className="pr-average">
          <div className="pr-score">{averageRating}</div>
          <div className="pr-score-stars">
            {"★".repeat(Math.round(Number(averageRating)))}{"☆".repeat(5 - Math.round(Number(averageRating)))}
          </div>
          <div className="pr-total-count">{totalReviews} bài đánh giá</div>
        </div>

        <div className="pr-bars">
          {[5, 4, 3, 2, 1].map(star => {
            const count = starCounts[star]
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            return (
              <div key={star} className="pr-bar-row">
                <span className="pr-star-num">{star} Sao</span>
                <div className="pr-bar-track">
                  <div className="pr-bar-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="pr-star-count">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Form Area */}
      <div className="pr-write-area">
        <h3>Viết đánh giá của bạn</h3>
        <div className="pr-form-rating">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              className={star <= (hoverRating || rating) ? "star-btn active" : "star-btn"}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
          <span className="pr-rating-text">
            {rating === 0 ? "Chọn đánh giá" : rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Tệ" : "Rất tệ"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="pr-form">
          <textarea
            placeholder="Bạn cảm thấy đôi Sneaker này như thế nào? (Chất lượng, độ êm, phối màu...)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          {/* Media preview */}
          {imagePreview && (
            <div className="pr-image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" className="pr-remove-img" onClick={removeImage}>✕</button>
            </div>
          )}

          <div className="pr-form-actions">
            <div className="pr-file-upload">
              <label htmlFor="review-img-upload" className="pr-upload-btn">
                <span>📸 Thêm ảnh / Video</span>
              </label>
              <input
                id="review-img-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <button type="submit" className="pr-submit-btn">Đăng đánh giá</button>
          </div>
        </form>
      </div>

      {/* List Toolbar */}
      <div className="pr-list-toolbar">
        <h4>Tất cả đánh giá</h4>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Mới nhất cực đỉnh</option>
          <option value="highest">Đánh giá cao (5 Sao)</option>
          <option value="lowest">Đánh giá thấp (1 Sao)</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="pr-list">
        {sortedReviews.length === 0 ? (
          <div className="pr-empty">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!</div>
        ) : (
          sortedReviews.map(review => (
            <div key={review.id} className="pr-card">
              <div className="pr-card-header">
                <img src={review.avatar} alt={review.user} className="pr-avatar" />
                <div className="pr-user-info">
                  <div className="pr-user-name">{review.user}</div>
                  <div className="pr-user-meta">
                    <span className="pr-card-stars">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="pr-dot">•</span>
                    <span className="pr-time">{timeAgo(review.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pr-card-body">
                <p>{review.text}</p>
                {review.image && (
                  <img src={review.image} alt="Review attachment" className="pr-attachment" />
                )}
              </div>

              <div className="pr-card-footer">
                <button 
                  className={`pr-like-btn ${likedReviews.has(review.id) ? "liked" : ""}`}
                  onClick={() => handleLike(review.id)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill={likedReviews.has(review.id) ? "currentColor" : "none"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>Hữu ích ({review.likes})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
