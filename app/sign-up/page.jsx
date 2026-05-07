import React from 'react'

const Page = () => {
    const FORM = "w-[35%] h-[75%] flex items-center flex-col bg-[#B3B3B3] gap-20 border-2 max-sm:w-[70%] max-sm:h-[60%] max-sm:justify-center"
    const INPUT = "w-[75%] h-[10%] font-semibold text-2xl bg-[#242325] text-white text-center cursor-pointer "
  return (
    <div className='flex flex-row w-screen h-[92vh] items-center justify-around bg-[#DC965A] overflow-x-hidden max-sm:flex-col max-sm:gap-7'>
      <form className={FORM}>
        <h1 className='text-5xl font-semibold'>Log In</h1>
        <input className={INPUT} type="text" placeholder='Username' />
        <input className={INPUT} type="text" placeholder='Password' />
        <button className={INPUT} type='submit'>Submit</button>
      </form>

      <form className={FORM}> 
        <h1 className='text-5xl font-semibold '>Register</h1>
        <input className={INPUT} type="text" placeholder='Username' />
        <input className={INPUT} type="text" placeholder='Password' />
        <button className={INPUT}  type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Page
