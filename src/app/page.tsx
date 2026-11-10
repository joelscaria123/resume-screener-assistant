
import {
  LayoutDashboard,
  FileSearch,
  History,
  Settings,
  Sparkles,
  Users,
  ArrowUpRight,
  FileText,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { connection } from "next/server";
import { Suspense } from "react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
  { name: "New Analysis", icon: FileSearch, href: "/analyze", active: false },
  { name: "Analysis History", icon: History, href: "/history", active: false },
];

function formatDate(date: Date) {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getScoreStyle(score: number) {
  if (score >= 80) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (score >= 60) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }

  return "bg-red-500/10 text-red-600 dark:text-red-400";
}

function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </p>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();

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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">

          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
              <Sparkles size={19} />
            </div>

            <div>
              <span className="font-semibold tracking-tight">
                Resume Screener
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AI-powered recruitment
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                  {item.active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Settings size={18} />
              Settings
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">

          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Overview of your recruitment workspace
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <div className="hidden h-9 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400">
                HR
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-6 lg:p-8">

            {/* Welcome Section */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles size={13} />
                  AI Recruitment Workspace
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome to your workspace
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Manage candidate evaluations, review matching skills, and
                  make better hiring decisions with AI-powered resume screening.
                </p>
              </div>

              <Link
                href="/analyze"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-md"
              >
                <Sparkles size={16} />
                New Analysis
                <ChevronRight size={15} />
              </Link>
            </section>

            {/* Database Error */}
            {databaseError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                Unable to load dashboard statistics. Please refresh the page
                or check the database connection.
              </div>
            )}

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {/* Total Analyses */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Analyses
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FileSearch size={19} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {totalAnalyses}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Candidate evaluations performed
                </p>
              </div>

              {/* Unique Resumes */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Unique Resumes
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    <Users size={19} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {uniqueResumes}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Distinct resume filenames analyzed
                </p>
              </div>

              {/* Average Match Score */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Average Match Score
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ArrowUpRight size={19} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {totalAnalyses > 0
                    ? `${averageMatchScore.toFixed(1)}%`
                    : "--"}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Average across all evaluations
                </p>
              </div>
            </section>

            {/* Recent Analyses */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold tracking-tight">
                    Recent Analyses
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your five latest candidate evaluations.
                  </p>
                </div>

                <Link
                  href="/history"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View all analyses
                  <ChevronRight size={15} />
                </Link>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FileText size={26} />
                  </div>

                  <h4 className="mt-4 font-semibold">
                    {databaseError
                      ? "Dashboard data unavailable"
                      : "No analyses yet"}
                  </h4>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {databaseError
                      ? "We couldn't retrieve your recent analyses."
                      : "Start by submitting a job description and candidate resume. Your analysis results will appear here."}
                  </p>

                  {!databaseError && (
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
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Resume
                        </th>

                        <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Match Score
                        </th>

                        <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Date
                        </th>

                        <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {recentAnalyses.map((analysis) => (
                        <tr
                          key={analysis.id}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-5 py-4">
                            <Link
                              href={`/history/${analysis.id}`}
                              className="flex items-center gap-3 font-medium text-slate-800 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
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
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <CalendarDays
                                size={15}
                                className="shrink-0 text-slate-400"
                              />
                              {formatDate(analysis.createdAt)}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/history/${analysis.id}`}
                              className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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

            {/* Footer */}
            <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              Resume Screener Assistant · AI-powered candidate evaluation
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}
