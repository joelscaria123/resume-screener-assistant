
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
  Filter,
  X,
} from "lucide-react";

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

        const response = await fetch(`/api/history?${params.toString()}`);

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
      return "bg-green-100 text-green-700";
    }

    if (score >= 60) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles size={20} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            ResumeAI
          </span>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <FileText size={18} />
            Dashboard
          </Link>

          <Link
            href="/analyze"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <Sparkles size={18} />
            New Analysis
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
          >
            <History size={18} />
            Analysis History
          </Link>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="text-xs text-slate-400">
            Resume Screener Assistant
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Analysis History
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              View and manage your previous resume analyses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshHistory}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/analyze"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <Sparkles size={16} />
              New Analysis
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
          {/* Summary */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileSearch size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total matching analyses
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {pagination.total}
                </p>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={18} className="text-slate-500" />

              <h2 className="font-semibold text-slate-900">
                Search and Filters
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Search by resume name or job description
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                    placeholder="Search analyses..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="minScore"
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="maxScore"
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Search size={16} />
                Apply Filters
              </button>

              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters && !searchInput && !minScoreInput && !maxScoreInput}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          </section>

          {/* History Table */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Previous Analyses
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw
                  size={28}
                  className="animate-spin text-indigo-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading analysis history...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <X size={22} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Unable to load history
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {error}
                </p>

                <button
                  onClick={refreshHistory}
                  className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            ) : analyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FileSearch size={26} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No analyses found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  {hasActiveFilters
                    ? "No analyses match your current filters. Try changing or clearing them."
                    : "You haven't analyzed any resumes yet. Start by creating your first analysis."}
                </p>

                {hasActiveFilters ? (
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    href="/analyze"
                    className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    <Sparkles size={16} />
                    Start New Analysis
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Resume
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Match Score
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Date
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Analysis ID
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {analyses.map((analysis) => (
                        <tr
                          key={analysis.id}
                          className="transition-colors hover:bg-indigo-50/50"
                        >
                          <td className="px-5 py-4">
                            <Link
                              href={`/history/${analysis.id}`}
                              className="flex items-center gap-3 font-medium text-slate-800 hover:text-indigo-700"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <FileText size={17} />
                              </div>

                              <span className="max-w-xs truncate">
                                {analysis.resumeName}
                              </span>
                            </Link>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreStyle(
                                analysis.matchScore
                              )}`}
                            >
                              {analysis.matchScore}%
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(analysis.createdAt)}
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/history/${analysis.id}`}
                              className="font-mono text-xs text-indigo-600 hover:underline"
                            >
                              {analysis.id.slice(0, 12)}...
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {pagination.total === 0
                        ? 0
                        : (page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-slate-700">
                      {Math.min(
                        page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {pagination.total}
                    </span>{" "}
                    analyses
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={page <= 1 || isLoading}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <span className="px-2 text-sm text-slate-600">
                      Page {page} of {Math.max(1, pagination.totalPages)}
                    </span>

                    <button
                      onClick={() =>
                        setPage((current) =>
                          Math.min(pagination.totalPages, current + 1)
                        )
                      }
                      disabled={
                        page >= pagination.totalPages || isLoading
                      }
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
