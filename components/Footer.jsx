import React from 'react'
import { AiOutlineX } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";
import { AiFillFacebook } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <div className='flex w-full gap-3 py-2 items-center justify-between bg-[#242325] text-[#bbb891] px-5'>
        <h1 className='font-bold text-xl'>Student Store</h1>
        <aside className='flex gap-3'>
            <AiOutlineX/>
            <AiFillLinkedin/>
            <AiFillFacebook/>
            <AiFillYoutube/>
            <AiFillInstagram/>
        </aside>
    </div>
  )
}

export default Footer