import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/modules/leads/actions";

export async function POST(req: NextRequest) {
  try {
    const realIp = req.headers.get("x-real-ip");
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      realIp?.trim() ||
      forwardedFor?.split(",")[0]?.trim() ||
      "anon";

    const body = await req.json();

    const result = await submitLead(body, ip);

    if (!result.success) {
      if ((result as any).rateLimited) {
        return NextResponse.json(
          { error: result.message },
          {
            status: 429,
            headers: {
              "Retry-After": "60",
            },
          }
        );
      }
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
