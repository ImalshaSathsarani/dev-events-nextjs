"use client";

import { useUser } from "@/lib/contexts/UserContext";
import { logoutUser } from "../lib/actions/auth.actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    await logoutUser(); 
    setUser(null);
     //router.refresh();        // delete JWT cookie (server action)
    router.push("/"); // redirect to login
       // refresh navbar state
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white px-4 py-2 hover:bg-dark-400 rounded-lg text-left"
    >
      Logout
    </button>
  );
}
