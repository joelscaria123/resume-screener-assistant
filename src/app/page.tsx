
import {
  LayoutDashboard,
  FileSearch,
  History,
  Users,
  Settings,
  Sparkles,
  ArrowUpRight,
  FileText,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
  { name: "New Analysis", icon: FileSearch, href: "/analyze", active: false },
  { name: "Analysis History", icon: History, href: "/history", active: false },
  { name: "Candidates", icon: Users, href: "/candidates", active: false },
];

function formatDate(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default async function Home() {
  let totalAnalyses = 0;
  let uniqueResumes = 0;
  let averageMatchScore = 0;
  let recentAnalyses: {
    id: string;
    resumeName: string;
    matchScore: number;
    createdAt: Date;
  }[] = [];

  let databaseError = false;

  try {
    const [
      analysisCount,
      averageResult,
      distinctResumes,
      recentResults,
    ] = await Promise.all([
      prisma.analysis.count(),

      prisma.analysis.aggregate({
        _avg: {
          matchScore: true,
        },
      }),

      prisma.analysis.findMany({
        distinct: ["resumeName"],
        select: {
          resumeName: true,
        },
      }),

      prisma.analysis.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          resumeName: true,
          matchScore: true,
          createdAt: true,
        },
      }),
    ]);

    totalAnalyses = analysisCount;
    uniqueResumes = distinctResumes.length;
    averageMatchScore = averageResult._avg.matchScore ?? 0;
    recentAnalyses = recentResults;
  } catch (error) {
    console.error("Dashboard database error:", error);
    databaseError = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles size={19} />
            </div>

            <span className="font-semibold tracking-tight">
              Resume Screener
            </span>
          </div>

          <div className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Settings size={18} />
              Settings
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">
                Resume Screener Assistant
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                HR
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

            {/* Welcome Section */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome to your workspace
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage candidate evaluations with AI-powered resume screening.
                </p>
              </div>

              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Sparkles size={16} />
                New Analysis
              </Link>
            </section>

            {/* Database Error */}
            {databaseError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Unable to load dashboard statistics. Please refresh the page
                or check the database connection.
              </div>
            )}

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {/* Total Analyses */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Total Analyses
                  </p>

                  <FileSearch size={19} className="text-indigo-600" />
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {totalAnalyses}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Candidate evaluations performed
                </p>
              </div>

              {/* Unique Resumes */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Unique Resumes
                  </p>

                  <Users size={19} className="text-indigo-600" />
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {uniqueResumes}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Distinct resume filenames analyzed
                </p>
              </div>

              {/* Average Match Score */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Average Match Score
                  </p>

                  <ArrowUpRight size={19} className="text-indigo-600" />
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {totalAnalyses > 0
                    ? `${averageMatchScore.toFixed(1)}%`
                    : "--"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Average across all evaluations
                </p>
              </div>
            </section>

            {/* Recent Analyses */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">
                    Recent Analyses
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your five latest candidate evaluations.
                  </p>
                </div>

                <Link
                  href="/history"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all analyses →
                </Link>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FileText size={26} />
                  </div>

                  <h4 className="mt-4 font-semibold">
                    {databaseError
                      ? "Dashboard data unavailable"
                      : "No analyses yet"}
                  </h4>

                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    {databaseError
                      ? "We couldn't retrieve your recent analyses."
                      : "Start by submitting a job description and candidate resume. Your analysis results will appear here."}
                  </p>

                  {!databaseError && (
                    <Link
                      href="/analyze"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      <Sparkles size={16} />
                      Start New Analysis
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
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
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentAnalyses.map((analysis) => (
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

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />
                              {formatDate(analysis.createdAt)}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/history/${analysis.id}`}
                              className="text-sm font-medium text-indigo-600 hover:underline"
                            >
                              View analysis
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
