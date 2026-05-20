"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaThumbsUp, FaThumbsDown, FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ReviewForm from "@/components/products/ReviewForm";
import ReviewList from "@/components/products/ReviewList";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  // states for all product data
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  // Get product and reviews at same time
  useEffect(() => {
    if (!id) return;
    const fetch2 = async () => {
      try {
        // get stuff
        const [prodRes, revRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/reviews`),
        ]);
        // initalize data to json
        const prodData = await prodRes.json();
        const revData = await revRes.json();

        // check for errors and set states
        if (!prodData.success) throw new Error(prodData.error);
        setProduct(prodData.product);
        setLikeCount(prodData.product.likes?.length ?? 0);
        if (revData.success) setReviews(revData.reviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch2();
  }, [id]);

  // Auto refresh reviews after submitting a new review
  const refreshReviews = async () => {
    const revRes = await fetch(`/api/products/${id}/reviews`);
    const revData = await revRes.json();
    if (revData.success) setReviews(revData.reviews);
  };

  // Handle like and unlikes
  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (liking) return;
    setLiking(true);
    try {
      // Send like/unlike request
      const res = await fetch(`/api/products/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLikeCount(data.likes); // Function from controller that return new like count
    } finally {
      setLiking(false);
    }
  };

  // Lil loader
  if (loading)
    return (
      <div className="min-h-screen bg-[#1a1919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#DC965A] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading product...</p>
        </div>
      </div>
    );

  // Thing error or no exists
  if (error || !product)
    return (
      <div className="min-h-screen bg-[#1a1919] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error ?? "Product not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-[#DC965A] underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );

  // Get all images for image gallery
  const images = [product.thumbnail, ...(product.images ?? [])].filter(Boolean);

  // Rating is average of all reviews
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#1a1919]">
      <div className="bg-[#242325] border-b border-white/5 px-6 py-3 flex items-center gap-2 text-sm">
        <button
          onClick={() => router.push("/products")}
          className="text-[#DC965A] hover:underline"
        >
          Products
        </button>
        <span className="text-white/20">/</span>
        <span className="text-white/50 truncate">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Gallery for product images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <ProductImageGallery
            images={images}
            productName={product.name}
            featured={product.featured}
          />

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#DC965A]/15 text-[#DC965A] text-xs font-semibold px-3 py-1 rounded-full capitalize border border-[#DC965A]/20">
                {product.category}
              </span>
              {product.price === 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                  Free
                </span>
              )}
              {product.isPrintOfTheWeek && (
                <span className="bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1">
                  <HiOutlineSparkles size={11} /> Print of the Week
                </span>
              )}
            </div>

            <div>
              <h1 className="text-white font-black text-3xl leading-tight mb-2">
                {product.name}
              </h1>
              <button
                onClick={() => router.push(`/users/${product.author?._id}`)}
                className="text-white/40 text-sm hover:text-[#DC965A] transition-colors"
              >
                by {product.author?.name ?? "Unknown"}
              </button>
            </div>

            {/* Rating, shows if there are reviews tho */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= Math.round(avgRating) ? (
                      <FaStar key={s} className="text-[#DC965A] text-lg" />
                    ) : (
                      <FaRegStar key={s} className="text-white/15 text-lg" />
                    ),
                  )}
                </div>
                <span className="text-white font-bold">{avgRating}</span>
                <span className="text-white/30 text-sm">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="text-white/60 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Price and like/dislike buttons */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-white/5">
              <span className="text-[#DC965A] font-black text-3xl">
                {product.price === 0 ? "Free" : `$${product.price}`}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="flex items-center gap-2 bg-[#242325] border border-white/10 hover:border-[#DC965A]/50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer"
                >
                  <FaThumbsUp className="text-white/50" /> {likeCount}
                </button>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <FaThumbsDown /> {product.dislikes?.length ?? 0}
                </div>
              </div>
            </div>

            {/* Filaments that can be printed */}
            {product.availableFilaments?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-2">
                  Available Filaments
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.availableFilaments.map((f) => (
                    <span
                      key={f}
                      className="bg-[#242325] border border-white/10 text-white/70 text-xs px-3 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions?.x && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-2">
                  Dimensions
                </p>
                <p className="text-white/60 text-sm">
                  {product.dimensions.x} × {product.dimensions.y} ×{" "}
                  {product.dimensions.z} {product.dimensions.unit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-white/5 pt-10">
          <h2 className="text-white font-bold text-2xl mb-8">
            Reviews
            {reviews.length > 0 && (
              <span className="text-white/30 font-normal text-base ml-2">
                ({reviews.length})
              </span>
            )}
          </h2>

          {/* Form on left, reviews on right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#242325] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-5">Leave a Review</h3>
                <ReviewForm productId={id} onSuccess={refreshReviews} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
