
import { NextResponse } from "next/server";
import {
  validateJobDescription,
  validateResumeFile,
} from "@/lib/analyze-input";
import { extractResumeText } from "@/lib/resume-extractor";
import { analyzeResume } from "@/lib/ai-screening";
import type { ResumeAnalysis } from "@/lib/analysis-schema";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Read the submitted form data.
    const formData = await request.formData();

    const jobDescriptionEntry = formData.get("jobDescription");
    const resumeEntry = formData.get("resume");

    // 2. Validate the job description.
    const jobDescriptionResult =
      validateJobDescription(jobDescriptionEntry);

    if (!jobDescriptionResult.success) {
      return NextResponse.json(
        { error: jobDescriptionResult.error.issues[0].message },
        { status: 400 }
      );
    }

    // 3. Validate the uploaded resume.
    let validatedResume;

    try {
      validatedResume = await validateResumeFile(resumeEntry);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid resume file.",
        },
        { status: 400 }
      );
    }

    const resume = validatedResume.file;
    const extension = validatedResume.extension;

    // 4. Extract readable text from the uploaded resume.
    let extractedResumeText: string;

    try {
      extractedResumeText = await extractResumeText(resume);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to extract text from the resume.";

      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    // 5. Generate the AI resume analysis.
    let analysis: ResumeAnalysis;

    try {
      analysis = await analyzeResume(
        jobDescriptionResult.data,
        extractedResumeText
      );
    } catch (error) {
      console.error("AI analysis failed:", error);

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unable to analyze the resume. Please try again.",
        },
        { status: 502 }
      );
    }

    // 6. Save the analysis to SQLite using Prisma.
    const savedAnalysis = await prisma.analysis.create({
      data: {
        resumeName: resume.name,
        jobDescription: jobDescriptionResult.data,
        matchScore: analysis.matchScore,
        scoreRationale: analysis.scoreRationale,
        matchingSkills: JSON.stringify(analysis.matchingSkills),
        skillGaps: JSON.stringify(analysis.skillGaps),
        interviewQuestions: JSON.stringify(
          analysis.interviewQuestions
        ),
      },
    });

    // 7. Return the completed and saved analysis.
    return NextResponse.json(
      {
        success: true,
        message: "Resume analysis completed successfully.",
        data: {
          analysisId: savedAnalysis.id,
          resumeName: resume.name,
          resumeSize: resume.size,
          resumeType: extension,
          analysis,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resume analysis processing error:", error);

    return NextResponse.json(
      { error: "Unable to process and save the analysis." },
      { status: 500 }
    );
  }
}
