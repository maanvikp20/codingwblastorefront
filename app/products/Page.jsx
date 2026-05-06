import React from 'react'
import Image from 'next/image'


const page = () => {
  return (
    <>
    <div className="search-area">
      <button className="search-button">Search</button>
      <input type='search' className='search-bar' />
      <select className='filter-bar' >
        <option value="">Popular</option>
        <option value="">Download</option>
        <option value="">Print Count</option>
        <option value="">Alphabetical</option>
      </select>
    </div>

    <div className="products">
      <div className='product'>
        <div className="product-header">
          <h1>Mini Submarine</h1>
        </div>
        <Image src="" alt="" className="product-img" />
        <div className="product-footer"></div>
      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </>
  )
}


export default page
