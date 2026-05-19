'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['all', 'guides', 'roundups', 'announcements', 'other']

export default function BlogPage() {
  const router = useRouter()

  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res  = await fetch('/api/blogs?limit=50')
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        setAllBlogs(json.blogs)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const displayed = useMemo(() => {
    let list = [...allBlogs]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (category !== 'all') list = list.filter(b => b.category === category)
    return list
  }, [allBlogs, search, category])

  const featured = displayed[0]
  const rest      = displayed.slice(1)

  return (
    <div className="min-h-screen bg-[#1a1919]">

      {/* Header */}
      <div className="bg-[#242325] border-b border-white/5 px-6 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-2">From the team</p>
        <h1 className="text-white font-black text-4xl mb-3">The Blog</h1>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          Guides, roundups, and announcements from the 3D Print Store team.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="bg-[#DC965A] px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center bg-[#242325] rounded-xl overflow-hidden max-w-lg">
          <span className="pl-4 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="pr-4 text-white/30 hover:text-white text-sm">
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                category === c
                  ? 'bg-[#242325] text-[#DC965A]'
                  : 'bg-[#242325]/50 text-white/60 hover:text-white'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#242325] rounded-2xl h-64 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#242325] rounded-2xl h-40 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-center py-20">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-5xl">📭</span>
            <h3 className="text-white font-bold text-xl">No posts found</h3>
            <p className="text-white/40 text-sm">Try a different search or category.</p>
            <button
              onClick={() => { setSearch(''); setCategory('all') }}
              className="bg-[#DC965A] text-[#242325] font-bold px-6 py-2.5 rounded-xl text-sm mt-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Featured post (first result) */}
        {!loading && !error && featured && (
          <div
            onClick={() => router.push(`/blog/${featured._id}`)}
            className="group cursor-pointer bg-[#242325] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row transition-all duration-200"
          >
            {/* Cover image */}
            <div className="md:w-2/5 h-52 md:h-auto bg-[#2e2d2f] overflow-hidden shrink-0">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/5">
                  {featured.title?.charAt(0)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-7 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#DC965A]/15 text-[#DC965A] text-xs font-bold px-3 py-1 rounded-full capitalize border border-[#DC965A]/20">
                    {featured.category ?? 'general'}
                  </span>
                  <span className="text-white/20 text-xs">Featured</span>
                </div>
                <h2 className="text-white font-black text-2xl leading-snug mb-3 group-hover:text-[#DC965A] transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-xs font-bold">
                    {featured.author?.name?.charAt(0) ?? '?'}
                  </div>
                  <span className="text-white/40 text-xs">{featured.author?.name ?? 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-4 text-white/25 text-xs">
                  <span>👁 {featured.views ?? 0}</span>
                  {featured.publishedAt && (
                    <span>{new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of posts grid */}
        {!loading && !error && rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((b) => (
              <div
                key={b._id}
                onClick={() => router.push(`/blog/${b._id}`)}
                className="group cursor-pointer bg-[#242325] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
              >
                {/* Cover */}
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

                {/* Content */}
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
                    <p className="text-white/40 text-sm line-clamp-2 mb-4 flex-1">
                      {b.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-white/30 text-xs">{b.author?.name ?? 'Unknown'}</span>
                    <div className="flex items-center gap-3 text-white/20 text-xs">
                      <span>👁 {b.views ?? 0}</span>
                      {b.publishedAt && (
                        <span>{new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}