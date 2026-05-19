'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ProductPage() {
  const { id }  = useParams()
  const router  = useRouter()

  const [product, setProduct]             = useState(null)
  const [reviews, setReviews]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [likeCount, setLikeCount]         = useState(0)
  const [liking, setLiking]               = useState(false)
  const [activeImage, setActiveImage]     = useState(0)

  // Review form
  const [rating, setRating]               = useState(5)
  const [reviewTitle, setReviewTitle]     = useState('')
  const [reviewBody, setReviewBody]       = useState('')
  const [reviewError, setReviewError]     = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [submitting, setSubmitting]       = useState(false)

  useEffect(() => {
    if (!id) return
    const fetch2 = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/reviews`),
        ])
        const prodData = await prodRes.json()
        const revData  = await revRes.json()
        if (!prodData.success) throw new Error(prodData.error)
        setProduct(prodData.product)
        setLikeCount(prodData.product.likes?.length ?? 0)
        if (revData.success) setReviews(revData.reviews)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch2()
  }, [id])

  const handleLike = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    if (liking) return
    setLiking(true)
    try {
      const res  = await fetch(`/api/products/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setLikeCount(data.likes)
    } finally {
      setLiking(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewError(null)
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')
    setSubmitting(true)
    try {
      const res  = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, title: reviewTitle, body: reviewBody }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setReviewSuccess(true)
      const revRes  = await fetch(`/api/products/${id}/reviews`)
      const revData = await revRes.json()
      if (revData.success) setReviews(revData.reviews)
    } catch (err) {
      setReviewError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#1a1919] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#DC965A] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading product...</p>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen bg-[#1a1919] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error ?? 'Product not found'}</p>
        <button onClick={() => router.back()} className="text-[#DC965A] underline text-sm">Go back</button>
      </div>
    </div>
  )

  const images = [product.thumbnail, ...(product.images ?? [])].filter(Boolean)
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-[#1a1919]">

      {/* Breadcrumb bar */}
      <div className="bg-[#242325] border-b border-white/5 px-6 py-3 flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/products')} className="text-[#DC965A] hover:underline">
          Products
        </button>
        <span className="text-white/20">/</span>
        <span className="text-white/50 truncate">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Top section: image + info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

          {/* Images */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square bg-[#242325] rounded-2xl overflow-hidden border border-white/5">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl font-black text-white/10">
                  {product.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {product.featured && (
                <span className="absolute top-4 left-4 bg-[#DC965A] text-[#242325] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-[#DC965A]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">

            {/* Category + status badges */}
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
                <span className="bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/20">
                  🏆 Print of the Week
                </span>
              )}
            </div>

            <div>
              <h1 className="text-white font-black text-3xl leading-tight mb-2">{product.name}</h1>
              <button
                onClick={() => router.push(`/users/${product.author?._id}`)}
                className="text-white/40 text-sm hover:text-[#DC965A] transition-colors"
              >
                by {product.author?.name ?? 'Unknown'}
              </button>
            </div>

            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-[#DC965A]' : 'text-white/15'}`}>★</span>
                  ))}
                </div>
                <span className="text-white font-bold">{avgRating}</span>
                <span className="text-white/30 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            <p className="text-white/60 text-sm leading-relaxed">{product.description}</p>

            {/* Price + like row */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-white/5">
              <span className="text-[#DC965A] font-black text-3xl">
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="flex items-center gap-2 bg-[#242325] border border-white/10 hover:border-[#DC965A]/50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer"
                >
                  👍 <span>{likeCount}</span>
                </button>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  👎 {product.dislikes?.length ?? 0}
                </div>
              </div>
            </div>

            {/* Filaments */}
            {product.availableFilaments?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-2">
                  Available Filaments
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.availableFilaments.map((f) => (
                    <span key={f} className="bg-[#242325] border border-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
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
                  {product.dimensions.x} × {product.dimensions.y} × {product.dimensions.z} {product.dimensions.unit}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="border-t border-white/5 pt-10">
          <h2 className="text-white font-bold text-2xl mb-8">
            Reviews
            {reviews.length > 0 && (
              <span className="text-white/30 font-normal text-base ml-2">({reviews.length})</span>
            )}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Write a review */}
            <div className="lg:col-span-2">
              <div className="bg-[#242325] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-5">Leave a Review</h3>

                {reviewSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <span className="text-3xl">✅</span>
                    <p className="text-white font-semibold">Review submitted!</p>
                    <p className="text-white/40 text-sm">Thanks for your feedback.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    {/* Star picker */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-2">Rating</p>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className={`text-2xl transition-colors ${s <= rating ? 'text-[#DC965A]' : 'text-white/15 hover:text-white/40'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#BBB891]">
                        Title <span className="text-white/20 normal-case font-normal">(optional)</span>
                      </label>
                      <input
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summary of your review"
                        className="bg-[#1a1919] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#BBB891]">Review</label>
                      <textarea
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        className="bg-[#1a1919] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors resize-none"
                      />
                    </div>

                    {reviewError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                        {reviewError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Review list */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <span className="text-4xl">💬</span>
                  <p className="text-white/40 text-sm">No reviews yet. Be the first!</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="bg-[#242325] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{r.author?.name ?? 'Anonymous'}</p>
                        <p className="text-white/30 text-xs">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-sm ${s <= r.rating ? 'text-[#DC965A]' : 'text-white/15'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {r.title && <p className="text-white font-semibold text-sm mb-1">{r.title}</p>}
                    {r.body  && <p className="text-white/60 text-sm leading-relaxed">{r.body}</p>}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}