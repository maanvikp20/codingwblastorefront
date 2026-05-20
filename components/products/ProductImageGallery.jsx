// components/ProductImageGallery.jsx
'use client'
import { useState } from 'react'

export default function ProductImageGallery({ images = [], productName, featured }) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {/* Big main image */}
      <div className="relative aspect-square bg-[#242325] rounded-2xl overflow-hidden border border-white/5">
        {images[activeImage] ? (
          <img src={images[activeImage]} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl font-black text-white/10">
            {productName?.charAt(0).toUpperCase()}
          </div>
        )}
        {featured && (
          <span className="absolute top-4 left-4 bg-[#DC965A] text-[#242325] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Small thumbnail row (only if more than one image) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                activeImage === i ? 'border-[#DC965A]' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}