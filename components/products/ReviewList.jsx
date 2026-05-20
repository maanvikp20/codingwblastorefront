import { FaStar, FaRegStar } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

export default function ReviewList({ reviews = [] }) {
  // Will return if no reviews
  if (reviews.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <FiMessageSquare className="text-4xl text-white/10" />
        <p className="text-white/40 text-sm">No reviews yet. Be the first!</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="bg-[#242325] border border-white/5 rounded-2xl p-5"
        >
          {/* Review items such as author, date, and rating*/}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white font-semibold text-sm">
                {r.author?.name ?? "Anonymous"}
              </p>
              <p className="text-white/30 text-xs">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>

            {/* Star display for this review's rating */}
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) =>
                s <= r.rating ? (
                  <FaStar key={s} className="text-[#DC965A] text-sm" />
                ) : (
                  <FaRegStar key={s} className="text-white/15 text-sm" />
                ),
              )}
            </div>
          </div>

          {/* Display review title and body if exist */}
          {r.title && (
            <p className="text-white font-semibold text-sm mb-1">{r.title}</p>
          )}
          {r.body && (
            <p className="text-white/60 text-sm leading-relaxed">{r.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}
