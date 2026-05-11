import Image from 'next/image';
import React, { useState } from 'react'
import { IoMdThumbsDown,  IoMdThumbsUp} from "react-icons/io";


const Product = ({featured, name, likes, dislikes, user, url}) => {
  let color
  if(featured){
     color = '#e09c64'
  }
  else {
     color = '#D6DEE2'
  }

  return (
    <div className='border-2 rounded-xl w-[30%] h-[52%] relative flex-col' style={{backgroundColor: color}}>
      <div className='p-2 w-full h-[15%] flex flex-row relative gap-12 '>
        <h1 className='text-center h-full w-[29%] text-2xl font-bold text-[#282828]'>{name}</h1>

        <div className='h-full w-[50%]'></div>
        
      </div>

      <img src="https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg" className='w-full h-[75%] object- object-cover' alt="" />
      
      <div className='text-center text-xl font-semibold w-full h-[10%] relative  p-1'>
        By {user}
      </div>
    </div>
  )
  
}

export default Product
