'use client'
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
      <section className='flex w-full gap-3 py-1 justify-between bg-[#242325] text-[#bbb891] items-center flex-col md:flex-row sticky top-0'>
            <h1 id='title' className='text-2xl mx-4'>Student Store</h1>
            <div id='pages' className='flex md:flex-row flex-col items-center justify-start h-full m-5 gap-8'>

                <div id='reward' className='m-0'>Rewards</div>
                
                <div id='blog' className='m-0'>Blog</div>
                
                <div id='custom' className='m-0'>Custom</div>
                
                <div id='shop' className='m-0'>Shop</div>
                
                <div id='donate' className='m-0'>Donations</div>
                
                <div id='partner' className='m-0'>Partner</div>

            </div>
            <div id='user-plate' className='border rounded-full px-3 py-4'>User</div>

      </section>
    ) : (
      <section className='flex w-full gap-3 py-1 justify-evenly bg-[#242325] text-[#bbb891] items-center flex-row md:flex-row sticky top-0'>
          <h1 id='title' className='text-2xl '>Student Store</h1>
          {view ?(
            <section className='absolute flex flex-col top-16 bg-[#242325] p-3 items-center '>
              <button className='' onClick={()=>setView(!view)}><AiFillCaretUp/></button>
              <div id='reward' className='m-0'>Rewards</div>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <div id='blog' className='m-0'>Blog</div>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <div id='custom' className='m-0'>Custom</div>
              <line className='border border-[#bbb891] w-16 mt-1'></line>  
              <div id='shop' className='m-0'>Shop</div>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <div id='donate' className='m-0'>Donations</div>
              <line className='border border-[#bbb891] w-16 mt-1'></line>
              <div id='partner' className='m-0'>Partner</div>
            </section>
            
          ):(
            <button className=' h-8 w-8 flex flex-col justify-evenly px-1' onClick={()=>setView(!view)}>
                <div className='border border-[#bbb891]'></div>
                <div className='border border-[#bbb891]'></div>
                <div className='border border-[#bbb891]'></div>
            </button>
          )}
            
          <div id='user-plate' className='border rounded-full px-3 py-4'>User</div>
      </section>
    )}
    
    
    
    </>
  )
}

export default Navbar
