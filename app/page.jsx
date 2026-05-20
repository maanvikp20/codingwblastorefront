"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSettings, FiEye } from "react-icons/fi";
import { GiWool } from "react-icons/gi";
import { MdOutlineDraw } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaStar, FaRegStar, FaThumbsUp } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";

// Feature thingy i made i look back and i realized it was easier to make just integrated hard coded but too lazy now
const FEATURES = [
  {
    icon: <FiSettings className="text-2xl mt-0.5" />,
    title: "Precision Printing",
    desc: "Layer-by-layer accuracy down to 0.1mm for flawless results every time.",
  },
  {
    icon: <GiWool className="text-2xl mt-0.5" />,
    title: "Wide Material Range",
    desc: "PLA, PETG, ABS, TPU, and specialty filaments for any application.",
  },
  {
    icon: <MdOutlineDraw className="text-2xl mt-0.5" />,
    title: "Custom Designs",
    desc: "Upload your STL or work with us to bring your vision to life.",
  },
];

// Fallbacks for reviews (this is kinda copied from previous project so i just made this for the legitness)
const FALLBACK_REVIEWS = [
  {
    _id: "1",
    author: { name: "Alex R." },
    rating: 5,
    body: "Absolutely stunning quality. The detail on my custom print was beyond what I expected.",
  },
  {
    _id: "2",
    author: { name: "Mia T." },
    rating: 5,
    body: "Fast turnaround and the filament color matched perfectly. Will definitely order again.",
  },
  {
    _id: "3",
    author: { name: "Jordan K." },
    rating: 4,
    body: "Great communication throughout. They nailed the specs on my custom enclosure.",
  },
  {
    _id: "4",
    author: { name: "Sam L." },
    rating: 5,
    body: "Ordered a custom figurine and it came out incredible. Pro-level work.",
  },
  {
    _id: "5",
    author: { name: "Casey W." },
    rating: 5,
    body: "Best 3D print shop I've found. Prices are fair and quality is consistently excellent.",
  },
];

