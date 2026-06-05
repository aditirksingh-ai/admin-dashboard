import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, roles: ["admin", "manager", "viewer"] },
  { id: "users", label: "Users", icon: Users, roles: ["admin", "manager", "viewer"] },
  { id: "forms", label: "Create Record", icon: CircleUser, roles: ["admin", "manager"] },
  { id: "settings", label: "Settings", icon: Settings, roles: ["admin", "manager", "viewer"] },
];

const ROLES = ["admin", "manager", "viewer"];
const STATUSES = ["all", "active", "pending", "inactive"];
const PAGE_SIZE_OPTIONS = [5, 10, 15];
const initialLogin = { email: "", password: "", role: "admin" };
const initialForm = { fullName: "", email: "", role: "viewer", budget: "", notes: "" };

function loadTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("dashboard-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("dashboard-theme", theme);
}

function seedUsers() {
  return [
    { id: 1, name: "Aarav Patel", email: "aarav@acme.dev", company: "Acme Analytics", status: "active", role: "admin", revenue: 12800, lastActive: "2026-06-02T07:15:00Z" },
    { id: 2, name: "Maya Shah", email: "maya@northwind.dev", company: "Northwind Labs", status: "pending", role: "manager", revenue: 8200, lastActive: "2026-06-01T11:25:00Z" },
    { id: 3, name: "Rohan Iyer", email: "rohan@pulse.dev", company: "Pulse Systems", status: "inactive", role: "viewer", revenue: 4300, lastActive: "2026-05-31T18:40:00Z" },
    { id: 4, name: "Sara Khan", email: "sara@orbit.dev", company: "Orbit Cloud", status: "active", role: "manager", revenue: 15750, lastActive: "2026-06-02T10:50:00Z" },
    { id: 5, name: "Ishaan Desai", email: "ishaan@zen.dev", company: "Zen Studio", status: "pending", role: "viewer", revenue: 5100, lastActive: "2026-05-30T13:15:00Z" },
  ];
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function statusBadgeClasses(status) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset";
  if (status === "active") return `${base} bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400`;
  if (status === "pending") return `${base} bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400`;
  return `${base} bg-gray-500/10 text-gray-600 ring-gray-500/20 dark:text-gray-400`;
}

function App() {
  const [theme, setTheme] = useState(loadTheme);
  const [session, setSession] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("dashboard-session");
    return saved ? JSON.parse(saved) : null;
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session) window.localStorage.setItem("dashboard-session", JSON.stringify(session));
    else window.localStorage.removeItem("dashboard-session");
  }, [session]);

  if (!session) return <LoginScreen onLogin={setSession} theme={theme} setTheme={setTheme} />;
  return <Dashboard session={session} onLogout={() => setSession(null)} theme={theme} setTheme={setTheme} />;
}

