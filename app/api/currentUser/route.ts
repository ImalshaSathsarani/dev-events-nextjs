// pages/api/currentUser.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  return NextResponse.json({ success: !!user, user });
}
