"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiArrowLeft } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function BlogPostPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  // set useStates for all data passed
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  // Fetch blog post data
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setBlog(json.blog);
        setLikeCount(json.blog.likes?.length ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle like and Unlike
  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/blogs/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLikeCount(data.likes);
        setLiked((prev) => !prev);
      }
    } finally {
      setLiking(false);
    }
  };

  // Lil Loading
  if (loading)
    return (
      <div className="min-h-screen bg-[#1a1919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#DC965A] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading post...</p>
        </div>
      </div>
    );

  // Error or no blogs
  if (error || !blog)
    return (
      <div className="min-h-screen bg-[#1a1919] flex items-center justify-center text-center">
        <div>
          <p className="text-red-400 mb-4">{error ?? "Post not found"}</p>
          <button
            onClick={() => router.push("/blog")}
            className="text-[#DC965A] underline text-sm"
          >
            Back to blog
          </button>
        </div>
      </div>
    );

  // Main return with blog content
  return (
    <div className="min-h-screen bg-[#1a1919]">
      <div className="bg-[#242325] border-b border-white/5 px-6 py-3 flex items-center gap-2 text-sm">
        <button
          onClick={() => router.push("/blog")}
          className="text-[#DC965A] hover:underline"
        >
          Blog
        </button>
        <span className="text-white/20">/</span>
        <span className="text-white/50 truncate max-w-xs">{blog.title}</span>
      </div>

      {blog.coverImage && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {blog.category && (
            <span className="bg-[#DC965A]/15 text-[#DC965A] text-xs font-bold px-3 py-1 rounded-full capitalize border border-[#DC965A]/20">
              {blog.category}
            </span>
          )}
          {blog.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-white/5 text-white/40 text-xs px-3 py-1 rounded-full border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-white font-black text-3xl md:text-4xl leading-tight mb-5">
          {blog.title}
        </h1>

        {/* Author + view count row */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3">
            {/* Author avatar, very coolio*/}
            <div className="w-9 h-9 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] font-bold text-sm">
              {blog.author?.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                {blog.author?.name ?? "Unknown"}
              </p>
              {blog.publishedAt && (
                <p className="text-white/30 text-xs">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-white/30 text-sm">
            <FiEye size={13} /> {blog.views ?? 0} views
          </span>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-[#BBB891] text-lg leading-relaxed italic border-l-4 border-[#DC965A] pl-5 mb-8">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="text-white/75 text-base leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>

        {/* Like and Back */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer disabled:opacity-40 ${
              liked
                ? "bg-[#DC965A] border-[#DC965A] text-[#242325]"
                : "bg-transparent border-white/10 text-white/60 hover:border-[#DC965A]/50 hover:text-white"
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            {liking ? "..." : likeCount} {likeCount === 1 ? "like" : "likes"}
          </button>

          <button
            onClick={() => router.push("/blog")}
            className="flex items-center gap-1.5 text-white/30 hover:text-white text-sm transition-colors underline underline-offset-4"
          >
            <FiArrowLeft size={13} /> All posts
          </button>
        </div>
      </div>
    </div>
  );
}
