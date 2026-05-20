"use client";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";

// Only for featured
export default function BlogFeaturedCard({ blog: b }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blog/${b._id}`)}
      className="group cursor-pointer bg-[#242325] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row transition-all duration-200"
    >
      <div className="md:w-2/5 h-52 md:h-auto bg-[#2e2d2f] overflow-hidden shrink-0">
        {b.coverImage ? (
          <img
            src={b.coverImage}
            alt={b.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/5">
            {b.title?.charAt(0)}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col justify-between p-7 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#DC965A]/15 text-[#DC965A] text-xs font-bold px-3 py-1 rounded-full capitalize border border-[#DC965A]/20">
              {b.category ?? "general"}
            </span>
            <span className="text-white/20 text-xs">Featured</span>
          </div>
          <h2 className="text-white font-black text-2xl leading-snug mb-3 group-hover:text-[#DC965A] transition-colors">
            {b.title}
          </h2>
          {b.excerpt && (
            <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
              {b.excerpt}
            </p>
          )}
        </div>

        {/* Author + views row */}
        {/* Something to fix later, rn doing 2 views a blog everytime visit */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {/* Author initial avatar */}
            <div className="w-7 h-7 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-xs font-bold">
              {b.author?.name?.charAt(0) ?? "?"}
            </div>
            <span className="text-white/40 text-xs">
              {b.author?.name ?? "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/25 text-xs">
            <span className="flex items-center gap-1">
              <FiEye size={11} /> {b.views ?? 0}
            </span>
            {b.publishedAt && (
              <span>
                {new Date(b.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
