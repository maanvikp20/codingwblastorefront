import Image from "next/image"
import Link from "next/link"
const Blog = (data) => {
  return (
      <Link href={`/blog/${data.id ? data.id : "a"}`} className="bg-[#b3b3b3] p-3 m-5 w-[90vw] lg:w-fit flex flex-row lg:flex-col items-center">
        <div className="flex justify-center flex-col p-3">
          <h1 className="text-4xl m-3">{data.header ? data.header : "Testing Testing One Two Three!"}</h1>
          <div className="flex flex-col lg:flex-row">
          {data.image ? <Image src={data.image} alt="" width="1000000" height="100" className="lg:w-[50%] border-6 border-black"/> : <Image src="https://www.dummyimage.com/600x400/000/fff" alt="" width="1000000" height="100" className="lg:w-fit border-6 border-black"/> }
          <p className="m-3">{data.content ? data.content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, voluptatibus? Enim, alias! Aspernatur dolore sed id, voluptas quos nostrum fugit eum illo quidem, sunt, rerum molestiae debitis. Molestias porro dolores repudiandae quibusdam nemo laborum pariatur voluptatibus officiis, veritatis incidunt dolor molestiae quidem nostrum error eligendi id sequi vel perferendis! "}</p>
          </div>

        </div>

      </Link>
  )
}

export default Blog
