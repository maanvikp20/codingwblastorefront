'use client'
import Product from '@/components/Product'
import React, { useState } from 'react'

const Page = () => {
//mockData imitating what data will look likk ehwen fetched from API 
  const mockData = [
    {
    name: 'Mini Boat',
    likes: 129,
    dislikes: 29,
    user: 'CrazyPenguin138',
    featured: true,
    price: 14,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Strawhat',
    likes: 110,
    dislikes: 8,
    user: 'AngryPenguin124',
    featured: true,
    price: 17,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Gear',
    likes: 142,
    dislikes: 43,
    user: 'Mugiwara',
    featured: true,
    price: 4.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Chain',
    likes: 96,
    dislikes: 104,
    user: 'BreadMan24',
    featured: false,
    price: 8.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
    {
    name: 'Apple',
    likes: 150,
    dislikes: 12,
    user: 'BigAppleFruit',
    featured: false,
    price: 3.99,
    url: 'https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg'
  },
]

// Search variable constantly holding whats in the search bar 
// Originally set products to the data recieved from the API, different variable so when the search bar goes b;ank it can revert to its original state
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(mockData)

// Function that compares the value in the search bar to the names of the products 
  const updateSearch = () => {
    try {
      // runs regex to check for white space or if the search bar is empty if it is the products vairbale goesback to be the original data set
      if(search.match(/\s/g) || search == null){
        setProducts(mockData)
        console.log('worked')
        return
      }

      // FIlters the products variable based off the value in the searc hbar uses slice funciotn to see if it matches 
      setProducts(mockData.filter((x) => {
        let characterCount = search.length 
        if(search.trim().toLocaleLowerCase() == x.name.trim().toLocaleLowerCase().slice(0, characterCount)) {
          return x
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  //Function to handle filters (Not done)
  const updateFilter = (val) => {
    if(val == 'Alphabetical') {
      let sorted = products.sort((a, b) => a.name.localeCompare(b.name))
      setProducts(sorted)
    }
  }

  // Will be used for the slide out filter bar
  const [status, setStatus] = useState(false)
  
  return (
    <>
    <div className="relative w-screen h-[8vh] bg-[#DC965A] flex flex-row items-center justify-evenly p-[.6rem]">
      <button className='w-[3%] bg-[#242325] h-full underline text-[#BBB891] absolute  left-0 top-0 text-decoration-line'>Filter</button>
      <button className='bg-[#BBB891] w-[8%] h-[95%] font-semibold border-2 cursor-pointer' onClick={() => updateSearch()}>Search</button>
      <input onKeyUp={(e) => { if(e.key == 'Enter') updateSearch() }} onChange={(event) => setSearch(event.target.value)} className='w-[60%] h-[95%] p-[.4rem] bg-[#C8C8C8]' type="text" name="" id="" placeholder='Search for products...'/>
      <select onChange={(e) => updateFilter(e.target.value)} className=' h-[95%] w-[8%]' name="" id="">
        <option value="Popular">Popular</option>
        <option value="Download">Download</option>
        <option value="Print Count">Print Count</option>
        <option value="Alphabetical">Alphabetical</option>
      </select>
    </div>

    <div className='w-screen relative min-h-[84vh]  flex-row flex p-6 flex-wrap justify-around bg-[#CED4DB gap-8'>
      {
        // Generates the products based off of the object array products
        products.map((x, index) => <Product key={index} like={x.likes} dislike={x.dislikes} price={x.price} featured={x.featured} user={x.user} name={x.name} url={x.url} />)
      } 
     </div>

    
    </>
  )
}

export default Page

