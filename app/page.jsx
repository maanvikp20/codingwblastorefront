"use client";
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import Card from '@/components/Card.jsx'
import Blog from '@/components/Blog.jsx'


export default function Page() {

  const [featured, setFeatured] = useState([])
  const [blog, setBlog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  // useEffect(() => {
  //   async function fetchBlog(){

  //     try {
  //       setLoading(true);
  //     const res = await fetch("/api/featured/");
  //     const json = await res.json();
  //     console.log(json)
  //     if (!json.success) throw new Error(json.error);
  //     setFeatured(json.data);
  //   } catch {
  //     setError("Failed to load featured projects. Is MongoDB running?");
  //   } finally {
  //     setLoading(false);
  //   }
  // }    
  // async function fetchBlog(){

  //     try {
  //       setLoading(true);
  //     const res = await fetch("/api/featured/");
  //     const json = await res.json();
  //     console.log(json)
  //     if (!json.success) throw new Error(json.error);
  //     setBlog(json.data);
  //   } catch {
  //     setError("Failed to load trending projects. Is MongoDB running?");
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  // fetchFeatured()
  // fetchBlog()
  // }, []);

  const DEFAULTCARD = "bg-[#dc965a] w-100% p-2 m-5"
  return (
   <div className="bg-[#c8c8c8] w-screen min-h-screen">
    <div className={DEFAULTCARD}>
      <Image src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg" alt="" width="1000000" height="100" className=" border-6 border-black"/>
    </div>
    <div className="bg-[#dc965a] m-5 p-2">
      <h1 className="text-5xl text-[#242325]">Popular</h1>
      <div className="w-full p-2 m-5 flex flex-col lg:flex-row justify-evenly items-evenly">
      <div>
        
      <Card src={featured[0] != null ? featured[0].image : "https://www.dummyimage.com/600x400/000/fff"} name={featured[0] != null ? featured[0].name : "Montgomery MACdonald"} creator={featured[0] != null ? featured[0].creator : "Unknown"}/>
      {/* <Card src={featured[0].image != null ? featured[0].image : "https://www.dummyimage.com/600x400/000/fff"} name={featured[0].name != null ? featured[0].name : "Montgomery MACdonald"} creator={featured[0].creator != null ? featured[0].creator : "Unknown"}/> */}
      </div>
      <div>

      <div className="flex flex-wrap wrap">
        {/* {featured.slice(1, featured.length()).map((item) => {
          <Card src={item.image != null ? item.image : "https://www.dummyimage.com/600x400/000/fff"} name={item.name != null ? item.name : "Unknown"} creator={item.creator != null ? item.creator : "Unknown"}/>
        })} */}
        {[1,2,3,4].map((item) => {
            <Card src={"https://www.dummyimage.com/600x400/000/fff"} name={"Unknown"} creator={"Unknown"}/>
          })}
      </div>
      </div>
      </div>
    </div>
    <div className={DEFAULTCARD}>
      {/* <Link src={`https://localhost:3000/blog/${blog._id}`}>
        <Blog blog={blog} />
      </Link> */}
    </div>
   </div>
  )
}
