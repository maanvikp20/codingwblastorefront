import Image from "next/image";
import Card from '@/components/Card.jsx'

export default function page() {
  const DEFAULTCARD = "bg-[#dc965a] w-100% p-2 m-5"
  return (
   <div className="bg-[#c8c8c8] w-screen min-h-screen">
    <div className={DEFAULTCARD}>
      <Image src="https://res.cloudinary.com/drg8btdmp/image/upload/v1770239503/Printer_ajkl0v.jpg" alt="" width="1000000" height="100" className=" border-6 border-black"/>
    </div>
    <div className="bg-[#dc965a] m-5 p-2">
      <h1 className="text-5xl text-[#242325]">Popular</h1>
      <div className="w-full p-2 m-5 flex flex-col lg:flex-row justify-evenly items-evenly">
      <Card src="https://res.cloudinary.com/drg8btdmp/image/upload/v1725580333/cld-sample-2.jpg" name="Bob" creator="Jeff"/>
      <div>
      <div className="flex flex-wrap wrap w-full lg:flex-row">
        <div className="bg-[#b3b3b3] lg:max-w-[20vw] lg:max-h-full p-5 m-5 border-6 border-black">
          <h1 className="text-6xl">2nd</h1>
          <Image src={"https://res.cloudinary.com/drg8btdmp/image/upload/v1725580333/cld-sample-2.jpg"} alt="" width="100000" height="100" className="p-2.5 w-full"/>
        <h1 className="text-5xl">{"Item"} By {"Creator"}</h1>
        </div>
      </div>
      <div className="flex flex-wrap wrap">
        <div className="bg-[#b3b3b3] lg:max-w-[20vw] lg:max-h-full p-5 m-5 border-6 border-black">
          <h1 className="text-6xl">3rd</h1>
          <Image src={"https://res.cloudinary.com/drg8btdmp/image/upload/v1725580333/cld-sample-2.jpg"} alt="" width="100000" height="100" className="p-2.5 w-full"/>
        <h1 className="text-5xl">{"Item"} By {"Creator"}</h1>
        </div>
      </div>
      </div>
      <div>

      <div className="flex flex-wrap wrap">
        <div className="bg-[#b3b3b3] lg:max-w-[20vw] lg:max-h-full p-5 m-5 border-6 border-black">
          <h1 className="text-6xl">4th</h1>
          <Image src={"https://res.cloudinary.com/drg8btdmp/image/upload/v1725580333/cld-sample-2.jpg"} alt="" width="100000" height="100" className="p-2.5 w-full"/>
        <h1 className="text-5xl">{"Item"} By {"Creator"}</h1>
        </div>
      </div>
      <div className="flex flex-wrap wrap">
        <div className="bg-[#b3b3b3] lg:max-w-[20vw] lg:max-h-full p-5 m-5 border-6 border-black">
          <h1 className="text-6xl">5th</h1>
          <Image src={"https://res.cloudinary.com/drg8btdmp/image/upload/v1725580333/cld-sample-2.jpg"} alt="" width="100000" height="100" className="p-2.5 w-full"/>
        <h1 className="text-5xl">{"Item"} By {"Creator"}</h1>
        </div>
      </div>
      </div>
      </div>
    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
    <div className={DEFAULTCARD}>

    </div>
   </div>
  )
}
