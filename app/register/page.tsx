
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth.actions";
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

export default function CreateEvent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("phonenumber") as string;
    const password = form.get("password") as string;
    const confirm = form.get("confirmpassword") as string;

      if (password !== confirm) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }
    const res = await registerUser({ name, email,phone, password});

    setLoading(false);
     if (!res.success) {
      alert(res.message);
      return;
    }

    setUser(res.user as User)
    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);

  }

  return (
    <section className="min-h-screen w-full flex items-center justify-center text-white px-5">

      {/* Card */}
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl animate-fade-in space-y-8">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          Create an Account
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-medium">Phone Number</label>
            <input
              type="number"
              name="phonenumber"
              className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>

      {success && (
        <SuccessToast
          message="Registered successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
    </section>
  );
}
