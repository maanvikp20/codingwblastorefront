'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
  { value: 'popular',    label: 'Most Liked' },
]

const CATEGORIES = ['all', 'figurines', 'tools', 'home', 'jewelry', 'art', 'mechanical', 'educational', 'cosplay', 'other']

export default function ProductsPage() {
  const router = useRouter()

  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const [search, setSearch]           = useState('')
  const [sort, setSort]               = useState('default')
  const [filterCat, setFilterCat]     = useState('all')
  const [filterFree, setFilterFree]   = useState('all') // 'all' | 'free' | 'paid'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res  = await fetch('/api/products?limit=100')
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        setAllProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const displayed = useMemo(() => {
    let list = [...allProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name?.toLowerCase().includes(q))
    }

    if (filterCat !== 'all')  list = list.filter(p => p.category === filterCat)
    if (filterFree === 'free') list = list.filter(p => p.price === 0)
    if (filterFree === 'paid') list = list.filter(p => p.price > 0)

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'popular':    list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0)); break
    }

    return list
  }, [allProducts, search, sort, filterCat, filterFree])

  const clearFilters = () => {
    setSearch('')
    setFilterCat('all')
    setFilterFree('all')
    setSort('default')
  }

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filterCat === c
                  ? 'bg-[#DC965A] text-[#242325]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {c === 'all' ? 'All Categories' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-3">Price</p>
        <div className="flex flex-col gap-1">
          {[['all', 'All'], ['free', 'Free Only'], ['paid', 'Paid Only']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilterFree(v)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterFree === v
                  ? 'bg-[#DC965A] text-[#242325]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="mt-2 text-xs text-white/30 hover:text-white/60 underline text-left transition-colors"
      >
        Clear all filters
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1a1919] flex flex-col">

      {/* Top bar */}
      <div className="bg-[#DC965A] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden bg-[#242325] text-[#BBB891] px-4 py-2 rounded-lg text-sm font-semibold"
        >
          ☰ Filters
        </button>

        {/* Search */}
        <div className="flex-1 flex items-center bg-[#242325] rounded-xl overflow-hidden max-w-xl">
          <span className="pl-4 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="pr-4 text-white/30 hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#242325] text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#DC965A] cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-1">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 bg-[#242325] border-r border-white/5 p-6">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 bg-[#242325] p-6 overflow-y-auto">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/40 hover:text-white mb-6 text-sm"
              >
                ✕ Close
              </button>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">

          {/* Count row */}
          {!loading && !error && (
            <p className="text-white/40 text-sm mb-5">
              {displayed.length} product{displayed.length !== 1 ? 's' : ''}
              {(filterCat !== 'all' || filterFree !== 'all' || search) && (
                <button
                  onClick={clearFilters}
                  className="ml-3 text-[#DC965A] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </p>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#242325] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/5" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="text-5xl">🔍</span>
              <h3 className="text-white font-bold text-xl">No products found</h3>
              <p className="text-white/40 text-sm">Try adjusting your search or filters.</p>
              <button
                onClick={clearFilters}
                className="bg-[#DC965A] text-[#242325] font-bold px-6 py-2.5 rounded-xl text-sm mt-2"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && displayed.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayed.map((p) => (
                <div
                  key={p._id}
                  onClick={() => router.push(`/products/${p._id}`)}
                  className="group bg-[#242325] border border-white/5 hover:border-[#DC965A]/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-[#2e2d2f] overflow-hidden">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10">
                        {p.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {p.featured && (
                      <span className="absolute top-2 left-2 bg-[#DC965A] text-[#242325] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                    {p.price === 0 && (
                      <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm leading-snug mb-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-white/40 text-xs mb-3 truncate">
                      {p.author?.name ?? 'Unknown'} · {p.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#DC965A] font-bold text-sm">
                        {p.price === 0 ? 'Free' : `$${p.price}`}
                      </span>
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        👍 {p.likes?.length ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}