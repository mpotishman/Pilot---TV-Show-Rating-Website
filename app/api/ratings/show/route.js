// app/api/ratings/show/route.js
import { NextResponse } from "next/server"
import { getAllShowRatings } from "@/lib/ratings"

// GET /api/ratings/show?userId=...&showId=...
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const showId = url.searchParams.get("showId")

    if (!userId || !showId) {
      return NextResponse.json(
        { success: false, error: "Missing userId or showId query params" },
        { status: 400 }
      )
    }

    const ratings = await getAllShowRatings(userId, showId)

    return NextResponse.json({ success: true, ratings })
  } catch (err) {
    console.error("GET /api/ratings/show error:", err)
    return NextResponse.json(
      { success: false, error: "Server error fetching ratings" },
      { status: 500 }
    )
  }
}
