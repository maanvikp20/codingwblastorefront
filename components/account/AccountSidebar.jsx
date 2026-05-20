"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import Image from "next/image"

const links = [
  {
        label: "Overview",
        href: "/account",
    },
    {
        label: "My Purchases",
        href: "/account/user",
    },
    {
        label: "Admin",
        href: "/account/admin",
    },
]

const AccountSidebar = () =>{
    const pathname = usePathname()
    return(
        <aside className="rounded-3xl border border-neutral-800 bg-[#111111] p-6 shadow-xl">
            <div className="flex flex-col items-center border-b border-neutral-800 pb-6">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-orange-400">
                    <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="profile" fill className="object-cover"></Image>
                </div>
                <h2>WBLA User</h2>
                <p>Member since:</p>
            </div>

            <nav className="mt-6 space-y-2">
                {links.map((link) =>{
                    const active = pathname === link.href
                    return(
                        <Link key={link.href} href={link.href} className={`block rounded-2xl px-4 py-3 font-semibold transition ${
                            active
                              ? "bg-orange-500 text-black"
                              : "bg-[#1a1a1a] text-neutral-300 hover:bg-[#242424]"
                            }`}
                        >
                        {link.label}</Link>
                    )
                })}
            </nav>

            <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                <p className="text-sm text-orange-200">Your storefront profile is 78% complete</p>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full w-[78%] rounded-full bg-orange-400" />
                </div>
            </div>
        </aside>
    )    
}

export default AccountSidebar