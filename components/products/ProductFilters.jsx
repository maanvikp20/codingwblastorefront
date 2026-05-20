'use client'
import { FiSearch, FiX, FiSliders, FiGrid, FiDollarSign, FiLayers, FiFilter } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import FilterDropdown from '@/components/products/FilterDropdown'

// Options for filters and sorting
const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
  { value: 'popular',    label: 'Most Liked' },
  { value: 'rating',     label: 'Top Rated' },
]

// Categories to filter from
const CATEGORIES = [
  { value: 'all',         label: 'All Categories' },
  { value: 'figurines',   label: 'Figurines' },
  { value: 'tools',       label: 'Tools' },
  { value: 'home',        label: 'Home' },
  { value: 'jewelry',     label: 'Jewelry' },
  { value: 'art',         label: 'Art' },
  { value: 'mechanical',  label: 'Mechanical' },
  { value: 'educational', label: 'Educational' },
  { value: 'cosplay',     label: 'Cosplay' },
  { value: 'other',       label: 'Other' },
]

// Price range to filter
const PRICE_OPTIONS = [
  { value: 'all',     label: 'All Prices' },
  { value: 'free',    label: 'Free Only' },
  { value: 'paid',    label: 'Paid Only' },
  { value: 'under5',  label: 'Under $5' },
  { value: 'under15', label: 'Under $15' },
  { value: 'under30', label: 'Under $30' },
]

// Filament/material options to filter by
const FILAMENT_OPTIONS = [
  { value: 'all',   label: 'All Materials' },
  { value: 'PLA',   label: 'PLA' },
  { value: 'PETG',  label: 'PETG' },
  { value: 'ABS',   label: 'ABS' },
  { value: 'TPU',   label: 'TPU' },
  { value: 'Resin', label: 'Resin' },
]

// Status filters for featured, free, and top rated
const STATUS_OPTIONS = [
  { value: 'all',      label: 'All Items' },
  { value: 'featured', label: 'Featured' },
  { value: 'free',     label: 'Free' },
  { value: 'rated',    label: 'Top Rated (4+★)' },
]

// Recieves all filter and sort states from products
export default function ProductFilters({
  search, setSearch,
  sort, setSort,
  filterCat, setFilterCat,
  filterPrice, setFilterPrice,
  filterMaterial, setFilterMaterial,
  filterStatus, setFilterStatus,
  activeFilterCount,
  onClear,
}) {
  return (
    <div className="bg-[#242325] border-b border-white/5 px-6 py-4">

      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-3">
        {/* Search */}
        <div className="flex-1 flex items-center bg-[#1a1919] border border-white/10 rounded-xl overflow-hidden max-w-lg focus-within:border-[#DC965A]/50 transition-colors">
          <span className="pl-4 text-white/30"><FiSearch size={15} /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="pr-4 text-white/30 hover:text-white transition-colors">
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <FilterDropdown
          icon={FiSliders}
          label="Sort"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />

        {/* filter count */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <FiX size={12} />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter Boxes */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/25 text-xs flex items-center gap-1.5 mr-1">
          <FiFilter size={11} /> Filters
        </span>
        <FilterDropdown
          icon={FiGrid}
          label="Category"
          options={CATEGORIES}
          value={filterCat}
          onChange={setFilterCat}
        />
        <FilterDropdown
          icon={FiDollarSign}
          label="Price"
          options={PRICE_OPTIONS}
          value={filterPrice}
          onChange={setFilterPrice}
        />
        <FilterDropdown
          icon={FiLayers}
          label="Material"
          options={FILAMENT_OPTIONS}
          value={filterMaterial}
          onChange={setFilterMaterial}
        />
        <FilterDropdown
          icon={HiOutlineSparkles}
          label="Status"
          options={STATUS_OPTIONS}
          value={filterStatus}
          onChange={setFilterStatus}
        />
      </div>
    </div>
  )
}