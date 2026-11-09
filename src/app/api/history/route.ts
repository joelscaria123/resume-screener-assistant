
import { NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";
import { historyQuerySchema } from "@/lib/history-query";



export async function GET(request: Request) {

      const { searchParams } = new URL(request.url);
  try {

    const queryResult = historyQuerySchema.safeParse({
      search: searchParams.get("search") ?? "",
      minScore: searchParams.get("minScore") ?? undefined,
      maxScore: searchParams.get("maxScore") ?? undefined,
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
    });

    if (!queryResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search or filter parameters.",
          details: queryResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { search, minScore, maxScore, page, limit } =
      queryResult.data;

    // 2. Validate the score range.
    if (
      minScore !== undefined &&
      maxScore !== undefined &&
      minScore > maxScore
    ) {
      return NextResponse.json(
        { error: "Minimum score cannot exceed maximum score." },
        { status: 400 }
      );
    }

    // 3. Build the database filters.
    const where = {
      ...(search
        ? {
            OR: [
              {
                resumeName: {
                  contains: search,
                },
              },
              {
                jobDescription: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
      ...(minScore !== undefined || maxScore !== undefined
        ? {
            matchScore: {
              ...(minScore !== undefined ? { gte: minScore } : {}),
              ...(maxScore !== undefined ? { lte: maxScore } : {}),
            },
          }
        : {}),
    };

    // 4. Calculate pagination.
    const skip = (page - 1) * limit;

    // 5. Retrieve records and total count.
    const [analyses, total] = await prisma.$transaction([
      prisma.analysis.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          resumeName: true,
          matchScore: true,
          scoreRationale: true,
          createdAt: true,
        },
      }),
      prisma.analysis.count({ where }),
    ]);

    // 6. Return the results.
    return NextResponse.json(
      {
        success: true,
        data: analyses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("History retrieval error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve analysis history." },
      { status: 500 }
    );
  }
}
