import Image from "next/image"
import Link from "next/link"

const Blog = ({ blog }) => {
  return (
    <Link href={`/blog/${blog?._id ?? "a"}`} className="bg-[#b3b3b3] p-3 m-5 w-[90vw] lg:w-fit flex flex-row lg:flex-col items-center">
      <div className="flex justify-center flex-col p-3">
        <h1 className="text-4xl m-3">{blog?.title ?? "Testing Testing One Two Three!"}</h1>
        <div className="flex flex-col lg:flex-row">
          {blog?.coverImage
            ? <Image src={blog.coverImage} alt="" width="1000000" height="100" className="lg:w-[50%] border-6 border-black" />
            : <Image src="https://www.dummyimage.com/600x400/000/fff" alt="" width="1000000" height="100" className="lg:w-fit border-6 border-black" />
          }
          <p className="m-3">{blog?.content ?? "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}</p>
        </div>
      </div>
    </Link>
  )
}

export default Blog