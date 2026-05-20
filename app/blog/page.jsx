"use client";
import { useState, useEffect, useMemo } from "react";
import { FiMail } from "react-icons/fi";
import BlogSearchBar from "@/components/blogs/BlogSearchBar";
import BlogFeaturedCard from "@/components/blogs/BlogFeaturedCard";
import BlogCard from "@/components/blogs/BlogCard";

export default function BlogPage() {

  // set stes for blogs and all filters
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Get blogs with 50 limit just for easier filtering, no pagination rn so that why
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?limit=50");
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setAllBlogs(json.blogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // useMemo to filter blogs based on filter
  const displayed = useMemo(() => { // useMemo helps with large data fetching and filtering by using memoization or caching of filtered results so doesn't re-render every time
    let list = [...allBlogs];     // will get allblogs and then filter down based on search and category

    // Search filter and check if search is valid
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Category filter
    if (category !== "all") list = list.filter((b) => b.category === category);
    return list;
  }, [allBlogs, search, category]);

  // First post is featured
  const featured = displayed[0];
  const rest = displayed.slice(1);

  return (
    <div className="min-h-screen bg-[#1a1919]">
      {/* Header */}
      <div className="bg-[#242325] border-b border-white/5 px-6 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-2">
          From the team
        </p>
        <h1 className="text-white font-black text-4xl mb-3">The Blog</h1>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          Guides, roundups, and announcements from the 3D Print Store team.
        </p>
      </div>

      <BlogSearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Loading for blogs */}
        {loading && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#242325] rounded-2xl h-64 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#242325] rounded-2xl h-40 animate-pulse"
                />
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
            <FiMail size={48} className="text-white/10" />
            <h3 className="text-white font-bold text-xl">No posts found</h3>
            <p className="text-white/40 text-sm">
              Try a different search or category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="bg-[#DC965A] text-[#242325] font-bold px-6 py-2.5 rounded-xl text-sm mt-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Featured post */}
        {!loading && !error && featured && <BlogFeaturedCard blog={featured} />}

        {/* Rest of posts grid */}
        {!loading && !error && rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
