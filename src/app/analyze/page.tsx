"use client";

import { useState } from "react";
import {
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
} from "lucide-react";

// The structure of the analysis returned by our API.
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
      ? "text-green-600"
      : matchScore >= 60
        ? "text-yellow-600"
        : "text-red-600";

  const scoreLabel =
    matchScore >= 80
      ? "Strong Match"
      : matchScore >= 60
        ? "Moderate Match"
        : "Low Match";

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Sparkles size={16} />
            AI-Powered Recruitment
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            New Resume Analysis
          </h1>

          <p className="mt-2 text-gray-600">
            Evaluate how well a candidate&apos;s resume matches a job description.
          </p>
        </div>

        {/* Upload form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Job description */}
          <div>
            <label
              htmlFor="jobDescription"
              className="mb-2 block font-semibold text-gray-800"
            >
              Job Description
            </label>

            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
                setResult(null);
              }}
              placeholder="Paste the complete job description here..."
              rows={8}
              maxLength={20000}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
            />

            <p className="mt-1 text-right text-xs text-gray-500">
              {jobDescription.length.toLocaleString()} / 20,000 characters
            </p>
          </div>

          {/* Resume upload */}
          <div>
            <label
              htmlFor="resume"
              className="mb-2 block font-semibold text-gray-800"
            >
              Candidate Resume
            </label>

            <label
              htmlFor="resume"
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center transition ${
                isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30"
              }`}
            >
              <FileUp size={36} className="mb-3 text-indigo-600" />

              <span className="font-medium text-gray-700">
                Upload candidate resume
              </span>

              <span className="mt-1 text-sm text-gray-500">
                PDF, DOCX or TXT (maximum 5 MB)
              </span>

              <input
                id="resume"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>

            {/* Selected file */}
            {resume && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText
                    size={20}
                    className="shrink-0 text-indigo-600"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {resume.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(resume.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeResume}
                  disabled={isSubmitting}
                  className="rounded p-1 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                  aria-label="Remove resume"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              </>
            )}
          </button>

          {isSubmitting && (
            <p
              role="status"
              className="text-center text-sm text-gray-500"
            >
              Extracting resume information and evaluating candidate suitability...
            </p>
          )}
        </form>

        {/* Analysis results */}
        {result && (
          <section className="mt-10 space-y-6">

            {/* Results heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <CheckCircle2 size={16} />
                  Analysis completed
                </div>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Screening Results
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {result.resumeName}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw size={16} />
                New Analysis
              </button>
            </div>

            {/* Match score */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-8 border-indigo-100">
                  <span className={`text-4xl font-bold ${scoreColor}`}>
                    {matchScore}
                  </span>

                  <span className="text-sm text-gray-500">
                    out of 100
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" />

                    <h3 className="text-lg font-semibold text-gray-900">
                      Candidate Match Score
                    </h3>
                  </div>

                  <p className={`mt-2 text-xl font-bold ${scoreColor}`}>
                    {scoreLabel}
                  </p>

                  <p className="mt-3 leading-relaxed text-gray-600">
                    {result.analysis.scoreRationale}
                  </p>
                </div>
              </div>

              {/* Score progress bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>

                <div
                  className="h-3 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-valuenow={matchScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Candidate match score"
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp size={20} />

                  <span className="font-medium">
                    Matching Skills
                  </span>
                </div>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {result.analysis.matchingSkills.length}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Relevant skills identified
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle size={20} />

                  <span className="font-medium">
                    Skill Gaps
                  </span>
                </div>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {result.analysis.skillGaps.length}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Requirements not sufficiently demonstrated
                </p>
              </div>
            </div>

            {/* Matching skills */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={21} />

                <h3 className="text-lg font-semibold text-gray-900">
                  Matching Skills
                </h3>
              </div>

              {result.analysis.matchingSkills.length > 0 ? (
                <div className="space-y-4">
                  {result.analysis.matchingSkills.map((item, index) => (
                    <div
                      key={`${item.skill}-${index}`}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.skill}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Resume evidence:{" "}
                        </span>
                        {item.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No matching skills were identified.
                </p>
              )}
            </div>

            {/* Skill gaps */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <AlertCircle className="text-orange-600" size={21} />

                <h3 className="text-lg font-semibold text-gray-900">
                  Skill Gaps
                </h3>
              </div>

              {result.analysis.skillGaps.length > 0 ? (
                <div className="space-y-4">
                  {result.analysis.skillGaps.map((item, index) => (
                    <div
                      key={`${item.skill}-${index}`}
                      className="rounded-lg border border-orange-100 bg-orange-50/50 p-4"
                    >
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {item.skill}
                      </span>

                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  No significant skill gaps were identified by the AI.
                </div>
              )}
            </div>

            {/* Interview questions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CircleHelp className="text-indigo-600" size={21} />

                <h3 className="text-lg font-semibold text-gray-900">
                  Suggested Interview Questions
                </h3>
              </div>

              <div className="space-y-4">
                {result.analysis.interviewQuestions.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {index + 1}
                        </span>

                        <div>
                          <p className="font-semibold leading-relaxed text-gray-900">
                            {item.question}
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-gray-500">
                            <span className="font-semibold text-gray-700">
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

            <p className="pb-6 text-center text-xs leading-relaxed text-gray-500">
              AI-generated screening results are decision-support information.
              They should be reviewed by a human recruiter before making
              hiring decisions.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}