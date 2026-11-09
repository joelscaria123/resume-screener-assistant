
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  History,
  FileText,
  X,
  CalendarDays,
  ArrowUpRight,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type AnalysisRecord = {
  id: string;
  resumeName: string;
  matchScore: number;
  scoreRationale: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type HistoryResponse = {
  success: boolean;
  data: AnalysisRecord[];
  pagination: Pagination;
  message?: string;
};

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [minScoreInput, setMinScoreInput] = useState("");
  const [maxScoreInput, setMaxScoreInput] = useState("");

  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });

        if (search) params.set("search", search);
        if (minScore !== "") params.set("minScore", minScore);
        if (maxScore !== "") params.set("maxScore", maxScore);

        const response = await fetch(
          `/api/history?${params.toString()}`
        );

        const result: HistoryResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load analysis history."
          );
        }

        if (!cancelled) {
          setAnalyses(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading history."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [page, search, minScore, maxScore, refreshKey]);

  function handleSearch() {
    setSearch(searchInput.trim());
    setMinScore(minScoreInput);
    setMaxScore(maxScoreInput);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setMinScoreInput("");
    setMaxScoreInput("");

    setSearch("");
    setMinScore("");
    setMaxScore("");

    setPage(1);
    setRefreshKey((current) => current + 1);
  }

  function refreshHistory() {
    setRefreshKey((current) => current + 1);
  }

  function getScoreStyle(score: number) {
    if (score >= 80) {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    }

    if (score >= 60) {
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    }

    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const hasActiveFilters =
    search !== "" || minScore !== "" || maxScore !== "";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
              aria-label="Go to dashboard"
            >
              <Sparkles size={19} />
            </Link>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Resume Screener
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analysis History
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 sm:block"
            >
              Dashboard
            </Link>

            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">New Analysis</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:py-10">

        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <History size={13} />
              Candidate Records
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Analysis History
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              View, search, and revisit your previous resume screening
              results.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshHistory}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh History
          </button>
        </section>

        {/* Summary card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FileSearch size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total matching analyses
              </p>

              <p className="mt-0.5 text-2xl font-bold tracking-tight">
                {pagination.total.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <SlidersHorizontal size={18} />
            </div>

            <div>
              <h2 className="font-semibold tracking-tight">
                Search and Filters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Narrow down results using keywords and match scores.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Search analyses
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="search"
                  type="text"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                  placeholder="Resume name or job description..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:placeholder:text-slate-600 dark:focus:bg-slate-950"
                />
              </div>
            </div>

            {/* Minimum score */}
            <div>
              <label
                htmlFor="minScore"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Minimum Score
              </label>

              <input
                id="minScore"
                type="number"
                min="0"
                max="100"
                value={minScoreInput}
                onChange={(event) =>
                  setMinScoreInput(event.target.value)
                }
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:placeholder:text-slate-600 dark:focus:bg-slate-950"
              />
            </div>

            {/* Maximum score */}
            <div>
              <label
                htmlFor="maxScore"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Maximum Score
              </label>

              <input
                id="maxScore"
                type="number"
                min="0"
                max="100"
                value={maxScoreInput}
                onChange={(event) =>
                  setMaxScoreInput(event.target.value)
                }
                placeholder="100"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:placeholder:text-slate-600 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          {/* Filter actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Search size={16} />
              Apply Filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              disabled={
                !hasActiveFilters &&
                !searchInput &&
                !minScoreInput &&
                !maxScoreInput
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>

            {hasActiveFilters && (
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Filters applied
              </span>
            )}
          </div>
        </section>

        {/* Previous analyses */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6 dark:border-slate-800">
            <div>
              <h2 className="font-semibold tracking-tight">
                Previous Analyses
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your saved candidate screening records
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FileText size={18} />
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center px-5 py-20">
              <RefreshCw
                size={27}
                className="animate-spin text-indigo-600 dark:text-indigo-400"
              />

              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                Loading analysis history...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Retrieving saved records
              </p>
            </div>

          ) : error ? (
            /* Error state */
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={23} />
              </div>

              <h3 className="mt-4 font-semibold">
                Unable to load history
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={refreshHistory}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>

          ) : analyses.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <FileSearch size={26} />
              </div>

              <h3 className="mt-4 font-semibold">
                No analyses found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {hasActiveFilters
                  ? "No analyses match your current filters. Try changing or clearing them."
                  : "You haven't analyzed any resumes yet. Start by creating your first analysis."}
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X size={15} />
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/analyze"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  <Sparkles size={16} />
                  Start New Analysis
                </Link>
              )}
            </div>

          ) : (
            <>
              {/* Desktop table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Resume
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Match Score
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Analysis ID
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {analyses.map((analysis) => (
                      <tr
                        key={analysis.id}
                        className="transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/history/${analysis.id}`}
                            className="group flex items-center gap-3 font-medium text-slate-800 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              <FileText size={18} />
                            </div>

                            <span className="max-w-xs truncate text-sm">
                              {analysis.resumeName}
                            </span>
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold tabular-nums ${getScoreStyle(
                              analysis.matchScore
                            )}`}
                          >
                            {analysis.matchScore}%
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CalendarDays
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            {formatDate(analysis.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            {analysis.id.slice(0, 12)}...
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/history/${analysis.id}`}
                            aria-label={`View analysis for ${analysis.resumeName}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          >
                            <ArrowUpRight size={17} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {pagination.total === 0
                      ? 0
                      : (page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {Math.min(
                      page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {pagination.total}
                  </span>{" "}
                  analyses
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={page <= 1 || isLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="px-2 text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
                    Page {page} of {Math.max(1, pagination.totalPages)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination.totalPages, current + 1)
                      )
                    }
                    disabled={
                      page >= pagination.totalPages || isLoading
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Resume Screener Assistant · AI-powered candidate evaluation
        </footer>
      </div>
    </main>
  );
}
