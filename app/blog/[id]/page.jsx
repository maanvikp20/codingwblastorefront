'use client'
import { use, useState, useEffect } from 'react'
import Image from "next/image"

export default function BlogPostPage({ params }) {
  const { id } = use(params)

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const json = await res.json();
        console.log(json);
        if (!json.success) throw new Error(json.error);
        setBlog(json.blog);
      } catch {
        setError("Failed to load blog post. Is MongoDB running?");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  return (
    <div className="flex w-full min-h-screen flex-col items-center">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {blog && (
        <div className="bg-[#b3b3b3] p-3 m-5 w-[90vw] lg:w-[50vw] flex flex-row lg:flex-col items-center">
          <div className="flex justify-center flex-col p-3">
            <h1 className="text-4xl m-3">{blog.title ?? "Untitled"}</h1>
            {blog.coverImage
              ? <Image src={blog.coverImage} alt="" width="1000000" height="100" className="border-6 border-black" />
              : <Image src="https://www.dummyimage.com/600x400/000/fff" alt="" width="1000000" height="100" className="border-6 border-black" />
            }
            <p className="m-3">{blog.content ?? ""}</p>
          </div>
        </div>
      )}
    </div>
  )
}