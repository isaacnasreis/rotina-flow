import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("flow_session");
  return NextResponse.json({ success: true });
}
