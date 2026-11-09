
import {
  resumeAnalysisSchema,
  type ResumeAnalysis,
} from "./analysis-schema";

export function parseAIResponse(
  responseText: string | undefined
): ResumeAnalysis {
  if (!responseText) {
    throw new Error("The AI returned an empty response.");
  }

  let parsedResponse: unknown;

  try {
    parsedResponse = JSON.parse(responseText);
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  const validationResult =
    resumeAnalysisSchema.safeParse(parsedResponse);

  if (!validationResult.success) {
    console.error(
      "AI response validation failed:",
      validationResult.error.issues
    );

    throw new Error(
      "The AI response did not match the required analysis format."
    );
  }

  return validationResult.data;
}
