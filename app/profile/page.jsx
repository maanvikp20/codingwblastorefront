'use server'

import React from 'react'
// import connectDB from "../../lib/Mongodb";
import Product from '@/components/Product';
import Link from "next/link";

async function getAccountById(id) {
  if (!id) {
    return null;
  }

  try {
    await connectDB();
    const account = await User.findById(id).lean();
    return account;
  } catch (error) {
    return null;
  }
}

const Page = async ({params}) => {
  const {id} = params
  const account = await getAccountById(id);

  if (!author) {
    return <div>Account not found</div>;
  }
// #c8c8c8
// #dc965a
  return (
    <div className="bg-[#c8c8c8] w-screen min-h-screen">

      <div className='flex flex-col md:flex-row justify-evenly'>

        <div className=" w-100% md:w-48% min-h-screen flex flex-col justify-evenly">

          <div className='flex flex-col justify-top bg-[#dc965a] p-[1vw] m-[2vw]'>

            <h1 className="text-5xl text-[#242325]">{account.name}</h1>
            <p className="text-lg text-[#242325] mt-4">{account.bio}</p>
            <p className="text-lg text-[#242325] mt-4">{account.timestamps}</p>

          </div>

          <div className=' hidden md:flex flex-col justify-top bg-[#dc965a] p-[1vw] m-[2vw]'>
              
              {account.liked.forEach(print => {

                    {/* {featured = false, user, name = '3D Bob', like = 12, color = 'gray', dislike = 13, price = 4.35, slug = '', authSlug = '', imgURL = '', author = 'Jimmy John', h=200, w=400} */}

                return(

                  <Product featured={print.featured} name={print.name} like={print.likes} color='gray' dislike={print.dislikes} price={print.price} slug={print.slug} authSlug={print.author.slug} imgURL={print.thumbnail} author={print.author.name} />


                )

              })}

          </div>

        </div>

        <div className='w-100% md:w-48% min-h-screen flex flex-col justify-top'>
          
          <p className='text-[2vw] '>Past purchases</p>

          <div className='flex flex-col justify-evenly'>

            {User.previousPurchases.forEach(print => {
              
              return(
              
                <Link href={print.slug} className="text-[#c8c8c8] bg-mist-900">{print.name}</Link>
              
              )

            })}

          </div>

          

        </div>

      </div>
    </div>
  )
}

export default Page