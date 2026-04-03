import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Hero.css"

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
    title: "Bộ sưu tập mới",
    subtitle: "Sneaker hot nhất mùa này — tôn dáng, êm chân, đậm chất street.",
  },
  {
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=80",
    title: "Flash Sale",
    subtitle: "Giảm sâu đến 40% — chỉ trong thời gian có hạn.",
  },
  {
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80",
    title: "Giày thể thao chính hãng",
    subtitle: "Cam kết authentic — giao nhanh, đổi trả trong 30 ngày.",
  },
  {
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&q=80",
    title: "Limited drop",
    subtitle: "Mẫu collab giới hạn — số lượng có hạn, săn ngay kẻo lỡ.",
  },
]

function Hero() {
  const [index, setIndex] = useState(0)
  const n = SLIDES.length

  const goPrev = () => setIndex((i) => (i - 1 + n) % n)
  const goNext = () => setIndex((i) => (i + 1) % n)

  return (
    <section className="hero-slider" aria-roledescription="carousel">
      <div
        className="hero-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="hero-slide"
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={i !== index}
          >
            <div className="hero-slide-overlay" />
            <div className="hero-text">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <a href="#all-products" className="shop-btn">
                Khám phá ngay
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hero-arrow hero-arrow-prev"
        onClick={goPrev}
        aria-label="Slide trước"
      >
        <ChevronLeft size={28} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow-next"
        onClick={goNext}
        aria-label="Slide sau"
      >
        <ChevronRight size={28} strokeWidth={2.2} />
      </button>

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
