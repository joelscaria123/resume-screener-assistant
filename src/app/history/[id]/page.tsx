
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  MessageSquare,
  Loader2,
} from "lucide-react";

type Analysis = {
  matchScore: number;
  scoreRationale: string;
  matchingSkills: {
    skill: string;
    evidence: string;
  }[];
  skillGaps: {
    skill: string;
    reason: string;
  }[];
  interviewQuestions: {
    question: string;
    purpose: string;
  }[];
};

type AnalysisDetails = {
  id: string;
  resumeName: string;
  jobDescription: string;
  createdAt: string;
  analysis: Analysis;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: AnalysisDetails;
};

function AnalysisDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [record, setRecord] = useState<AnalysisDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/history/${id}`);
        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load analysis details."
          );
        }

        if (!cancelled) {
          setRecord(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the analysis."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchAnalysis();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading analysis...
        </div>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

          <h1 className="text-xl font-semibold text-slate-900">
            Unable to load analysis
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error || "The requested analysis could not be found."}
          </p>

          <Link
            href="/history"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>
        </div>
      </main>
    );
  }

  const { analysis } = record;

  const scoreColor =
    analysis.matchScore >= 80
      ? "text-green-600"
      : analysis.matchScore >= 60
        ? "text-amber-600"
        : "text-red-600";

  const formattedDate = new Date(record.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/history"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis History
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <FileText className="h-4 w-4" />
            Resume Analysis
          </div>

          <h1 className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {record.resumeName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Analysis created on {formattedDate}
          </p>
        </div>

        {/* Match Score and Explanation */}
        <section className="mb-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-1">
            <p className="text-sm font-medium text-slate-500">
              Overall Match Score
            </p>

            <div className="mt-3 flex items-baseline gap-1">
              <span className={`text-5xl font-bold ${scoreColor}`}>
                {analysis.matchScore}
              </span>

              <span className="text-lg text-slate-400">/100</span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  analysis.matchScore >= 80
                    ? "bg-green-500"
                    : analysis.matchScore >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${analysis.matchScore}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              AI-generated estimate. Final hiring decisions require human
              review.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />

              <h2 className="font-semibold text-slate-900">
                Score Explanation
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {analysis.scoreRationale}
            </p>
          </div>
        </section>

        {/* Matching Skills */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Matching Skills
            </h2>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              {analysis.matchingSkills.length} found
            </span>
          </div>

          {analysis.matchingSkills.length === 0 ? (
            <p className="text-sm text-slate-500">
              No matching skills were identified.
            </p>
          ) : (
            <div className="space-y-4">
              {analysis.matchingSkills.map((item, index) => (
                <div
                  key={`${item.skill}-${index}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <h3 className="font-medium text-slate-900">
                    {item.skill}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.evidence}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skill Gaps */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Skill Gaps
            </h2>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {analysis.skillGaps.length} identified
            </span>
          </div>

          {analysis.skillGaps.length === 0 ? (
            <p className="text-sm text-slate-500">
              The AI did not identify any specific skill gaps.
            </p>
          ) : (
            <div className="space-y-4">
              {analysis.skillGaps.map((item, index) => (
                <div
                  key={`${item.skill}-${index}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <h3 className="font-medium text-slate-900">
                    {item.skill}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Interview Questions */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Suggested Interview Questions
            </h2>
          </div>

          <div className="space-y-4">
            {analysis.interviewQuestions.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Question {index + 1}
                </p>

                <h3 className="mt-2 font-medium leading-6 text-slate-900">
                  {item.question}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <span className="font-medium">Purpose: </span>
                  {item.purpose}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Original Job Description */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Original Job Description
          </h2>

          <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-600">
            {record.jobDescription}
          </pre>
        </section>

        <div className="flex justify-end">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AnalysisDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-600">Loading analysis page...</p>
        </main>
      }
    >
      <AnalysisDetailsContent />
    </Suspense>
  );
}
