'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'





const Product = ({featured = true, name = '3D Bob', like = 12, dislike = 13, price = 4.35, slug = '', authSlug = '', color = '#dc965a', imgURL = '', author = 'Jimmy John', h=200, w=400}) => {
  const startingLikes = like
  const startingDislikes = dislike
  const [likes, setLikes] = useState(like)
  const [dislikes, setDislikes] = useState(dislike)
  function increase(){
    if(likes == startingLikes){
      setLikes(likes+1)
      if(dislikes > startingDislikes){
        setDislikes(dislikes-1)
      }
    }
    
  }
  function decrease(){
    if(dislikes == startingDislikes){
      setDislikes(dislikes+1)
      if(likes > startingLikes){
        setLikes(likes-1)
      }
    }
  }
  return (
    <div style = {{'--color': `${color}`}} className= 'bg-[var(--color)] my-4 mx-4 rounded-2xl flex flex-col items-center w-80 lg:w-100 border border-black border-1'>
      <top className='flex gap-4 items-center font-bold'>
        <Link href={'/products/'+ slug} className=''>{name}</Link>
        <h1 className='font-bold'>${price}</h1>
        <aside className='flex flex-col ml-3'>
          <section className='flex flex-row gap-2'>
            <p>{likes}</p>
            <button onClick={()=>increase()}>^</button>
          </section>
          <section className='flex flex-row gap-2'>
            <p>{dislikes}</p>
            <button onClick={()=>decrease()}>v</button>
          </section>    
        </aside>
        </top>
      <mid>
        <Image src={imgURL || `https://picsum.photos/${w}/${h}`} height = {h} width = {w} alt={name} />
      </mid>
      <bottom className='text-xl font-semibold'>
        <Link href={'/author-profile/' + slug} className=''>By: {author}</Link>
      </bottom>
      
      
      
    </div>
  )
  
}

export default Product