function LoginScreen({ onLogin, theme, setTheme }) {
  const [form, setForm] = useState(initialLogin);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!(form.email.includes("@") && form.email.includes("."))) next.email = "Enter a valid email.";
    if (!form.password || form.password.length < 4) next.password = "Password must be at least 4 characters.";
    if (!form.role) next.role = "Role is required.";
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setApiError("");
    try {
      await new Promise((r) => setTimeout(r, 700));
      onLogin({ email: form.email.trim().toLowerCase(), name: form.email.split("@")[0], role: form.role });
    } catch {
      setApiError("Authentication service is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60 dark:border-gray-800 dark:bg-black dark:shadow-black/30">
          <section className="p-8 text-center sm:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">Admin Dashboard</p>
                  <h1 className="text-2xl font-semibold">Production-ready UI demo</h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[["Auth", "Mock login with role handling"], ["Table", "Search, sort, filter, pagination"], ["Forms", "Validated create-record flow"]].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black/60 text-left">
              <h2 className="text-lg font-semibold text-center">Sign in</h2>
              <p className="mt-1 text-sm text-center text-gray-600 dark:text-gray-400">Use any email and a password with 4+ characters.</p>

              <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
                <Field label="Email" error={errors.email}>
                  <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" type="email" autoComplete="email" placeholder="name@company.com" />
                </Field>
                <Field label="Password" error={errors.password}>
                  <input value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" type="password" autoComplete="current-password" placeholder="••••••••" />
                </Field>
                <Field label="Role" error={errors.role}>
                  <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white">
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </Field>
                {apiError ? <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300" role="alert"><AlertCircle className="mt-0.5 h-4 w-4" /><p>{apiError}</p></div> : null}
                <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  {loading ? "Signing in..." : "Enter dashboard"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ session, onLogout, theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [toast, setToast] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const canSeeForms = session.role === "admin" || session.role === "manager";
  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(session.role));

  useEffect(() => {
    const controller = new AbortController();
    async function loadUsers() {
      setLoadingUsers(true);
      setApiError("");
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load users.");
        const data = await res.json();
        const statuses = ["active", "pending", "inactive"];
        const mapped = data.flatMap((user, idx) =>
          Array.from({ length: 5 }, (_, repeat) => ({
            id: idx * 5 + repeat + 1,
            name: `${user.name} ${repeat + 1}`,
            email: `${user.username.toLowerCase()}.${repeat + 1}@${user.company.name.replace(/ /g, "").toLowerCase()}.com`,
            company: user.company.name,
            status: statuses[(idx + repeat) % statuses.length],
            role: ROLES[(idx + repeat) % ROLES.length],
            revenue: 4000 + ((idx + repeat) * 1234) % 16000,
            lastActive: new Date(Date.now() - (idx * 5 + repeat) * 86400000).toISOString(),
          }))
        );
        setUsers(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          setApiError("Could not load API data. Showing fallback records.");
          setUsers(seedUsers());
        }
      } finally {
        if (!controller.signal.aborted) setLoadingUsers(false);
      }
    }
    loadUsers();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, sortBy, sortDir, pageSize]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const revenue = users.reduce((sum, u) => sum + u.revenue, 0);
    const activeRate = total ? Math.round((active / total) * 100) : 0;
    return { total, active, pending, revenue, activeRate };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = users.filter((u) => {
      const matchesSearch = !query || [u.name, u.email, u.company, u.role, u.status].some((v) => String(v).toLowerCase().includes(query));
      const matchesStatus = status === "all" || u.status === status;
      return matchesSearch && matchesStatus;
    });
    result.sort((a, b) => {
      let left = a[sortBy];
      let right = b[sortBy];
      if (["name", "company", "status", "role"].includes(sortBy)) {
        left = String(left).toLowerCase();
        right = String(right).toLowerCase();
      }
      if (left < right) return sortDir === "asc" ? -1 : 1;
      if (left > right) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [users, search, status, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const heroChartData = useMemo(() => {
    const buckets = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return buckets.map((day, index) => ({ day, value: 40 + ((stats.active + index * 7) % 55) }));
  }, [stats.active]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const validateForm = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!(form.email.includes("@") && form.email.includes("."))) next.email = "Enter a valid email.";
    if (!form.budget.trim()) next.budget = "Budget is required.";
    else if (Number(form.budget) <= 0) next.budget = "Budget must be greater than 0.";
    if (!form.role) next.role = "Role is required.";
    return next;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const next = validateForm();
    setFormErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const record = { id: Date.now(), name: form.fullName.trim(), email: form.email.trim().toLowerCase(), company: "Created via form", status: "pending", role: form.role, revenue: Number(form.budget), lastActive: new Date().toISOString() };
      setUsers((prev) => [record, ...prev]);
      setForm(initialForm);
      setToast("Record created successfully.");
      setActiveSection("users");
    } catch {
      setToast("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNav = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black dark:focus:bg-black dark:focus:text-white">Skip to content</a>

      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-black/95 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transform transition-transform duration-200 ease-out`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">Control Center</p>
                <h2 className="mt-1 text-lg font-semibold">Admin Dashboard</h2>
              </div>
              <button type="button" className="rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black lg:hidden dark:hover:bg-gray-900 dark:focus:ring-white" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X className="h-5 w-5" /></button>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-4" aria-label="Primary navigation">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => handleNav(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${active ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-gray-100 dark:hover:bg-gray-900"}`} aria-current={active ? "page" : undefined}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="rounded-2xl bg-gray-100 p-4 dark:bg-gray-900">
                <p className="text-sm font-medium">Signed in as</p>
                <p className="mt-1 break-all text-sm text-gray-700 dark:text-gray-300">{session.email}</p>
                <p className="mt-2 inline-flex rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">{session.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen ? <button aria-label="Close sidebar overlay" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-black/90">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-gray-300 p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black lg:hidden dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white" aria-label="Open sidebar"><Menu className="h-5 w-5" /></button>
                <div>
                  <h1 className="text-lg font-semibold sm:text-xl">Welcome, {session.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Responsive dashboard demo with analytics, data management, and validation.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-xl border border-gray-300 p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white" aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white"><Bell className="h-4 w-4" /><span className="hidden sm:inline">Alerts</span></button>
                <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black dark:bg-white dark:text-black dark:focus:ring-white"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span></button>
              </div>
            </div>
          </header>

          <div id="main-content" className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            {apiError ? <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300" role="status"><AlertCircle className="mt-0.5 h-4 w-4" /><p>{apiError}</p></div> : null}

            <section id="overview" className="scroll-mt-24 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total records" value={stats.total} detail="Loaded from public API + local enrichment" icon={Users} />
                <StatCard title="Active users" value={stats.active} detail={`${stats.activeRate}% of current dataset`} icon={CheckCircle2} />
                <StatCard title="Pending approvals" value={stats.pending} detail="Requires admin action" icon={Shield} />
                <StatCard title="Revenue" value={formatCurrency(stats.revenue)} detail="Aggregated mock KPI" icon={BarChart3} />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold">Weekly activity</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Simple performance-friendly chart without chart library overhead.</p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">Live</span>
                  </div>
                  <div className="mt-6 grid h-56 grid-cols-7 items-end gap-3">
                    {heroChartData.map((item) => (
                      <div key={item.day} className="flex flex-col items-center gap-2">
                        <div className="flex h-40 w-full items-end rounded-2xl bg-gray-100 p-2 dark:bg-gray-900"><div className="w-full rounded-xl bg-black transition-all duration-300 dark:bg-white" style={{ height: `${item.value}%` }} aria-hidden="true" /></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
                  <h2 className="text-base font-semibold">Engineering notes</h2>
                  <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>This UI keeps state local and memoized where it matters. Filtering and pagination are computed in memory for clarity and predictable behavior.</p>
                    <p>The data source is a public API with graceful fallback to local seed data, so the interface remains usable even when the network is unavailable.</p>
                    <p>The table, forms, and navigation are keyboard-accessible with visible focus styles and semantic markup.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="users" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold">User management</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Search, sort, filter, and paginate records. Click a column title to sort.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="space-y-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Search</span>
                    <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search records" className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-9 pr-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" /></div>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Filter</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white">{STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rows per page</span>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white">{PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}</select>
                  </label>
                  <div className="flex items-end"><button type="button" onClick={() => { setSearch(""); setStatus("all"); setSortBy("name"); setSortDir("asc"); }} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white">Reset</button></div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-950/60">
                    <tr>
                      {[["name", "Name"], ["email", "Email"], ["company", "Company"], ["role", "Role"], ["status", "Status"], ["revenue", "Revenue"], ["lastActive", "Last active"]].map(([key, label]) => (
                        <th key={key} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400"><button type="button" onClick={() => handleSort(key)} className="inline-flex items-center gap-1 hover:text-black dark:hover:text-white">{label}{sortBy === key ? <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} /> : null}</button></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-black">
                    {loadingUsers ? Array.from({ length: Math.max(3, pageSize) }).map((_, idx) => <TableSkeletonRow key={idx} />) : pageUsers.length ? pageUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                        <td className="px-4 py-4 text-sm font-medium">{user.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.company}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.role}</td>
                        <td className="px-4 py-4 text-sm"><span className={statusBadgeClasses(user.status)}>{user.status}</span></td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(user.revenue)}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(user.lastActive)}</td>
                      </tr>
                    )) : <tr><td className="px-4 py-14 text-center text-sm text-gray-600 dark:text-gray-400" colSpan={7}>No records matched your search.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Showing {filteredUsers.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length} records</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white"><ChevronLeft className="h-4 w-4" /> Previous</button>
                  <span className="min-w-16 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{page} / {totalPages}</span>
                  <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white">Next <ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </section>

            {canSeeForms ? (
              <section id="forms" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
                <div className="max-w-3xl">
                  <h2 className="text-base font-semibold">Create record</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Validated form handling with an async submit path and optimistic dashboard update.</p>
                  <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submitForm} noValidate>
                    <Field label="Full name" error={formErrors.fullName}><input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" placeholder="Jane Doe" /></Field>
                    <Field label="Email" error={formErrors.email}><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" placeholder="jane@company.com" /></Field>
                    <Field label="Role" error={formErrors.role}><select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white">{ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select></Field>
                    <Field label="Budget" error={formErrors.budget}><input type="number" min="1" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" placeholder="12000" /></Field>
                    <Field label="Notes" className="sm:col-span-2"><textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={4} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-black dark:focus:ring-white" placeholder="Optional details..." /></Field>
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                      <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{submitting ? "Saving..." : "Create record"}</button>
                      <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-gray-300 px-4 py-3 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white">Clear</button>
                    </div>
                  </form>
                </div>
              </section>
            ) : null}

            <section id="settings" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="max-w-3xl">
                <h2 className="text-base font-semibold">Settings</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Session, theming, and access control are stored locally for this demo.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                    <p className="text-sm font-medium">Theme</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Current: {theme}</p>
                    <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="mt-4 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus:ring-white">Toggle theme</button>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                    <p className="text-sm font-medium">Access</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Current role: {session.role}</p>
                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">Role-based navigation hides actions that are not relevant to the current user context.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {toast ? <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-xl dark:border-gray-800 dark:bg-black" role="status">{toast}</div> : null}
    </div>
  );
}

function StatCard({ title, value, detail, icon: Icon }) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-2xl bg-gray-100 p-3 dark:bg-gray-900"><Icon className="h-5 w-5" /></div>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{detail}</p>
    </article>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
      {error ? <span className="block text-sm text-red-600 dark:text-red-400" role="alert">{error}</span> : null}
    </label>
  );
}

function TableSkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, idx) => <td key={idx} className="px-4 py-4"><div className="h-4 rounded bg-gray-200 dark:bg-gray-800" /></td>)}
    </tr>
  );
}

export default App;
