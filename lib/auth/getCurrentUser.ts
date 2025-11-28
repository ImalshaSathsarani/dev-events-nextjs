import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import User, { IUser } from "@/database/user.model";
import connectDB from "../mongodb";

interface JwtUserPayload {
  id: string;
  email: string;
}

export const getCurrentUser = async (): Promise<IUser | null> => {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token) as JwtUserPayload | null;
  if (!decoded || !decoded.id) return null;

  const user = await User.findById(decoded.id).select("-password");
  console.log("Backend current user:", user)
  return user as IUser;
};
