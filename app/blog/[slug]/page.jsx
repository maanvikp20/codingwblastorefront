'use client'
import { use, useState, useEffect } from 'react'
import Image from "next/image"
 
export default function BlogPostPage({ params }) {
  const { slug } = use(params)
 
    const [data, setData] = useState([])
    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
  
  
    useEffect(() => {
      async function fetchBlog(){
  
        try {
          setLoading(true);
        const res = await fetch(`/api/blog/${slug}`);
        const json = await res.json();
        console.log(json)
        if (!json.success) throw new Error(json.error);
        setData(json.data);
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
      <div className="bg-[#b3b3b3] p-3 m-5 w-[50vw] flex flex-row lg:flex-col items-center">
        <div className="flex justify-center flex-col p-3">
          <h1 className="text-4xl m-3">{data.header ? data.header : "Testing Testing One Two Three!"}</h1>
          {data.image ? <Image src={data.image} alt="" width="1000000" height="100" className=" border-6 border-black"/> : <Image src="https://www.dummyimage.com/600x400/000/fff" alt="" width="1000000" height="100" className=" border-6 border-black"/> }
          <p className="m-3">{data.content ? data.content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, voluptatibus? Enim, alias! Aspernatur dolore sed id, voluptas quos nostrum fugit eum illo quidem, sunt, rerum molestiae debitis. Molestias porro dolores repudiandae quibusdam nemo laborum pariatur voluptatibus officiis, veritatis incidunt dolor molestiae quidem nostrum error eligendi id sequi vel perferendis! Autem distinctio ipsa officia illum temporibus soluta ad laborum! Ea itaque dicta vitae! Cupiditate eligendi eaque repellendus, eius repudiandae quam? Quidem, reprehenderit aspernatur tempore, odio vel aliquam blanditiis soluta eos iste tenetur voluptas laboriosam similique, voluptatum ducimus eum nihil itaque atque consequatur consequuntur iusto animi ullam. Qui sequi deserunt eius aliquam id explicabo ab vel minus, nisi, quia ea nostrum nemo, aliquid provident rem beatae excepturi illo repellat perferendis non cum exercitationem amet? Fugit vitae dolorem quaerat at quo quam deserunt consectetur magni, rem id dolore, dicta necessitatibus esse facilis veniam aliquid labore impedit unde a. Dicta numquam voluptate accusantium, atque aperiam esse rerum ea sunt vero, necessitatibus sequi quo voluptatibus eos voluptatum tenetur error magni aliquam. Rem minus, iste at pariatur deleniti officiis cupiditate aut repudiandae atque esse beatae eius nulla itaque commodi porro soluta quasi natus, dolore est molestiae earum dignissimos. Dolor voluptates unde perferendis nam atque illum quibusdam dolorem adipisci omnis, commodi quo optio deleniti, numquam illo maiores dolorum consequatur, impedit odio? Aliquid nihil mollitia ea accusamus laboriosam consectetur voluptatem asperiores fugiat totam, tempore modi unde! Aut assumenda laudantium dolor delectus dolores, blanditiis architecto officia ea sequi vitae nam natus eveniet explicabo ab qui ut doloremque consectetur non."}</p>

        </div>

      </div>
    </div>
  )
}