
import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  matchScore: z
    .number()
    .int()
    .min(0)
    .max(100),

  scoreRationale: z
    .string()
    .min(1),

  matchingSkills: z
    .array(
      z.object({
        skill: z.string().min(1),
        evidence: z.string().min(1),
      })
    )
    .max(5),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().min(1),
        reason: z.string().min(1),
      })
    )
    .max(3),

  interviewQuestions: z
    .array(
      z.object({
        question: z.string().min(1),
        purpose: z.string().min(1),
      })
    )
    .length(3),
});

export type ResumeAnalysis = z.infer<
  typeof resumeAnalysisSchema
>;
