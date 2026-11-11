import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/modules/leads/actions";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon";
    const body = await req.json();

    const result = await submitLead(body, ip);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message }, { status: 201 });
  } catch (error) {
    console.error("API Leads Error:", error);
    return NextResponse.json(
      { error: "Định dạng dữ liệu không hợp lệ." },
      { status: 400 }
    );
  }
}
