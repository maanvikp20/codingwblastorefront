'use client'
import { use, useState, useEffect } from 'react'
import Image from "next/image"
import Blog from "@/components/Blog" 

const Page = () => {
    const [data, setData] = useState([{id: "A"}, {id: "B"}, {id: "C"}])
    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
  
  
    useEffect(() => {
      async function fetchBlog(){
  
        try {
          setLoading(true);
        const res = await fetch(`/api/blog/`);
        const json = await res.json();
        console.log(json)
        if (!json.success) throw new Error(json.error)
        if(json){
          setData(json.data);
        }
      } catch {
        setError("Failed to load featured projects. Is MongoDB running?");
      } finally {
        setLoading(false);
      }
    }    
    fetchBlog()
    }, []);




  return (
    <div className="flex w-full min-h-screen flex-col items-center">
      {data.map((item) => {
        {console.log(item)}
        return <Blog data={item} key={item.id} />
      })}
    </div>
  )
}

export default Page
