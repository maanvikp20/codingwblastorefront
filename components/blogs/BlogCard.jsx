'use client'
import { useRouter } from 'next/navigation'
import { FiEye } from 'react-icons/fi'

export default function BlogCard({ blog: b }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/blog/${b._id}`)}
      className="group cursor-pointer bg-[#242325] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="h-40 bg-[#2e2d2f] overflow-hidden">
        {b.coverImage ? (
          <img
            src={b.coverImage}
            alt={b.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/5">
            {b.title?.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#DC965A]/10 text-[#DC965A] text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border border-[#DC965A]/15">
            {b.category ?? 'general'}
          </span>
        </div>
        <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-[#DC965A] transition-colors line-clamp-2">
          {b.title}
        </h3>
        {b.excerpt && (
          <p className="text-white/40 text-sm line-clamp-2 mb-4 flex-1">{b.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-white/30 text-xs">{b.author?.name ?? 'Unknown'}</span>
          <div className="flex items-center gap-3 text-white/20 text-xs">
            <span className="flex items-center gap-1">
              <FiEye size={11} /> {b.views ?? 0}
            </span>
            {b.publishedAt && (
              <span>{new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}