'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiFillCaretUp } from "react-icons/ai";
const Navbar = () => {




  const [width, setWidth] = useState(window.innerWidth); 
  const [view, setView] = useState(false)
  const breakpoint = 768;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <>
    { width >= breakpoint ? (
      <section className='flex w-full gap-3 py-1 justify-between bg-[#242325] text-[#bbb891] items-center flex-col md:flex-row sticky top-0 z-2'>
            <Link href='/' id='title' className='text-2xl font-bold ml-3'>Student Store</Link>
            <div id='pages' className='flex md:flex-row flex-col items-center justify-start h-full m-5 gap-8'>

                <Link href='/about' id='about' className='m-0'>About Us</Link>
                
                <Link href='/blog' id='blog' className='m-0'>Blog</Link>
                
                <Link href='/custom' id='custom' className='m-0'>Custom</Link>
                
                <Link href='/products' id='shop' className='m-0'>Shop</Link>

            </div>
            <Link href='/account/user' id='user-plate' className='border rounded-full px-3 py-4 mr-3'>User</Link>

      </section>
    ) : (
      <section className='flex w-full gap-3 py-2 bg-[#242325] text-[#bbb891] items-center flex-row md:flex-row sticky top-0 z-2'>
          <Link href='/' id='title' className='text-2xl font-bold left-20 relative'>Student Store</Link>
          {view ?(
            
            <section className='absolute flex flex-col top-12 right-30 bg-[#242325] p-3 items-center '>
              <button className='' onClick={()=>setView(!view)}><AiFillCaretUp/></button>


              <Link href='/account' id='user-plate' className='border rounded-full px-3 py-4 mt-2 mb-1'>User</Link>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <Link href='/about' id='about' className='m-0'>About Us</Link>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <Link href='/blog' id='blog' className='m-0'>Blog</Link>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <Link href='/custom' id='custom' className='m-0'>Custom</Link>
              <line className='border border-[#bbb891] w-16 mt-1'></line>  
              <Link href='/products' id='shop' className='m-0'>Shop</Link>
              
              
            </section>
            
          ):(
            <button className=' h-8 w-8 flex flex-col justify-evenly px-1 relative left-20' onClick={()=>setView(!view)}>
                <div className='border border-[#bbb891]'></div>
                <div className='border border-[#bbb891]'></div>
                <div className='border border-[#bbb891]'></div>
            </button>
          )}
            
          
      </section>
    )}
    
    
    
    </>
  )
}

export default Navbar
