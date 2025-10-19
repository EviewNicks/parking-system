import { NextRequest, NextResponse } from "next/server";
import { supabase, TABLE_NAME } from "@/lib/supabase";
import { calculateDistancesForSlots, sortByDistance } from "@/lib/distance";
import { ENTRANCE_COORDINATE, RECOMMENDATION_MESSAGES } from "@/lib/constants";
import { ParkingSlot, RecommendationResponse } from "@/types/parking";

/**
 * GET /api/recommend
 * Returns the nearest available parking slot based on Euclidean distance
 *
 * Query Parameters (optional for future enhancement):
 * - entry_point: 'main' | 'side' (currently defaults to main)
 * - alternatives: boolean (return top 3 options)
 */

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    // Parse query parameters for future enhancement
    const { searchParams } = new URL(request.url);
    const returnAlternatives = searchParams.get("alternatives") === "true";

    // Step 1: Query all available parking slots
    const { data: availableSlots, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("status", "kosong");

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json<RecommendationResponse>(
        {
          success: false,
          error: RECOMMENDATION_MESSAGES.DATABASE_ERROR,
        },
        { status: 500 }
      );
    }

    // Step 2: Check if there are any available slots
    if (!availableSlots || availableSlots.length === 0) {
      return NextResponse.json<RecommendationResponse>(
        {
          success: false,
          error: RECOMMENDATION_MESSAGES.NO_AVAILABLE_SLOTS,
        },
        { status: 404 }
      );
    }

    // Step 3: Calculate distance for each available slot
    const slotsWithDistance = calculateDistancesForSlots(
      availableSlots as ParkingSlot[],
      ENTRANCE_COORDINATE.x,
      ENTRANCE_COORDINATE.y
    );

    // Step 4: Sort slots by distance (ascending - nearest first)
    const sortedSlots = sortByDistance(slotsWithDistance);

    // Step 5: Filter out any slots with invalid coordinates (Infinity distance)
    const validSlots = sortedSlots.filter((slot) => slot.distance !== Infinity);

    if (validSlots.length === 0) {
      return NextResponse.json<RecommendationResponse>(
        {
          success: false,
          error: "No valid parking coordinates available",
        },
        { status: 500 }
      );
    }

    // Step 6: Get the nearest slot (first element after sorting)
    const recommendedSlot = validSlots[0];

    // Step 7: Prepare response
    const response = NextResponse.json<RecommendationResponse>({
      success: true,
      data: {
        slot: recommendedSlot,
        message: RECOMMENDATION_MESSAGES.SUCCESS(
          recommendedSlot.slot,
          recommendedSlot.distance
        ),
        total_available: validSlots.length,
      },
    });

    // Step 8: Add alternatives if requested
    if (returnAlternatives && validSlots.length > 1) {
      const recommendationData = {
        slot: recommendedSlot,
        message: RECOMMENDATION_MESSAGES.SUCCESS(
          recommendedSlot.slot,
          recommendedSlot.distance
        ),
        total_available: validSlots.length,
        alternatives: validSlots.slice(1, 3), // Top 3 alternatives
      };

      return NextResponse.json<RecommendationResponse>({
        success: true,
        data: recommendationData
      });
    }

    // Step 9: Add CORS headers for browser requests
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    console.log(
      `Recommendation served: Slot ${recommendedSlot.slot} (${recommendedSlot.distance}m) at ${timestamp}`
    );

    return response;
  } catch (error) {
    console.error("Unexpected error in recommendation API:", error);

    return NextResponse.json<RecommendationResponse>(
      {
        success: false,
        error: RECOMMENDATION_MESSAGES.INTERNAL_ERROR,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
