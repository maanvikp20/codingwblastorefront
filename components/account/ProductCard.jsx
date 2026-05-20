"use client"

import Image from "next/image"
import {useState} from "react"
import {Heart, ShoppingCart} from "lucide-react"

const ProductCard = ({item}) =>{
    const [saved, setSaved] = useState(false)

    return(
        <div className="group overflow-hidden rounded-3xl border border-neutral-800 bg-[#151515] transition hover:-translate-y-1 hover:border-orange-400/30 hover:shadow-2xl">
            <div className="relative h-56 overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover-transition duration-500 group-hover"/>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-natural-400">By {item.creator}</p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-orange-300">${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSaved(!saved)}
                        className={`rounded-xl p-2 transition ${
                            saved
                                ? "bg-orange-500 text-black"
                                : "bg-[#202020] text-neutral-300 hover:bg-[#2a2a2a]"
                        }`}
                    >
                        <Heart size={18}/>
                    </button>

                    <button className="rounded-xl bg-orange 500 p-2 text-black transition hover:bg-orange-400">
                        <ShoppingCart size={18}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard