
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resumeAnalysisSchema } from "@/lib/analysis-schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid analysis ID.",
        },
        { status: 400 }
      );
    }

    const record = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "Analysis not found.",
        },
        { status: 404 }
      );
    }

    const analysis = resumeAnalysisSchema.parse({
      matchScore: record.matchScore,
      scoreRationale: record.scoreRationale,
      matchingSkills: JSON.parse(record.matchingSkills),
      skillGaps: JSON.parse(record.skillGaps),
      interviewQuestions: JSON.parse(record.interviewQuestions),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        resumeName: record.resumeName,
        jobDescription: record.jobDescription,
        createdAt: record.createdAt,
        analysis,
      },
    });
  } catch (error) {
    console.error("Analysis details retrieval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve analysis details.",
      },
      { status: 500 }
    );
  }
}
