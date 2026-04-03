import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Hero.css"

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
    badge: "NEW SEASON",
    title: "Bộ sưu tập mới",
    subtitle: "Sneaker hot nhất mùa này — tôn dáng, êm chân, đậm chất street.",
    cta: "Khám phá ngay",
    accent: "#fff",
  },
  {
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=80",
    badge: "FLASH SALE",
    title: "Giảm sâu đến 40%",
    subtitle: "Ưu đãi cực lớn — chỉ trong thời gian có hạn. Đừng bỏ lỡ!",
    cta: "Săn sale ngay",
    accent: "#f87171",
  },
  {
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80",
    badge: "AUTHENTIC",
    title: "Giày thể thao chính hãng",
    subtitle: "Cam kết 100% authentic — giao nhanh toàn quốc, đổi trả 30 ngày.",
    cta: "Mua ngay",
    accent: "#34d399",
  },
  {
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&q=80",
    badge: "LIMITED DROP",
    title: "Collab giới hạn",
    subtitle: "Mẫu collab siêu hiếm — số lượng cực ít, săn ngay kẻo lỡ.",
    cta: "Xem bộ sưu tập",
    accent: "#a78bfa",
  },
]

const AUTO_PLAY_INTERVAL = 5000

function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = SLIDES.length

  const goNext = useCallback(() => setIndex(i => (i + 1) % n), [n])
  const goPrev = useCallback(() => setIndex(i => (i - 1 + n) % n), [n])

  // Auto-play every 5s, pause on hover
  useEffect(() => {
    if (paused) return
    const timer = setInterval(goNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [goNext, paused])

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — stacked absolutely, fade in/out */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={"hero-slide" + (i === index ? " active" : "")}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={i !== index}
        >
          <div className="hero-slide-overlay" />
          <div className="hero-text">
            <span className="hero-badge" style={{ color: slide.accent, borderColor: slide.accent }}>
              {slide.badge}
            </span>
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <a href="#all-products" className="shop-btn">
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      {/* Progress bar */}
      <div className="hero-progress-wrap">
        <div
          key={index}
          className="hero-progress-bar"
          style={{ animationDuration: paused ? "0ms" : `${AUTO_PLAY_INTERVAL}ms` }}
        />
      </div>

      {/* Arrows */}
      <button type="button" className="hero-arrow hero-arrow-prev" onClick={goPrev} aria-label="Slide trước">
        <ChevronLeft size={28} strokeWidth={2.2} />
      </button>
      <button type="button" className="hero-arrow hero-arrow-next" onClick={goNext} aria-label="Slide sau">
        <ChevronRight size={28} strokeWidth={2.2} />
      </button>

      {/* Dots */}
      <div className="hero-dashes" role="tablist" aria-label="Chọn slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={"hero-dash" + (i === index ? " active" : "")}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
