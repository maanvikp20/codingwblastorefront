'use client'
import Product from '@/components/Product'
import React, { useState } from 'react'

const Page = () => {

  const [status, setStatus] = useState(false)
  
  return (
    <>
    <div className="w-screen h-[8vh] bg-[#DC965A] flex flex-row items-center justify-evenly p-[.6rem]">
      <button className='w-[8%] h-[95%] text-decoration-line'>Filter</button>
      <button className='bg-[#BBB891] w-[8%] h-[95%] font-semibold border-2'>Search</button>
      <input className='w-[60%] h-[95%] p-[.4rem] bg-[#C8C8C8]' type="search" name="" id="" placeholder='Search for products...'/>
      <select className='h-[95%] w-[8%]' name="" id="">
        <option value="">Popular</option>
        <option value="">Download</option>
        <option value="">Print Count</option>
        <option value="">Alphabetical</option>
      </select>
    </div>

    <div className='w-screen min-h-[84vh] flex-row flex '>
    </div>
    </>
  )
}

export default Page

