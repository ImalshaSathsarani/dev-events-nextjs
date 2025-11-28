"use server";

import User from "@/database/user.model";
import connectDB from "../mongodb";
import { generateToken } from "../auth/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const registerUser = async ({
    name,
    email,
    phone,
    password,
}:{
    name:string;
    email:string;
    phone:string;
    password:string;
}) => {
    try{
        await connectDB();

        const userExists = await User.findOne({ email });
        if(userExists){
            return { success:false, message:"Email already in use"};
        }
          const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    const token = generateToken({ id: user._id, email:user.email});

     // Set secure cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

     // Convert Mongoose doc to plain object before returning
    const plainUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { success: true, user:plainUser };
    }catch (e) {
    console.error("Registration failed", e);
    return { success: false, message: "Registration failed" };
  }
}

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = generateToken({ id: user._id, email: user.email });

    // SET JWT cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Convert Mongoose document to plain object
    const plainUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { success: true, user:plainUser };
  } catch (e) {
    console.error("Login failed", e);
    return { success: false, message: "Login failed" };
  }
};

export const logoutUser = async () => {
  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return { success: true };
};

