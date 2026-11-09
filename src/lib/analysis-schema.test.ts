
import { describe, expect, it } from "vitest";
import { resumeAnalysisSchema } from "./analysis-schema";

const validAnalysis = {
  matchScore: 85,
  scoreRationale: "The candidate has strong relevant experience.",
  matchingSkills: [
    {
      skill: "React",
      evidence: "Built frontend applications using React.",
    },
    {
      skill: "TypeScript",
      evidence: "Used TypeScript in professional projects.",
    },
  ],
  skillGaps: [
    {
      skill: "Docker",
      reason: "No Docker experience was mentioned.",
    },
  ],
  interviewQuestions: [
    {
      question: "How do you manage state in React?",
      purpose: "Evaluate React knowledge.",
    },
    {
      question: "Explain TypeScript interfaces.",
      purpose: "Evaluate TypeScript knowledge.",
    },
    {
      question: "How do you debug API errors?",
      purpose: "Evaluate debugging skills.",
    },
  ],
};

describe("Resume Analysis Schema", () => {
  it("accepts a valid AI analysis", () => {
    const result = resumeAnalysisSchema.safeParse(validAnalysis);

    expect(result.success).toBe(true);
  });

  it("rejects a match score below 0", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      matchScore: -5,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a match score above 100", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      matchScore: 105,
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than 5 matching skills", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      matchingSkills: Array(6).fill({
        skill: "React",
        evidence: "Used React.",
      }),
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than 3 skill gaps", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      skillGaps: Array(4).fill({
        skill: "Docker",
        reason: "No experience mentioned.",
      }),
    });

    expect(result.success).toBe(false);
  });

  it("rejects fewer than 3 interview questions", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      interviewQuestions: validAnalysis.interviewQuestions.slice(0, 2),
    });

    expect(result.success).toBe(false);
  });
});