// Testimonial Carousel
function ReviewCarousel({ reviews }) {

  // Carousel states and logic
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);
  const count = reviews.length;

  // Go to next review
  const go = (dir) => {
    if (animating) return; // stop spamming next/prev buttons
    setAnimating(true);
    setTimeout(() => {
      setActive((prev) =>
        dir === "next" ? (prev + 1) % count : (prev - 1 + count) % count,
      );
      setAnimating(false); // prevents double animations
    }, 300);
  };

  // Reset timer on manual navigation
  const resetAndGo = (dir) => {
    clearInterval(intervalRef.current); // stop current timer
    go(dir);
    intervalRef.current = setInterval(() => go("next"), 5000);
  };

  // Move every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => go("next"), 5000);
    return () => clearInterval(intervalRef.current);
  }, [count]);

  const prev = (active - 1 + count) % count;
  const next = (active + 1) % count;

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 w-full max-w-4xl">
        {/* Prev arrow */}
        <button
          onClick={() => resetAndGo("prev")}
          className="shrink-0 w-10 h-10 rounded-full bg-[#242325] border border-white/10 text-white/50 hover:text-white hover:border-[#DC965A]/50 transition-all flex items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        {/* Cards */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {/* Left */}
          <div className="bg-[#242325] border border-white/5 rounded-2xl p-5 opacity-40 scale-95 transition-all">
            <p className="text-white/60 text-sm italic leading-relaxed line-clamp-4">
              "{reviews[prev].body}"
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-7 h-7 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-xs font-bold">
                {reviews[prev].author?.name?.charAt(0)}
              </div>
              <span className="text-white/40 text-xs">
                {reviews[prev].author?.name}
              </span>
            </div>
          </div>

          {/* Center*/}
          <div
            className={`bg-[#2e2d2f] border border-[#DC965A]/30 rounded-2xl p-6 transition-all duration-300 ${
              animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                s <= reviews[active].rating
                  ? <FaStar key={s} className="text-[#DC965A] text-base" />
                  : <FaRegStar key={s} className="text-white/15 text-base" />
              ))}
            </div>
            <p className="text-white text-sm italic leading-relaxed line-clamp-5">
              "{reviews[active].body}"
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-sm font-bold">
                {reviews[active].author?.name?.charAt(0)}
              </div>
              <span className="text-white text-sm font-semibold">
                {reviews[active].author?.name}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="bg-[#242325] border border-white/5 rounded-2xl p-5 opacity-40 scale-95 transition-all">
            <p className="text-white/60 text-sm italic leading-relaxed line-clamp-4">
              "{reviews[next].body}"
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-7 h-7 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-xs font-bold">
                {reviews[next].author?.name?.charAt(0)}
              </div>
              <span className="text-white/40 text-xs">
                {reviews[next].author?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={() => resetAndGo("next")}
          className="shrink-0 w-10 h-10 rounded-full bg-[#242325] border border-white/10 text-white/50 hover:text-white hover:border-[#DC965A]/50 transition-all flex items-center justify-center"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              clearInterval(intervalRef.current);
              setActive(i);
            }}
            className={`rounded-full transition-all ${
              i === active
                ? "w-6 h-2 bg-[#DC965A]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Small product card used in the daily picks grid
function SmallProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-[#1a1919] border border-white/5 hover:border-[#DC965A]/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col"
    >
      <div className="h-28 bg-[#2e2d2f] overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/10">
            {product.name?.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <p className="text-white font-semibold text-xs truncate mb-1">
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#DC965A] font-bold text-xs">
            {product.price === 0 ? "Free" : `$${product.price}`}
          </span>
          <span className="text-white/25 text-[10px] flex items-center gap-1">
            <FaThumbsUp className="text-[9px]" /> {product.likes?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState([]); // all products
  const [recentBlogs, setRecentBlogs] = useState([]); // all blogs
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // get blogs and products
  useEffect(() => {
    fetch("/api/products?limit=20")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.products);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));

    fetch("/api/blogs?limit=3")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRecentBlogs(d.blogs);
      })
      .catch(() => {})
      .finally(() => setBlogsLoading(false));
  }, []);

  // Featured product is first, daily are sorted by likes and exlcude featured
  const heroProduct = products.find((p) => p.featured) ?? products[0] ?? null;

  // Limit 4 for daily products
  const dailyPicks = [...products]
    .filter((p) => p._id !== heroProduct?._id)
    .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    .slice(0, 4);

  // Limit to 3 blogs
  return (
    <div className="min-h-screen bg-[#1a1919]">
      <section className="relative overflow-hidden">

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A]">
              3D Print Store
            </p>
            <h1
              className="text-white font-black leading-[1.05]"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
            >
              Bring Your Ideas
              <br />
              <span className="text-[#DC965A]">Into Reality.</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-md">
              High-quality 3D printed products and fully custom printing
              services — designed, printed, and delivered by our student-run
              shop.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/products"
                className="bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Shop Now →
              </Link>
              <Link
                href="/orders"
                className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Custom Order
              </Link>
            </div>
          </div>

          <div className="relative flex-1 max-w-lg">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg"
                alt="3D Printer"
                className="w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#242325] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
              <BsCircleFill className="text-emerald-400 text-xs animate-pulse" />
              <span className="text-white text-xs font-semibold">
                Available for orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-[#242325]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4 px-6 py-8">
              <span className="text-2xl mt-0.5">{f.icon}</span>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video">
          <img
            src="https://res.cloudinary.com/dnhjp6xda/image/upload/v1770846193/ball_owqo3y.jpg"
            alt="Sample print"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A]">
            About Us
          </p>
          <h2 className="text-white font-black text-3xl leading-tight">
            Crafted With Precision,
            <br />
            Built for You
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            We're a student-run 3D print shop passionate about turning ideas
            into physical objects. Whether you need a one-off prototype or a
            batch of custom parts, we've got you covered.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Every print is carefully monitored, post-processed, and
            quality-checked before it ships. We use a wide range of filaments to
            match your exact requirements.
          </p>
          <Link
            href="/orders"
            className="self-start bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Start a Custom Order →
          </Link>
        </div>
      </section>

      {/* Featured & Daily Picks */}
      <section className="bg-[#242325] border-y border-white/5 py-14">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-1">
                Products
              </p>
              <h2 className="text-white font-black text-2xl">
                Featured & Top Picks
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[#DC965A] hover:underline text-sm font-semibold"
            >
              View all →
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex gap-5">
              <div className="flex-1 bg-[#1a1919] rounded-2xl h-80 animate-pulse" />
              <div className="w-72 grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1919] rounded-xl h-36 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-white/30 text-sm">
              No products yet — check back soon.
            </p>
          ) : (
            
            // Featured product
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Left */}
              {heroProduct && (
                <div
                  onClick={() => router.push(`/products/${heroProduct._id}`)}
                  className="group flex-1 bg-[#1a1919] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden cursor-pointer transition-all"
                >
                  <div className="h-56 bg-[#2e2d2f] overflow-hidden relative">
                    {heroProduct.thumbnail ? (
                      <img
                        src={heroProduct.thumbnail}
                        alt={heroProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/10">
                        {heroProduct.name?.charAt(0)}
                      </div>
                    )}
                    {heroProduct.featured && (
                      <span className="absolute top-3 left-3 bg-[#DC965A] text-[#242325] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                    {heroProduct.price === 0 && (
                      <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white font-black text-lg leading-snug group-hover:text-[#DC965A] transition-colors">
                        {heroProduct.name}
                      </h3>
                      <span className="text-[#DC965A] font-black text-lg shrink-0">
                        {heroProduct.price === 0
                          ? "Free"
                          : `$${heroProduct.price}`}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm line-clamp-2 mb-4">
                      {heroProduct.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span>
                        {heroProduct.author?.name ?? "Unknown"} ·{" "}
                        {heroProduct.category}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaThumbsUp className="text-[10px]" /> {heroProduct.likes?.length ?? 0} · <FaStar className="text-[10px]" />{" "}
                        {heroProduct.rating?.toFixed(1) ?? "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2x2 daily picks grid */}
              {dailyPicks.length > 0 && (
                <div className="lg:w-72 flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">
                    Daily Picks
                  </p>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {dailyPicks.map((p) => (
                      <SmallProductCard
                        key={p._id}
                        product={p}
                        onClick={() => router.push(`/products/${p._id}`)}
                      />
                    ))}
                  </div>
                  <Link
                    href="/products"
                    className="text-center text-xs text-white/30 hover:text-[#DC965A] transition-colors py-2 border border-white/5 rounded-xl hover:border-[#DC965A]/30"
                  >
                    See all products →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-1">
            Reviews
          </p>
          <h2 className="text-white font-black text-2xl">
            What Our Customers Say
          </h2>
        </div>
        <ReviewCarousel reviews={reviews} />
      </section>

      {/* Blogs */}
      <section className="bg-[#242325] border-y border-white/5 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-1">
                From the team
              </p>
              <h2 className="text-white font-black text-2xl">Latest Posts</h2>
            </div>
            <Link
              href="/blog"
              className="text-[#DC965A] hover:underline text-sm font-semibold"
            >
              All posts →
            </Link>
          </div>

          // Blog loading thing
          {blogsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a1919] rounded-2xl h-52 animate-pulse"
                />
              ))}
            </div>
          ) : recentBlogs.length === 0 ? (
            <p className="text-white/30 text-sm">
              No posts yet — check back soon.
            </p>
          ) : (
            // Blog cards
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentBlogs.map((b) => (
                <div
                  key={b._id}
                  onClick={() => router.push(`/blog/${b._id}`)}
                  className="group bg-[#1a1919] border border-white/5 hover:border-[#DC965A]/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <div className="h-36 bg-[#2e2d2f] overflow-hidden">
                    {b.coverImage ? (
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/5">
                        {b.title?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    {b.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC965A] mb-2 block">
                        {b.category}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#DC965A] transition-colors mb-3">
                      {b.title}
                    </h3>
                    {b.excerpt && (
                      <p className="text-white/30 text-xs line-clamp-2">
                        {b.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-white/25 text-xs">
                        {b.author?.name ?? "Unknown"}
                      </span>
                      <span className="text-white/20 text-xs flex items-center gap-1">
                        <FiEye className="text-[11px]" /> {b.views ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom*/}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-3">
          Get started
        </p>
        <h2 className="text-white font-black text-3xl mb-4 leading-tight">
          Ready to Print Something Amazing?
        </h2>
        <p className="text-white/40 text-sm mb-8">
          Browse our in-stock products or submit a fully custom order today.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/products"
            className="bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
          >
            Visit the Store
          </Link>
          <Link
            href="/orders"
            className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-colors"
          >
            Custom Orders
          </Link>
        </div>
      </section>
    </div>
  );
}