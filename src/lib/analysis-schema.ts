
import { z } from "zod";

// Individual job requirement evaluation returned by Gemini.
export const requirementEvaluationSchema = z.object({
  requirement: z.string().min(1),

  importance: z.enum([
    "mandatory",
    "preferred",
    "optional",
  ]),

  status: z.enum([
    "matched",
    "partially_matched",
    "not_evidenced",
  ]),

  evidenceStrength: z.enum([
    "strong",
    "moderate",
    "weak",
    "none",
  ]),

  evidence: z.string(),

  reason: z.string().min(1),
});

// Intermediate AI evaluation.
// This is not the final result stored in the database.
export const aiEvaluationSchema = z.object({
  requirements: z
    .array(requirementEvaluationSchema)
    .min(1)
    .max(30),

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

export type AIEvaluation = z.infer<
  typeof aiEvaluationSchema
>;

// Existing final analysis format.
// Keep this compatible with the database and UI.
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
