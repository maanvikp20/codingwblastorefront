'use client'
import Product from '@/components/Product'
import React, { useState } from 'react'

const Page = () => {

  const [status, setStatus] = useState(false)
  
  return (
    <>
    <div className="relative w-screen h-[8vh] bg-[#DC965A] flex flex-row items-center justify-evenly p-[.6rem]">
      <button className='w-[3%] bg-[#242325] h-full underline text-[#BBB891] absolute  left-0 top-0 text-decoration-line'>Filter</button>
      <button className='bg-[#BBB891] w-[8%] h-[95%] font-semibold border-2'>Search</button>
      <input className='w-[60%] h-[95%] p-[.4rem] bg-[#C8C8C8]' type="search" name="" id="" placeholder='Search for products...'/>
      <select className=' h-[95%] w-[8%]' name="" id="">
        <option value="">Popular</option>
        <option value="">Download</option>
        <option value="">Print Count</option>
        <option value="">Alphabetical</option>
      </select>
    </div>

    <div className='w-screen relative min-h-[84vh] ] flex-row flex p-6 flex-wrap justify-around bg-[#CED4DB gap-8'>
      <Product featured={true} name={'Mini Boat'} likes={129} dislikes={29} user={'CrazyPenguin138'} /> 
      <Product featured={true} name={'Strawhat'} likes={110} dislikes={8}   user={'AngryPenguin124'} /> 
      <Product featured={false} name={'Gear'} likes={110} dislikes={8}   user={'AngryPenguin124'} /> 
      <Product featured={false} name={'Chain'} likes={110} dislikes={8}   user={'AngryPenguin124'} /> 
      <Product featured={false} name={'Apple'} likes={110} dislikes={8}   user={'AngryPenguin124'} /> 
\    </div>

    
    </>
  )
}

export default Page

