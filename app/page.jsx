"use client";
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Card from '@/components/Card.jsx'
import Blog from '@/components/Blog'


export default function Page() {

  const [featured, setFeatured] = useState([])
  const [blog, setBlog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/products?featured=true&limit=5");
        const json = await res.json();
        console.log(json);
        if (!json.success) throw new Error(json.error);
        setFeatured(json.products);
      } catch {
        setError("Failed to load featured projects. Is MongoDB running?");
      } finally {
        setLoading(false);
      }
    }

    async function fetchBlog() {
      try {
        const res = await fetch("/api/blogs/");
        const json = await res.json();
        console.log(json);
        if (!json.success) throw new Error(json.error);
        setBlog(json.blogs);
      } catch {
        setError("Failed to load blog. Is MongoDB running?");
      }
    }

    fetchFeatured();
    fetchBlog();
  }, []);

  const DEFAULTCARD = "bg-[#dc965a] w-100% p-2 m-5"

  return (
    <div className="bg-[#c8c8c8] w-screen min-h-screen">
      <div className={DEFAULTCARD}>
        <Image src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg" alt="" width="1000000" height="100" className="border-6 border-black" />
      </div>

      <div className="bg-[#dc965a] m-5 p-2">
        <h1 className="text-5xl text-[#242325]">Popular</h1>

        {loading && <p className="text-[#242325] p-2">Loading...</p>}
        {error && <p className="text-red-700 p-2">{error}</p>}

        {!loading && !error && (
          <div className="w-full p-2 m-5 flex flex-col lg:flex-row justify-evenly items-evenly">
            <div>
              <Card
                src={featured[0]?.image ?? "https://www.dummyimage.com/600x400/000/fff"}
                name={featured[0]?.name ?? "Montgomery MACdonald"}
                creator={featured[0]?.author?.name ?? "Unknown"}
              />
            </div>

            <div>
              <div className="flex flex-wrap wrap">
                {products.map((item, i) => (
                  <Card
                    key={i}
                    src={item.image ?? "https://www.dummyimage.com/600x400/000/fff"}
                    name={item.name ?? "Unknown"}
                    creator={item.author?.name ?? "Unknown"}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={DEFAULTCARD}>
        {blog[0] && (
          <Link href={`/blog/${blog[0]._id}`}>
            <Blog blog={blog[0]} />
          </Link>
        )}
      </div>
    </div>
  )
}