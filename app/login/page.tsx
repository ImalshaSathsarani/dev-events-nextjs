
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/auth.actions";
import { useUser } from "@/lib/contexts/UserContext";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}


const SuccessToast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed top-5 right-5 z-50 animate-slide-in">
    <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
      <span className="text-lg">✔️</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white text-xl">
        ×
      </button>
    </div>
  </div>
);

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

     const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await loginUser({ email, password });

    setLoading(false);
  if (!res.success) {
     
    alert(res.message || "Invalid credentials");
    return;
  }
  setUser(res.user as User);

  setSuccess(true);

  setTimeout(() => {
    router.push("/");
  }, 1000);
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center  text-white px-5">

      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl animate-fade-in">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* EMAIL */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <button type="button" className="text-primary hover:underline text-sm">
              Forgot Password?
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <p className="mt-8 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Create one
          </span>
        </p>
      </div>

      {success && (
        <SuccessToast
          message="Logged in successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
    </section>
  );
}

