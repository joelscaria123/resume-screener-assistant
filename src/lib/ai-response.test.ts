import { describe, expect, it } from "vitest";
import { parseAIResponse } from "./ai-response";

const validResponse = {
  matchScore: 85,
  scoreRationale: "The candidate demonstrates relevant technical skills.",
  matchingSkills: [
    {
      skill: "React",
      evidence: "Built applications using React.",
    },
  ],
  skillGaps: [
    {
      skill: "Docker",
      reason: "No Docker experience was demonstrated.",
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

describe("AI Response Parsing", () => {
  it("accepts a valid JSON response", () => {
    const result = parseAIResponse(JSON.stringify(validResponse));

    expect(result.matchScore).toBe(85);
    expect(result.matchingSkills).toHaveLength(1);
  });

  it("rejects an empty response", () => {
    expect(() => parseAIResponse(undefined)).toThrow(
      "The AI returned an empty response."
    );
  });

  it("rejects an empty string", () => {
    expect(() => parseAIResponse("")).toThrow(
      "The AI returned an empty response."
    );
  });

  it("rejects malformed JSON", () => {
    expect(() => parseAIResponse("{invalid json")).toThrow(
      "The AI returned invalid JSON."
    );
  });

  it("rejects a response with a missing match score", () => {
    const invalidResponse = {
      ...validResponse,
      matchScore: undefined,
    };

    expect(() => parseAIResponse(JSON.stringify(invalidResponse))).toThrow(
      "The AI response did not match the required analysis format."
    );
  });

  it("rejects a response with an invalid score", () => {
    const invalidResponse = {
      ...validResponse,
      matchScore: 150,
    };

    expect(() => parseAIResponse(JSON.stringify(invalidResponse))).toThrow(
      "The AI response did not match the required analysis format."
    );
  });

  it("rejects a response with fewer than 3 interview questions", () => {
    const invalidResponse = {
      ...validResponse,
      interviewQuestions: validResponse.interviewQuestions.slice(0, 1),
    };

    expect(() => parseAIResponse(JSON.stringify(invalidResponse))).toThrow(
      "The AI response did not match the required analysis format."
    );
  });
});