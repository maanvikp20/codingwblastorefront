import React from "react";
import Link from "next/link";
import {
  AiOutlineX,
  AiFillLinkedin,
  AiFillFacebook,
  AiFillYoutube,
  AiFillInstagram,
} from "react-icons/ai";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/orders", label: "Custom Orders" },
];

const SOCIAL_LINKS = [
  { icon: AiOutlineX, href: "#", label: "X / Twitter" },
  { icon: AiFillLinkedin, href: "#", label: "LinkedIn" },
  { icon: AiFillFacebook, href: "#", label: "Facebook" },
  { icon: AiFillYoutube, href: "#", label: "YouTube" },
  { icon: AiFillInstagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-[#242325] border-t border-white/5">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand col */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#DC965A] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[#242325] font-black text-[10px] leading-none">
                3D
              </span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">
              3D Print Store
            </span>
          </div>
          <p className="text-white/30 text-xs leading-relaxed max-w-xs">
            A student-run 3D print shop at West-MEC North East Campus.
            High-quality prints, custom orders, and fast turnaround.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/30 hover:text-[#DC965A] transition-colors text-base"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Nav links col */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-4">
            Navigation
          </p>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact col */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#BBB891] mb-4">
            Contact
          </p>
          <ul className="flex flex-col gap-2.5 text-sm text-white/40">
            <li>support@3dprintstore.com</li>
            <li>West-MEC North East Campus</li>
            <li className="pt-2 border-t border-white/5">
              <span className="text-white/25 text-xs">
                Mon - Fri: 9am - 5pm
              </span>
              <br />
              <span className="text-white/25 text-xs">Sat: 10am - 3pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-4 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/20 text-xs">
          2026 3D Print Store. All rights reserved.
        </p>
        <p className="text-white/20 text-xs">West-MEC North East Campus</p>
      </div>
    </footer>
  );
}
