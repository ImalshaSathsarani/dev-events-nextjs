
"use client";
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/contexts/UserContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}


export default  function Navbar() {
  const { user } = useUser();
 
  //const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`${BASE_URL}/api/currentUser`,{
  //           credentials: "include",
  //       });
  //       const data = await res.json();
  //       console.log("Current user:", data.user)
  //       if (data.success) setUser(data.user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchUser();
  // }, []);
  return (
  
   <header className="w-full bg-dark-200">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.png" alt="logo" width={32} height={32} />
          <p className="text-white text-xl font-semibold">DevEvent</p>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-6 text-white font-medium">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>

          {!user && <Link href="/login">Login</Link>}

          {user && (
            <div className="flex items-center gap-4 relative group">
              {/* Username */}
              <button className="bg-primary text-black px-3 py-1 rounded-lg">
                {user.name}
              </button>
               <Link 
                href ="/createEvent"
                className="bg-primary text-black px-3 py-1 rounded-lg">Create Event</Link>

              {/* Dropdown */}
              <div className="hidden group-hover:flex flex-col absolute right-33 mt-15 bg-dark-300 border 1px solid primary rounded-lg ">
                <LogoutButton />
              </div>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}


