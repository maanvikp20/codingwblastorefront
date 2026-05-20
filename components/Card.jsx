import Image from "next/image";

const Card = ({name, creator, src}) => {
    return (
    <div className="bg-[#b3b3b3] lg:max-w-[35vw] p-5 m-5 border-6 border-black flex items-center justify-evenly flex-col">
      <h1 className="text-6xl">1st</h1>
      <Image src={src} alt="" width="100000" height="100" className="p-2.5 w-full"/>
    <h1 className="text-5xl">{name} By {creator}</h1>
    </div>
  )
}

export default Card