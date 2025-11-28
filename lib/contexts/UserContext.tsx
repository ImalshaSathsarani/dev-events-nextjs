"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user on first load
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/currentUser`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside a UserProvider");
  return context;
};
