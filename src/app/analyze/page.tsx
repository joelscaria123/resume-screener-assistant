
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileUp,
  Sparkles,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Target,
  TrendingUp,
  CircleHelp,
  Loader2,
  RotateCcw,
  BriefcaseBusiness,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Structure of the analysis returned by our API.
type ResumeAnalysis = {
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

type AnalysisResult = {
  resumeName: string;
  resumeSize: number;
  resumeType: string;
  analysis: ResumeAnalysis;
};

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setResult(null);

    const file = event.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      event.target.value = "";
      setResume(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume file must be smaller than 5 MB.");
      event.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    if (!resume) {
      setError("Please upload a candidate resume.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resume", resume);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Something went wrong."
        );
      }

      if (!responseData.data?.analysis) {
        throw new Error("The server returned an invalid analysis.");
      }

      setResult(responseData.data as AnalysisResult);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to analyze the resume."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function removeResume() {
    setResume(null);
    setError("");
    setResult(null);

    const fileInput = document.getElementById(
      "resume"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  function resetForm() {
    setJobDescription("");
    setResume(null);
    setError("");
    setResult(null);

    const fileInput = document.getElementById(
      "resume"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  const matchScore = result?.analysis.matchScore ?? 0;

  const scoreColor =
    matchScore >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : matchScore >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const scoreRingColor =
    matchScore >= 80
      ? "stroke-emerald-500"
      : matchScore >= 60
        ? "stroke-amber-500"
        : "stroke-red-500";

  const scoreBarColor =
    matchScore >= 80
      ? "bg-emerald-500"
      : matchScore >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  const scoreLabel =
    matchScore >= 80
      ? "Strong Match"
      : matchScore >= 60
        ? "Moderate Match"
        : "Low Match";

  const scoreCircumference = 2 * Math.PI * 54;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={17} />
            </Link>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Resume Screener
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/history"
              className="hidden items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 sm:flex"
            >
              Analysis History
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-8 lg:py-10">

        {/* Page heading */}
        <section>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Sparkles size={13} />
            AI-Powered Recruitment
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            New Resume Analysis
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Evaluate how well a candidate&apos;s resume matches a job
            description. Identify relevant skills, potential gaps, and
            useful interview questions.
          </p>
        </section>

        {/* Analysis form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:p-7 dark:border-slate-800 dark:bg-slate-900"
        >

          {/* Form heading */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <h2 className="font-semibold tracking-tight">
                Candidate Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide the job requirements and candidate resume.
              </p>
            </div>
          </div>

          {/* Job description */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="jobDescription"
                className="text-sm font-semibold"
              >
                Job Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                Required
              </span>
            </div>

            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
                setResult(null);
              }}
              placeholder="Paste the complete job description here. Include responsibilities, required skills, qualifications, and experience..."
              rows={9}
              maxLength={20000}
              disabled={isSubmitting}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/50 dark:placeholder:text-slate-600 dark:focus:bg-slate-950"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                A detailed job description helps improve evaluation quality.
              </p>

              <p className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {jobDescription.length.toLocaleString()} / 20,000
              </p>
            </div>
          </div>

          {/* Resume upload */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="resume"
                className="text-sm font-semibold"
              >
                Candidate Resume
                <span className="ml-1 text-red-500">*</span>
              </label>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                Required
              </span>
            </div>

            <label
              htmlFor="resume"
              className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition sm:p-10 ${
                isSubmitting
                  ? "cursor-not-allowed border-slate-200 opacity-50 dark:border-slate-800"
                  : "cursor-pointer border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950/30 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/5"
              }`}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FileUp size={27} />
              </div>

              <span className="font-semibold">
                Click to upload candidate resume
              </span>

              <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Choose a PDF, DOCX, or TXT document
              </span>

              <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Maximum file size: 5 MB
              </span>

              <input
                id="resume"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="sr-only"
              />
            </label>

            {/* Selected file */}
            {resume && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {resume.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {(resume.size / 1024).toFixed(1)} KB
                      {" · "}
                      {resume.name.split(".").pop()?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeResume}
                  disabled={isSubmitting}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  aria-label="Remove resume"
                >
                  <X size={17} />
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                  <ChevronRight size={17} />
                </>
              )}
            </button>

            {isSubmitting && (
              <p
                role="status"
                className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400"
              >
                <Loader2 size={13} className="animate-spin" />
                Extracting resume information and evaluating candidate suitability...
              </p>
            )}
          </div>
        </form>

        {/* Analysis results */}
        {result && (
          <section className="space-y-6" aria-live="polite">

            {/* Results heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                  Analysis completed successfully
                </div>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Screening Results
                </h2>

                <p className="mt-1 max-w-md truncate text-sm text-slate-500 dark:text-slate-400">
                  {result.resumeName}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw size={16} />
                New Analysis
              </button>
            </div>

            {/* Match score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {/* Animated circular score indicator */}
                <div
                  className="relative flex h-36 w-36 shrink-0 items-center justify-center"
                  role="img"
                  aria-label={`Candidate match score: ${matchScore} out of 100. ${scoreLabel}.`}
                >
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    {/* Background ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="9"
                    />

                    {/* Score progress ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      className={`${scoreRingColor} transition-all duration-1000 ease-out`}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={scoreCircumference}
                      strokeDashoffset={
                        scoreCircumference * (1 - matchScore / 100)
                      }
                      transform="rotate(-90 60 60)"
                    />
                  </svg>

                  {/* Score text */}
                  <div className="relative flex flex-col items-center justify-center">
                    <span
                      className={`text-4xl font-bold tracking-tight ${scoreColor}`}
                    >
                      {matchScore}
                    </span>

                    <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      out of 100
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Target
                      size={20}
                      className={scoreColor}
                    />

                    <h3 className="text-lg font-semibold tracking-tight">
                      Candidate Match Score
                    </h3>
                  </div>

                  <p className={`mt-2 text-xl font-bold ${scoreColor}`}>
                    {scoreLabel}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {result.analysis.scoreRationale}
                  </p>
                </div>
              </div>

              {/* Score progress bar */}
              <div className="mt-7">
                <div className="mb-2 flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-valuenow={matchScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Candidate match score"
                >
                  <div
                    className={`h-full rounded-full ${scoreBarColor} transition-all duration-700`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={19} />
                    Matching Skills
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {result.analysis.matchingSkills.length}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Relevant skills identified
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                    <AlertCircle size={19} />
                    Skill Gaps
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <Target size={18} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {result.analysis.skillGaps.length}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Requirements not sufficiently demonstrated
                </p>
              </div>
            </div>

            {/* Matching skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <h3 className="font-semibold tracking-tight">
                    Matching Skills
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Skills supported by resume evidence
                  </p>
                </div>
              </div>

              {result.analysis.matchingSkills.length > 0 ? (
                <div className="space-y-3">
                  {result.analysis.matchingSkills.map((item, index) => (
                    <div
                      key={`${item.skill}-${index}`}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                    >
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {item.skill}
                      </span>

                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Resume evidence:{" "}
                        </span>
                        {item.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                  No matching skills were identified.
                </p>
              )}
            </div>

            {/* Skill gaps */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <AlertCircle size={19} />
                </div>

                <div>
                  <h3 className="font-semibold tracking-tight">
                    Skill Gaps
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Requirements not sufficiently demonstrated
                  </p>
                </div>
              </div>

              {result.analysis.skillGaps.length > 0 ? (
                <div className="space-y-3">
                  {result.analysis.skillGaps.map((item, index) => (
                    <div
                      key={`${item.skill}-${index}`}
                      className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-500/15 dark:bg-orange-500/5"
                    >
                      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                        {item.skill}
                      </span>

                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  No significant skill gaps were identified by the AI.
                </div>
              )}
            </div>

            {/* Interview questions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <CircleHelp size={19} />
                </div>

                <div>
                  <h3 className="font-semibold tracking-tight">
                    Suggested Interview Questions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Questions to help verify candidate suitability
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.analysis.interviewQuestions.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                            {item.question}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              Purpose:{" "}
                            </span>
                            {item.purpose}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Human review notice */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
              />

              <p className="text-xs leading-6 text-amber-800 dark:text-amber-300">
                AI-generated screening results are decision-support
                information. They should be reviewed by a human recruiter
                before making hiring decisions.
              </p>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Resume Screener Assistant · AI-powered candidate evaluation
        </footer>
      </div>
    </main>
  );
}
