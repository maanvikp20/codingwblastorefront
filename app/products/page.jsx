"use client";
import { useState, useEffect, useMemo } from "react";
import { FiGrid } from "react-icons/fi";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";

export default function ProductsPage() {

  // States for products and errors
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters and search
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [filterCat, setFilterCat] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=100"); // get products with limit of 100 for easier filtering, no pagination rn
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setAllProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // useMemo for easier and faster filtering and sorting without re-rendering whole list every time, unless fat update
  const displayed = useMemo(() => {
    let list = [...allProducts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }

    // Category filter
    if (filterCat !== "all")
      list = list.filter((p) => p.category === filterCat);

    // Price filter
    if (filterPrice === "free") list = list.filter((p) => p.price === 0);
    if (filterPrice === "paid") list = list.filter((p) => p.price > 0);
    if (filterPrice === "under5") list = list.filter((p) => p.price < 5);
    if (filterPrice === "under15") list = list.filter((p) => p.price < 15);
    if (filterPrice === "under30") list = list.filter((p) => p.price < 30);

    // Material filter
    if (filterMaterial !== "all") {
      list = list.filter((p) => p.availableFilaments?.includes(filterMaterial));
    }

    // Status filter
    if (filterStatus === "featured") list = list.filter((p) => p.featured);
    if (filterStatus === "free") list = list.filter((p) => p.price === 0);
    if (filterStatus === "rated")
      list = list.filter((p) => (p.rating ?? 0) >= 4);

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
        list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }

    return list;
  }, [
    allProducts,
    search,
    sort,
    filterCat,
    filterPrice,
    filterMaterial,
    filterStatus,
  ]);

  // Count of active filters for display in UI
  const activeFilterCount =
    [filterCat, filterPrice, filterMaterial, filterStatus].filter( // puts all filters in array and counts how many not "all"
      (v) => v !== "all",
    ).length + (search.trim() ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setFilterCat("all");
    setFilterPrice("all");
    setFilterMaterial("all");
    setFilterStatus("all");
    setSort("default");
  };

  return (
    <div className="min-h-screen bg-[#1a1919] flex flex-col">

      {/* Display filters and sorting options */}
      <ProductFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        filterMaterial={filterMaterial}
        setFilterMaterial={setFilterMaterial}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        activeFilterCount={activeFilterCount}
        onClear={clearFilters}
      />

      <main className="flex-1 px-6 py-6">
        {!loading && !error && (
          <p className="text-white/30 text-xs mb-5 flex items-center gap-2">
            <FiGrid size={11} />
            {displayed.length} product{displayed.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Loading stuff for card */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#242325] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-white/5" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        {/* Display when no products are found */}
        {!loading && !error && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <h3 className="text-white font-bold text-xl">No products found</h3>
            <p className="text-white/30 text-sm">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#DC965A] text-[#242325] font-bold px-6 py-2.5 rounded-xl text-sm mt-2 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
