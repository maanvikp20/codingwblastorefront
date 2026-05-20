// components/ReviewForm.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

export default function ReviewForm({ productId, onSuccess }) {
  const router = useRouter();

  // States for review form inputs and submission
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle review form submissions
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    setSubmitting(true);

    // Post review data to API
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, title: reviewTitle, body: reviewBody }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setReviewSuccess(true);
      onSuccess?.();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show a success message instead of form after success
  if (reviewSuccess)
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <FiCheckCircle className="text-4xl text-emerald-400" />
        <p className="text-white font-semibold">Review submitted!</p>
        <p className="text-white/40 text-sm">Thanks for your feedback.</p>
      </div>
    );

  // Return review form with all inputs and rating selector (naked form)
  return (
    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-2">
          Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className="text-2xl transition-colors"
            >
              {s <= rating ? (
                <FaStar className="text-[#DC965A]" />
              ) : (
                <FaRegStar className="text-white/15 hover:text-white/40" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Review title input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[#BBB891]">
          Title{" "}
          <span className="text-white/20 normal-case font-normal">
            (optional)
          </span>
        </label>
        <input
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
          placeholder="Summary of your review"
          className="bg-[#1a1919] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
        />
      </div>

      {/* Review body textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[#BBB891]">
          Review
        </label>
        <textarea
          value={reviewBody}
          onChange={(e) => setReviewBody(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="bg-[#1a1919] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors resize-none"
        />
      </div>

      {/* error message if review submission fails */}
      {reviewError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {reviewError}
        </div>
      )}

      {/* submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
