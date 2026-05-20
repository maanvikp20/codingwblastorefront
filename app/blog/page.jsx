'use client'
import { useState, useEffect } from 'react'
import Blog from '@/components/Blog'

const Page = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs/");
        const json = await res.json();
        console.log(json);
        if (!json.success) throw new Error(json.error);
        setBlogs(json.blogs);
      } catch {
        setError("Failed to load blogs. Is MongoDB running?");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="flex w-full min-h-screen flex-col items-center">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {blogs.map((item) => (
        <Blog blog={item} key={item._id} />
      ))}
    </div>
  )
}

export default Page