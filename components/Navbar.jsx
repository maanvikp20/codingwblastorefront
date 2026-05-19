'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiFillCaretUp } from "react-icons/ai";
import { getAuthHeaders } from '@/app/codingiingnng/api';
import jwt from "jsonwebtoken";



const Navbar = ({ user }) => {
  const isAdmin = user?.role === 'admin'
  const [admin, setAdmin] = useState(isAdmin)
  const token = getAuthHeaders('token') // Example usage of getAuthHeaders with a placeholder token
  console.log(getAuthHeaders('token')) // Debugging line to check the output of getAuthHeaders
  const decoded = jwt.decode(token)
  console.log(decoded) // Debugging line to check the decoded token

  const [width, setWidth] = useState(window.innerWidth); 
  const [view, setView] = useState(false)
  const breakpoint = 768;





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

                <Link href='/auth' id='login' className='m-0'>Login/Register</Link>

            </div>
            {admin ?
              <div className='flex md:flex-row flex-col items-center justify-start h-full m-5 gap-8'>
                <Link href='/admin/products' id='admin-products' className='m-0'>Admin Products</Link>
                <Link href='/admin/users' id='admin-users' className='m-0'>Admin Users</Link>
              </div>
            :
              <></>
            }
            <Link href='/account' id='user-plate' className='border rounded-full px-3 py-4 mr-3'>User</Link>

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
              <line className='border border-[#bbb891] w-16 mt-1'></line>  
              <Link href='/sign-up' id='login' className='m-0'>Login/Register</Link>
              
              
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
