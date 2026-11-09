
import {
  LayoutDashboard,
  FileSearch,
  History,
  Users,
  Settings,
  Sparkles,
  ArrowUpRight,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "New Analysis", icon: FileSearch, active: false },
  { name: "Analysis History", icon: History, active: false },
  { name: "Candidates", icon: Users, active: false },
];

export default function Home() {
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
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
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

        {/* Main content */}
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

            {/* Welcome section */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome to your workspace
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage candidate evaluations with AI-powered resume screening.
                </p>
              </div>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Sparkles size={16} />
                New Analysis
              </a>
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Total Analyses</p>
                  <FileSearch size={19} className="text-indigo-600" />
                </div>
                <p className="mt-4 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-slate-400">
                  Candidate evaluations performed
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Candidates</p>
                  <Users size={19} className="text-indigo-600" />
                </div>
                <p className="mt-4 text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-slate-400">
                  Candidates evaluated
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Average Match Score</p>
                  <ArrowUpRight size={19} className="text-indigo-600" />
                </div>
                <p className="mt-4 text-3xl font-bold">--</p>
                <p className="mt-1 text-xs text-slate-400">
                  Average across all evaluations
                </p>
              </div>
            </section>

            {/* Empty activity state */}
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-5">
                <h3 className="font-semibold">Recent Analyses</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest candidate evaluations will appear here.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileText size={26} />
                </div>

                <h4 className="mt-4 font-semibold">
                  No analyses yet
                </h4>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Start by submitting a job description and candidate resume.
                  Your analysis results will be saved here.
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
