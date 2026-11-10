
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  MessageSquare,
  Loader2,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading analysis...
        </div>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Unable to load analysis
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {error || "The requested analysis could not be found."}
          </p>

          <Link
            href="/history"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
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
      ? "text-green-600 dark:text-green-400"
      : analysis.matchScore >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const scoreBarColor =
    analysis.matchScore >= 80
      ? "bg-green-500"
      : analysis.matchScore >= 60
        ? "bg-amber-500"
        : "bg-red-500";

const formattedDate = new Date(record.createdAt).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <FileText className="h-5 w-5" />
            </div>

            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Resume Screener
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Dashboard
              </Link>

              <Link
                href="/history"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400"
              >
                History
              </Link>

              <Link
                href="/analyze"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                New Analysis
              </Link>
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/history"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis History
        </Link>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <FileText className="h-4 w-4" />
              Resume Analysis Report
            </div>

            <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {record.resumeName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays className="h-4 w-4" />
              <span>Analyzed on {formattedDate}</span>
            </div>
          </div>

          <Link
            href="/analyze"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            New Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Match Score and Explanation */}
        <section className="mb-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Overall Match Score
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="mt-5 flex items-baseline gap-1">
              <span className={`text-5xl font-bold tracking-tight ${scoreColor}`}>
                {analysis.matchScore}
              </span>

              <span className="text-lg text-slate-400 dark:text-slate-500">
                /100
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                style={{ width: `${analysis.matchScore}%` }}
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              AI-generated estimate. Final hiring decisions require human
              review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Score Explanation
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Why this score was assigned
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {analysis.scoreRationale}
            </p>
          </div>
        </section>

        {/* Matching Skills */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Matching Skills
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Skills supported by resume evidence
                </p>
              </div>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
              {analysis.matchingSkills.length} found
            </span>
          </div>

          {analysis.matchingSkills.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              No matching skills were identified.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.matchingSkills.map((item, index) => (
                <div
                  key={`${item.skill}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {item.skill}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.evidence}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skill Gaps */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Skill Gaps
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requirements not sufficiently demonstrated
                </p>
              </div>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              {analysis.skillGaps.length} identified
            </span>
          </div>

          {analysis.skillGaps.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              The AI did not identify any specific skill gaps.
            </p>
          ) : (
            <div className="space-y-4">
              {analysis.skillGaps.map((item, index) => (
                <div
                  key={`${item.skill}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {item.skill}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Interview Questions */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
              <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Suggested Interview Questions
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Questions to help verify candidate suitability
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.interviewQuestions.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Question {index + 1}
                </p>

                <h3 className="mt-3 font-semibold leading-7 text-slate-900 dark:text-white">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Purpose:{" "}
                  </span>
                  {item.purpose}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Original Job Description */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <BriefcaseBusiness className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Original Job Description
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                The job requirements used for this analysis
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-600 dark:text-slate-300">
              {record.jobDescription}
            </pre>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
          <Link
            href="/history"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Analyze Another Resume
            <ArrowRight className="h-4 w-4" />
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
        <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            Loading analysis page...
          </div>
        </main>
      }
    >
      <AnalysisDetailsContent />
    </Suspense>
  );
}
