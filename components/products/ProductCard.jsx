// components/ProductCard.jsx
'use client'
import { useRouter } from 'next/navigation'
import { FiStar, FiThumbsUp } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'

export default function ProductCard({ product: p }) {
  const router = useRouter()

  // Card click navigates to product page
  return (
    <div
      onClick={() => router.push(`/products/${p._id}`)}
      className="group bg-[#242325] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-[#2e2d2f] overflow-hidden">
        {p.thumbnail ? (
          <img
            src={p.thumbnail}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10">
            {p.name?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Featured badge, if featured */}
        {p.featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-[#DC965A] text-[#242325] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            <HiOutlineSparkles size={9} /> Featured
          </span>
        )}

        {/* Free Badge if free */}
        {p.price === 0 && (
          <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Free
          </span>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-0.5 truncate">
          {p.name}
        </h3>

        {/* Material */}
        {p.availableFilaments?.length > 0 && (
          <span className="inline-block text-[#BBB891] text-[11px] font-medium mb-2">
            {p.availableFilaments[0]}
          </span>
        )}

        {/* Rating */}
        {p.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <FiStar size={11} className="text-[#DC965A] fill-[#DC965A]" />
            <span className="text-white/50 text-xs">{p.rating?.toFixed(1)}</span>
          </div>
        )}

        {/* Price + view button */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-white font-bold text-base">
            {p.price === 0 ? (
              <span className="text-emerald-400">Free</span>
            ) : (
              `$${p.price.toFixed(2)}`
            )}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/products/${p._id}`) }}
            className="flex items-center gap-1.5 bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            + View
          </button>
        </div>

        {/* Likes row */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
          <FiThumbsUp size={11} className="text-white/25" />
          <span className="text-white/25 text-xs">{p.likes?.length ?? 0} likes</span>
          <span className="ml-auto text-white/20 text-[10px] capitalize">{p.category}</span>
        </div>
      </div>
    </div>
  )
}