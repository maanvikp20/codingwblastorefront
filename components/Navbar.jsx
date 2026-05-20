"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiPenTool,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiSettings,
  FiMenu,
  FiX,
  FiShield,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

function decodeToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(decodeToken(localStorage.getItem("token")));

    const handleStorage = () => {
      setUser(decodeToken(localStorage.getItem("token")));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authchange", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authchange", handleStorage);
    };
  }, []);

  return { user, setUser };
}

function NavLink({ href, icon: Icon, children, onClick }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-medium transition-all duration-150 px-1 py-0.5 relative group ${
        isActive ? "text-white" : "text-white/50 hover:text-white/90"
      }`}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-px bg-[#DC965A] transition-all duration-200 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuthUser();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserMenuOpen(false);
    setMobileOpen(false);
    window.dispatchEvent(new Event("authchange"));
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#242325] border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 bg-[#DC965A] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[#242325] font-black text-[10px] leading-none">
                3D
              </span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight hidden sm:block">
              3D Print Store
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/" icon={FiHome}>Home</NavLink>
            <NavLink href="/products" icon={FiShoppingBag}>Shop</NavLink>
            <NavLink href="/blog" icon={FiBookOpen}>Blog</NavLink>
            <NavLink href="/about" icon={FiInfo}>About</NavLink>
            {/* Custom orders only for logged-in non-admins */}
            {isLoggedIn && !isAdmin && (
              <NavLink href="/custom" icon={FiPenTool}>Custom Orders</NavLink>
            )}
            {isAdmin && (
              <NavLink href="/admin" icon={FiShield}>Admin</NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth"
                  className="text-white/50 hover:text-white text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  className="bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] text-xs font-bold shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() ??
                      user?.email?.charAt(0)?.toUpperCase() ??
                      "?"}
                  </div>
                  <span className="text-white text-sm font-medium max-w-24 truncate">
                    {user?.name ?? "Account"}
                  </span>
                  <FiChevronDown
                    size={13}
                    className={`text-white/40 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`absolute right-0 top-full mt-2 w-48 bg-[#2a2929] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${
                    userMenuOpen
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="p-1.5">
                    {user?.role && (
                      <div className="px-3 py-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? "bg-[#DC965A]/20 text-[#DC965A]"
                              : "bg-white/5 text-white/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FiUser size={13} /> My Account
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-white/5 my-1" />
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#DC965A]/80 hover:text-[#DC965A] hover:bg-[#DC965A]/5 transition-colors"
                        >
                          <FiShield size={13} /> Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="border-t border-white/5 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors cursor-pointer"
                    >
                      <FiLogOut size={13} /> Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-200 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute top-14 left-0 right-0 bg-[#242325] border-b border-white/5 transition-all duration-200 ${
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            <MobileLink href="/" icon={FiHome} close={() => setMobileOpen(false)}>Home</MobileLink>
            <MobileLink href="/products" icon={FiShoppingBag} close={() => setMobileOpen(false)}>Shop</MobileLink>
            <MobileLink href="/blog" icon={FiBookOpen} close={() => setMobileOpen(false)}>Blog</MobileLink>
            <MobileLink href="/about" icon={FiInfo} close={() => setMobileOpen(false)}>About</MobileLink>

            {isLoggedIn && !isAdmin && (
              <MobileLink href="/custom" icon={FiPenTool} close={() => setMobileOpen(false)}>
                Custom Orders
              </MobileLink>
            )}
            {isAdmin && (
              <MobileLink href="/admin" icon={FiShield} close={() => setMobileOpen(false)}>
                Admin Panel
              </MobileLink>
            )}

            <div className="border-t border-white/5 my-2" />

            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center border border-white/10 text-white/70 font-semibold text-sm py-2.5 rounded-xl hover:border-white/30 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-[#DC965A] text-[#242325] font-bold text-sm py-2.5 rounded-xl hover:bg-[#c8834a] transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 py-2 px-3 bg-white/5 rounded-xl mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#DC965A]/20 flex items-center justify-center text-[#DC965A] font-bold text-sm shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {user?.name ?? "Account"}
                    </p>
                    <p className="text-white/30 text-xs capitalize">{user?.role}</p>
                  </div>
                </div>

                <MobileLink href="/account" icon={FiUser} close={() => setMobileOpen(false)}>
                  My Account
                </MobileLink>

                {isAdmin && (
                  <MobileLink href="/admin/products" icon={FiSettings} close={() => setMobileOpen(false)}>
                    Manage Products
                  </MobileLink>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors cursor-pointer w-full"
                >
                  <FiLogOut size={15} />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MobileLink({ href, icon: Icon, children, close }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={close}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#DC965A]/10 text-[#DC965A]"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </Link>
  );
}