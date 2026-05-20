'use client'
import { FiSearch, FiX } from 'react-icons/fi'

// Categories for filters, can add more later
const CATEGORIES = ['all', 'guides', 'roundups', 'announcements', 'other']

export default function BlogSearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div className="bg-[#DC965A] px-6 py-3 flex items-center gap-3 flex-wrap">
      {/* Search input */}
      <div className="flex-1 min-w-[200px] flex items-center bg-[#242325] rounded-xl overflow-hidden max-w-lg">
        <span className="pl-4 text-white/30"><FiSearch size={14} /></span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // onChange triggers when user types, updating search
          placeholder="Search posts..."
          className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="pr-4 text-white/30 hover:text-white transition-colors">
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Category Filters */}
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
  )
}