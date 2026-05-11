import React from 'react'
import Card from '../../components/Card'
import Product from '@/components/Product'

const Page = () => {
  return (
    <div className='flex flex-wrap justify-center items-center'>
      <Product name = 'Mom' imgURL='https://picsum.photos/400/300'/>
      <Product/>
      <Product/>
      <Product/>
      <Product/>
      <Product/>
      <Product/>
    </div>
  )
}

export default Page
