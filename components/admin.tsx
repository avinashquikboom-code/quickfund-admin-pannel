"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Bell,
  Headphones,
  UserCog,
  ScrollText,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  LogOut,
  Plus,
  Download,
  X,
  Check,
  CalendarDays,
  SlidersHorizontal,
  ArrowRight,
  IndianRupee,
  Activity,
  Clock,
  CheckCircle2,
  Send,
  FileText,
  Sun,
  Moon,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { users, makeRows, money, navigation, type RecordRow } from "@/lib/data";
import { Avatar, Badge } from "./shared";
import { Stat, Chart } from "./charts";
import { DataTable } from "./data-table";
import { IntegrationSettings } from "./settings/integration-settings";
const icons = [
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Bell,
  Headphones,
  UserCog,
  ScrollText,
  Settings,
];
const schema = z.object({
  name: z.string().min(2, "Enter at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  amount: z
    .number()
    .min(0, "Amount cannot be negative")
    .max(1000000, "Maximum demo limit is ₹10,00,000"),
  reason: z.string().min(5, "Please provide at least 5 characters"),
  role: z.string(),
});
type FormData = z.infer<typeof schema>;
function exportRows(rows: RecordRow[], label: string) {
  const keys = [
    "id",
    "name",
    "email",
    "amount",
    "status",
    "date",
    "type",
  ] as const;
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => '"' + String(r[k]).replaceAll('"', '""') + '"').join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `quickfunds-demo-${label}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
export default function Admin({
  page,
  selectedId,
  settingsSection,
}: {
  page: string;
  selectedId?: string;
  settingsSection?: string;
}) {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [tab, setTab] = useState("All"),
    [rows, setRows] = useState<RecordRow[]>(makeRows(page)),
    [detail, setDetail] = useState<RecordRow | null>(null),
    [modal, setModal] = useState(""),
    [toast, setToast] = useState(""),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [setting, setSetting] = useState("Company Profile"),
    [dark, setDark] = useState(false),
    [reply, setReply] = useState(""),
    [template, setTemplate] = useState("Payment reminder"),
    [templateMessage, setTemplateMessage] = useState(
      "Your next payment is due soon. Open your account to review the details.",
    ),
    [settings, setSettings] = useState<Record<string, string | boolean>>({
      company: "QuickFunds Technologies",
      email: "admin@quickfunds.example",
      alerts: true,
      digest: true,
      currency: "INR",
      language: "English",
      limit: "50000",
      charge: "1.5",
      theme: "Light",
    });
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      amount: 25000,
      reason: "",
      role: "Operations",
    },
  });
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 4000);
  };
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`qf-${page}`);
      setRows(stored ? JSON.parse(stored) : makeRows(page));
      const pref = localStorage.getItem("qf-settings");
      if (pref) {
        const parsed = JSON.parse(pref);
        setSettings(parsed);
        setDark(parsed.theme === "Dark");
      }
      const message = localStorage.getItem("qf-template");
      if (message) setTemplateMessage(message);
    } catch {
      setRows(makeRows(page));
    }
    if (selectedId) setDetail(users.find((u) => u.id === selectedId) || null);
  }, [page, selectedId]);
  const saveRows = (next: RecordRow[]) => {
    setRows(next);
    localStorage.setItem(`qf-${page}`, JSON.stringify(next));
  };
  const updateStatus = (status: string, reason?: string) => {
    if (!detail) return;
    const updated = {
      ...detail,
      status,
      reason,
      ...(page === "kyc" ? { kyc: status } : {}),
    };
    saveRows(rows.map((r) => (r.id === detail.id ? updated : r)));
    if (page === "kyc") {
      const savedUsers = localStorage.getItem("qf-users");
      const related: RecordRow[] = savedUsers
        ? JSON.parse(savedUsers)
        : makeRows("users");
      localStorage.setItem(
        "qf-users",
        JSON.stringify(
          related.map((u) =>
            u.name === detail.name ? { ...u, kyc: status } : u,
          ),
        ),
      );
    }
    setDetail(updated);
    setModal("");
    notify(`${status} saved in demo data`);
  };
  const visible = rows.filter(
    (r) =>
      Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All" || r.status === filter) &&
      (tab === "All" ||
        tab === "All Transactions" ||
        r.status === tab ||
        r.type === tab) &&
      (!start || r.date >= start) &&
      (!end || r.date <= end),
  );
  const title = navigation.find((n) => n[0] === page)?.[1] || "Dashboard";
  const tabs =
    page === "kyc"
      ? ["All", "Pending", "Approved", "Rejected"]
      : page === "withdrawals"
        ? ["All", "Pending", "Processing", "Completed", "Failed", "Rejected"]
        : page === "transactions"
          ? [
              "All Transactions",
              "Credit",
              "Debit",
              "Withdrawal",
              "Repayment",
              "Daily Charge",
              "Refund",
            ]
          : page === "notifications"
            ? ["All", "Delivered", "Scheduled", "Draft"]
            : [];
  function openForm(action: string) {
    form.reset({
      name: detail?.name || (action === "Edit template" ? template : ""),
      email:
        detail?.email ||
        (action === "Edit template" ? "admin@quickfunds.example" : ""),
      amount: detail?.amount || 25000,
      reason: action === "Edit template" ? templateMessage : "",
      role: detail?.role || "Operations",
    });
    setModal(action);
  }
  const submit = form.handleSubmit((values) => {
    if (modal === "Edit template") {
      setTemplateMessage(values.reason);
      localStorage.setItem("qf-template", values.reason);
      setModal("");
      notify("Template updated locally");
      return;
    }
    if (modal === "Reject" || modal === "Request documents") {
      updateStatus(modal === "Reject" ? "Rejected" : "Pending", values.reason);
      return;
    }
    const item = {
      ...(detail || users[0]),
      ...values,
      id: detail?.id || `DEMO-${Date.now()}`,
      status:
        detail?.status ||
        (page === "notifications"
          ? "Draft"
          : page === "kyc"
            ? "Pending"
            : page === "withdrawals"
              ? "Pending"
              : page === "support"
                ? "Open"
                : "Active"),
      history:
        page === "limits"
          ? [
              ...(detail?.history || []),
              `${new Date().toLocaleDateString("en-IN")} · ${money(detail?.amount || 0)} → ${money(values.amount)} · ${values.reason}`,
            ]
          : detail?.history,
      subject: values.reason,
    };
    if (detail) {
      saveRows(rows.map((r) => (r.id === detail.id ? item : r)));
      setDetail(item);
    } else saveRows([item, ...rows]);
    setModal("");
    notify("Changes saved locally");
  });
  return (
    <div
      className={`workspace ${collapsed ? "is-collapsed" : ""} ${dark ? "dark-mode" : ""}`}
    >
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <Link href="/dashboard" className="brand">
          <span className="brand-icon">
            <ArrowUpRight size={24} />
          </span>
          {!collapsed && (
            <span>
              Quick<span>Funds</span>
              <small>ADMIN WORKSPACE</small>
            </span>
          )}
        </Link>
        <button
          className="sidebar-collapse icon-button"
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(([href, label], i) => {
            const Icon = icons[i];
            return (
              <Link
                title={label}
                onClick={() => setMobile(false)}
                className={page === href ? "active" : ""}
                href={`/${href}`}
                key={href}
              >
                <Icon size={19} />
                {!collapsed && (
                  <>
                    <span>{label}</span>
                    {href === "kyc" && <em>12</em>}
                    {href === "support" && <i className="nav-dot" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="help-card">
            <span className="help-icon">
              <Headphones size={19} />
            </span>
            <b>Need a hand?</b>
            <p>Our team is here to help.</p>
            <Link href="/support">
              Contact support <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
        <div className="sidebar-profile">
          <Avatar name="Anjali Sharma" />
          {!collapsed && (
            <div>
              <b>Anjali Sharma</b>
              <small>Super Administrator</small>
            </div>
          )}
          <button
            className="icon-button"
            aria-label="Demo logout"
            onClick={() => setModal("Logout")}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      {mobile && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Workspace <ChevronRight size={14} /> <b>{title}</b>
            </span>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                aria-label="Search current workspace"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              className="notification-button icon-button"
              aria-label="View notifications"
              onClick={() => setModal("Inbox")}
            >
              <Bell size={19} />
              <i />
            </button>
            <span className="top-divider" />
            <button
              className="profile-button"
              onClick={() => setModal("Profile")}
            >
              <Avatar name="Anjali Sharma" />
              <span>
                <b>Anjali Sharma</b>
                <small>Super Admin</small>
              </span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                YOUR FINANCIAL OPERATIONS, AT A GLANCE
              </div>
              <h1>
                {page === "dashboard" ? "Dashboard overview" : title}
                <span className="demo-pill">DEMO</span>
              </h1>
              <p>
                {page === "dashboard"
                  ? "Welcome back, Anjali. Here's what's happening with QuickFunds today."
                  : `Manage and review your ${title.toLowerCase()} in one place.`}
              </p>
            </div>
            <div className="heading-actions">
              <button
                onClick={() => {
                  setStart(start ? "" : "2026-10-01");
                  setEnd(end ? "" : "2026-10-27");
                }}
              >
                <CalendarDays size={16} />{" "}
                {start ? "Oct 1 – Oct 27, 2026" : "Oct 27, 2026"}{" "}
                <ChevronDown size={13} />
              </button>
              <button
                className="primary"
                onClick={() => {
                  if (page === "settings") {
                    setModal("Reset");
                    return;
                  }
                  if (
                    [
                      "dashboard",
                      "reports",
                      "transactions",
                      "audit-logs",
                      "payments",
                      "users",
                    ].includes(page)
                  ) {
                    exportRows(visible, page);
                    notify("Sample CSV exported");
                  } else {
                    setDetail(null);
                    openForm(
                      page === "limits"
                        ? "Assign Limit"
                        : page === "notifications"
                          ? "Create notification"
                          : page === "admin-users"
                            ? "Add Admin"
                            : "Add record",
                    );
                  }
                }}
              >
                {[
                  "dashboard",
                  "reports",
                  "transactions",
                  "audit-logs",
                  "payments",
                  "users",
                ].includes(page) ? (
                  <Download size={16} />
                ) : (
                  <Plus size={16} />
                )}{" "}
                {[
                  "dashboard",
                  "reports",
                  "transactions",
                  "audit-logs",
                  "payments",
                  "users",
                ].includes(page)
                  ? "Export report"
                  : page === "limits"
                    ? "Assign limit"
                    : page === "notifications"
                      ? "Create notification"
                      : page === "settings"
                        ? "Reset demo"
                        : "Add new"}
              </button>
            </div>
          </div>
          {page === "dashboard" ? (
            <>
              <div className="overview-strip">
                <span>
                  <span className="live-dot" /> Workspace overview
                </span>
                <small>Sample data · Last updated today, 10:42 AM</small>
                <button
                  onClick={() =>
                    notify("You are viewing the latest local demo data")
                  }
                >
                  <Activity size={14} /> Refresh data
                </button>
              </div>
              <div className="stats-grid">
                <Stat
                  title="Total users"
                  value="24,892"
                  change="12.8%"
                  icon={Users}
                />
                <Stat
                  title="Active users"
                  value="18,640"
                  change="8.2%"
                  icon={Activity}
                />
                <Stat
                  title="Pending KYC"
                  value="148"
                  change="4.6%"
                  icon={ShieldCheck}
                />
                <Stat
                  title="Approved credit limits"
                  value="₹1.84 Cr"
                  change="16.3%"
                />
                <Stat
                  title="Pending withdrawals"
                  value="₹4,82,500"
                  change="6.2%"
                  icon={ArrowUpRight}
                />
                <Stat
                  title="Today's collections"
                  value="₹1,24,800"
                  change="18.4%"
                  icon={ArrowDownLeft}
                />
                <Stat
                  title="Outstanding amount"
                  value="₹32,46,000"
                  change="3.1%"
                  icon={IndianRupee}
                />
                <Stat
                  title="Overdue payments"
                  value="₹2,18,400"
                  change="2.4%"
                  icon={Clock}
                />
              </div>
              <div className="charts-grid">
                <Chart
                  title="User registration overview"
                  subtitle="A growing community, one day at a time"
                />
                <Chart
                  title="Daily payment collections"
                  subtitle="Collections and expected payments this week"
                  kind="bar"
                />
              </div>
              <div className="tables-grid">
                <section className="card">
                  <div className="card-heading">
                    <div>
                      <h3>Recent users</h3>
                      <p>Your newest QuickFunds customers</p>
                    </div>
                    <Link href="/users">
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>
                  <DataTable
                    rows={users}
                    page="users"
                    onView={setDetail}
                    compact
                  />
                </section>
                <section className="card">
                  <div className="card-heading">
                    <div>
                      <h3>Recent withdrawals</h3>
                      <p>Keep track of the latest requests</p>
                    </div>
                    <Link href="/withdrawals">
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>
                  <DataTable
                    rows={makeRows("withdrawals")}
                    page="withdrawals"
                    onView={setDetail}
                    compact
                  />
                </section>
              </div>
              <div className="charts-grid">
                <Chart
                  title="KYC approval statistics"
                  subtitle="Application decisions across the workspace"
                  kind="pie"
                />
                <Chart
                  title="Withdrawal analytics"
                  subtitle="Weekly withdrawal activity"
                  kind="bar"
                />
              </div>
              <div className="tables-grid">
                {["kyc", "transactions"].map((p) => (
                  <section className="card" key={p}>
                    <div className="card-heading">
                      <h3>
                        Recent{" "}
                        {p === "kyc" ? "KYC applications" : "transactions"}
                      </h3>
                      <Link href={`/${p}`}>
                        View all <ArrowRight size={14} />
                      </Link>
                    </div>
                    <DataTable
                      rows={makeRows(p)}
                      page={p}
                      onView={setDetail}
                      compact
                    />
                  </section>
                ))}
              </div>
            </>
          ) : page === "settings" ? (
            <IntegrationSettings
              section={settingsSection}
              legacy={
                <section className="card settings-layout">
                  <div className="settings-nav">
                    {[
                      "Company Profile",
                      "Admin Profile",
                      "Credit Policy",
                      "Daily Charge Policy",
                      "Payment Settings",
                      "Notification Settings",
                      "Appearance",
                      "General Preferences",
                    ].map((t) => (
                      <button
                        key={t}
                        className={setting === t ? "selected" : ""}
                        onClick={() => setSetting(t)}
                      >
                        {t}
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                  <form
                    className="settings-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      localStorage.setItem(
                        "qf-settings",
                        JSON.stringify(settings),
                      );
                      notify("Preferences saved to this browser");
                    }}
                  >
                    <h2>{setting}</h2>
                    <p className="muted">
                      Configure your demonstration workspace preferences.
                    </p>
                    {setting === "Company Profile" ||
                    setting === "Admin Profile" ? (
                      <>
                        <label>
                          {setting === "Company Profile"
                            ? "Company name"
                            : "Full name"}
                          <input
                            required
                            value={String(
                              setting === "Company Profile"
                                ? settings.company
                                : settings.adminName || "Anjali Sharma",
                            )}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [setting === "Company Profile"
                                  ? "company"
                                  : "adminName"]: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Contact email
                          <input
                            required
                            type="email"
                            value={String(
                              setting === "Company Profile"
                                ? settings.email
                                : settings.adminEmail ||
                                    "anjali@quickfunds.example",
                            )}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [setting === "Company Profile"
                                  ? "email"
                                  : "adminEmail"]: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Address
                          <textarea
                            placeholder="Registered office address"
                            value={String(
                              settings.address || "Bengaluru, Karnataka, India",
                            )}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                address: e.target.value,
                              })
                            }
                          />
                        </label>
                      </>
                    ) : setting.includes("Policy") ? (
                      <>
                        <label>
                          {setting === "Credit Policy"
                            ? "Maximum demo credit limit (INR)"
                            : "Daily charge rate (%)"}
                          <input
                            type="number"
                            min="0"
                            max={setting === "Credit Policy" ? 1000000 : 100}
                            required
                            value={String(
                              settings[
                                setting === "Credit Policy" ? "limit" : "charge"
                              ],
                            )}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [setting === "Credit Policy"
                                  ? "limit"
                                  : "charge"]: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Review frequency
                          <select>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Weekly</option>
                          </select>
                        </label>
                      </>
                    ) : setting === "Appearance" ? (
                      <div className="appearance-options">
                        <button
                          type="button"
                          onClick={() => {
                            setDark(false);
                            setSettings({ ...settings, theme: "Light" });
                          }}
                        >
                          <Sun /> Light
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDark(true);
                            setSettings({ ...settings, theme: "Dark" });
                          }}
                        >
                          <Moon /> Dark
                        </button>
                      </div>
                    ) : setting === "General Preferences" ? (
                      <>
                        <label>
                          Currency
                          <select
                            value={String(settings.currency)}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                currency: e.target.value,
                              })
                            }
                          >
                            <option>INR</option>
                          </select>
                        </label>
                        <label>
                          Language
                          <select
                            value={String(settings.language)}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                language: e.target.value,
                              })
                            }
                          >
                            <option>English</option>
                            <option>Hindi</option>
                          </select>
                        </label>
                      </>
                    ) : (
                      <>
                        {["alerts", "digest"].map((key, i) => (
                          <label className="toggle-row" key={key}>
                            <span>
                              {setting === "Payment Settings"
                                ? [
                                    "Enable UPI demo option",
                                    "Enable bank transfer demo option",
                                  ][i]
                                : [
                                    "In-app notifications",
                                    "Daily email digest preview",
                                  ][i]}
                            </span>
                            <input
                              type="checkbox"
                              checked={Boolean(settings[key])}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  [key]: e.target.checked,
                                })
                              }
                            />
                          </label>
                        ))}
                        <p className="info-box">
                          Demo preferences only. No provider connection or
                          credentials are used.
                        </p>
                      </>
                    )}
                    <Button type="submit">
                      <Check size={16} />
                      Save changes
                    </Button>
                    <button
                      className="danger-text"
                      type="button"
                      onClick={() => setModal("Reset")}
                    >
                      Reset demo data
                    </button>
                  </form>
                </section>
              }
            />
          ) : (
            <>
              {page === "reports" ? (
                <>
                  <div className="stats-grid four">
                    <Stat
                      title="User growth"
                      value="+2,824"
                      change="12.8%"
                      icon={Users}
                    />
                    <Stat
                      title="Credit utilization"
                      value="64.2%"
                      change="4.3%"
                    />
                    <Stat
                      title="Outstanding amount"
                      value="₹32,46,000"
                      change="3.1%"
                    />
                    <Stat
                      title="Overdue payments"
                      value="₹2,18,400"
                      change="2.4%"
                      icon={Clock}
                    />
                  </div>
                  <div className="charts-grid">
                    <Chart
                      title="User growth report"
                      subtitle="Sample registration trends"
                    />
                    <Chart
                      title="KYC report"
                      subtitle="Verification outcomes"
                      kind="pie"
                    />
                    <Chart
                      title="Credit utilization report"
                      subtitle="Approved and utilized credit"
                      kind="bar"
                    />
                    <Chart
                      title="Withdrawal report"
                      subtitle="Sample withdrawals over time"
                    />
                    <Chart
                      title="Payment collection report"
                      subtitle="Daily collection activity"
                      kind="bar"
                    />
                    <Chart
                      title="Outstanding amount report"
                      subtitle="Sample outstanding amounts"
                    />
                    <Chart
                      title="Overdue payment report"
                      subtitle="Illustrative overdue trends"
                      kind="bar"
                    />
                  </div>
                </>
              ) : (
                <div className="stats-grid four">
                  <Stat
                    title={
                      page === "limits"
                        ? "Total approved limits"
                        : `Total ${title.toLowerCase()}`
                    }
                    value={
                      page === "limits"
                        ? money(rows.reduce((s, r) => s + r.amount, 0))
                        : String(rows.length)
                    }
                    change="12.8%"
                    icon={Users}
                  />
                  <Stat
                    title={
                      page === "limits"
                        ? "Total utilized limits"
                        : "Pending review"
                    }
                    value={
                      page === "limits"
                        ? money(
                            rows.reduce((s, r) => s + r.amount - r.balance, 0),
                          )
                        : String(
                            rows.filter((r) =>
                              ["Pending", "Open", "Draft"].includes(r.status),
                            ).length,
                          )
                    }
                    change="4.2%"
                    icon={Clock}
                  />
                  <Stat
                    title={
                      page === "limits"
                        ? "Available credit"
                        : "Completed / active"
                    }
                    value={
                      page === "limits"
                        ? money(rows.reduce((s, r) => s + r.balance, 0))
                        : String(
                            rows.filter((r) =>
                              [
                                "Active",
                                "Completed",
                                "Approved",
                                "Paid",
                                "Resolved",
                                "Delivered",
                                "Success",
                              ].includes(r.status),
                            ).length,
                          )
                    }
                    change="8.6%"
                    icon={CheckCircle2}
                  />
                  <Stat
                    title="Sample volume"
                    value={money(rows.reduce((s, r) => s + r.amount, 0))}
                    change="6.3%"
                  />
                </div>
              )}
              {page === "notifications" && (
                <section className="card template-card">
                  <div>
                    <h3>Notification templates</h3>
                    <p>Preview and customize your customer messages.</p>
                  </div>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option>Payment reminder</option>
                    <option>KYC approved</option>
                    <option>Welcome to QuickFunds</option>
                  </select>
                  <button
                    onClick={() => {
                      setDetail(null);
                      openForm("Edit template");
                    }}
                  >
                    Edit template
                  </button>
                  <button onClick={() => setModal("Notification preview")}>
                    Preview
                  </button>
                </section>
              )}
              <section className="card records-card">
                <div className="card-heading">
                  <div>
                    <h3>
                      {page === "reports"
                        ? "Report source data"
                        : title === "Users"
                          ? "All customers"
                          : title}
                    </h3>
                    <p>
                      {page === "reports"
                        ? "Filtered sample records used for CSV downloads"
                        : "A clear view of every record, with the details that matter."}
                    </p>
                  </div>
                  <span className="count-pill">{visible.length} records</span>
                </div>
                {tabs.length > 0 && (
                  <div className="tabs">
                    {tabs.map((t) => (
                      <button
                        className={tab === t ? "selected" : ""}
                        key={t}
                        onClick={() => setTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                <div className="toolbar">
                  <div className="search-input">
                    <Search size={17} />
                    <input
                      placeholder="Search name, email, phone or ID..."
                      aria-label="Search records"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <select
                    aria-label="Filter status"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="All">All statuses</option>
                    {Array.from(new Set(rows.map((r) => r.status))).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <label className="date-input">
                    From
                    <input
                      aria-label="From date"
                      type="date"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </label>
                  <label className="date-input">
                    To
                    <input
                      aria-label="To date"
                      type="date"
                      min={start}
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                    />
                  </label>
                  <button
                    aria-label="Clear filters"
                    onClick={() => {
                      setQuery("");
                      setFilter("All");
                      setTab("All");
                      setStart("");
                      setEnd("");
                    }}
                  >
                    <SlidersHorizontal size={16} />
                    Reset
                  </button>
                </div>
                <DataTable rows={visible} page={page} onView={setDetail} />
              </section>
            </>
          )}
          <footer>
            <span>© 2026 QuickFunds. All rights reserved.</span>
            <span>
              <span className="live-dot" /> Frontend demo · Sample data only
            </span>
          </footer>
        </main>
      </div>
      <Dialog
        open={!!detail && !modal}
        onClose={() => setDetail(null)}
        title={page === "support" ? "Ticket details" : "Record details"}
      >
        {detail && (
          <div className="detail-content">
            <div className="detail-profile">
              <Avatar name={detail.name} />
              <div>
                <h2>{detail.name}</h2>
                <p>{detail.email}</p>
              </div>
              <Badge value={detail.status} />
            </div>
            <div className="detail-grid">
              {[
                ["Record ID", detail.id],
                ["Date", detail.date],
                ...(["users", "kyc"].includes(page)
                  ? [
                      ["Phone", detail.phone],
                      ["KYC status", detail.kyc],
                    ]
                  : []),
                ...(["users", "limits"].includes(page)
                  ? [
                      ["Credit limit", money(detail.amount)],
                      ["Available balance", money(detail.balance)],
                    ]
                  : []),
                ...(["payments", "transactions", "withdrawals"].includes(page)
                  ? [
                      ["Amount", money(detail.amount)],
                      ["Payment method", detail.method],
                      ["UPI / bank", "•••• •••• 4281"],
                    ]
                  : []),
                ...(page === "transactions"
                  ? [["Transaction type", detail.type]]
                  : []),
                ...(page === "payments"
                  ? [
                      ["Due date", "28 Oct 2026"],
                      [
                        "Amount paid",
                        money(detail.status === "Paid" ? detail.amount : 0),
                      ],
                    ]
                  : []),
                ...(page === "support"
                  ? [
                      ["Priority", detail.priority],
                      [
                        "Category",
                        detail.subject.includes("KYC")
                          ? "Verification"
                          : "Payments",
                      ],
                      ["Assigned agent", detail.agent],
                    ]
                  : []),
                ...(page === "admin-users"
                  ? [
                      ["Role", detail.role],
                      ["Last active", detail.date],
                    ]
                  : []),
                ...(page === "audit-logs"
                  ? [
                      ["Administrator", detail.agent],
                      ["Affected module", detail.type],
                      ["Action", "Sample record updated"],
                    ]
                  : []),
              ].map(([a, b]) => (
                <div key={a}>
                  <small>{a}</small>
                  <b>{b}</b>
                </div>
              ))}
            </div>
            {page === "kyc" && (
              <>
                <h3>Verification documents</h3>
                <div className="document-grid">
                  {[
                    "Identity proof",
                    "Address proof",
                    "Selfie verification",
                  ].map((s) => (
                    <button key={s} onClick={() => setModal(s)}>
                      <FileText />
                      <b>{s}</b>
                      <small>Safe sample placeholder · Preview</small>
                    </button>
                  ))}
                </div>
                <h3>Verification timeline</h3>
                <p className="info-box">
                  ● Application submitted · {detail.date}
                  <br />● Documents received · Awaiting review
                  <br />● Current status: {detail.status}
                </p>
              </>
            )}
            {page === "limits" && (
              <>
                <h3>Previous limit history</h3>
                <p className="info-box">
                  01 Oct 2026 · Initial limit {money(10000)}
                  <br />
                  15 Oct 2026 · Reviewed limit {money(detail.amount)}
                  <br />
                  Reason: {detail.reason || "Routine demo review"}
                  {detail.history?.map((entry, i) => (
                    <span className="history-entry" key={i}>
                      {entry}
                    </span>
                  ))}
                </p>
              </>
            )}
            {page === "admin-users" && (
              <>
                <h3>Permission matrix (UI only)</h3>
                <div className="permission-grid">
                  {[
                    "View users",
                    "Review KYC",
                    "Edit limits",
                    "Review withdrawals",
                    "Manage admins",
                    "Export reports",
                  ].map((p) => (
                    <label key={p}>
                      <input
                        type="checkbox"
                        defaultChecked={
                          detail.role === "Administrator" || p === "View users"
                        }
                      />{" "}
                      {p}
                    </label>
                  ))}
                </div>
              </>
            )}
            {page === "support" && (
              <>
                <h3>{detail.subject}</h3>
                <p className="info-box">
                  Customer: Please help me with this request. Thank you.
                </p>
                {detail.notes?.map((n, i) => (
                  <p className="info-box" key={i}>
                    {n}
                  </p>
                ))}
                <label>
                  Reply / internal note
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a helpful response..."
                  />
                </label>
                <div className="action-row">
                  <button
                    onClick={() => {
                      if (!reply.trim()) return;
                      const updated = {
                        ...detail,
                        notes: [
                          ...(detail.notes || []),
                          `Internal note: ${reply}`,
                        ],
                      };
                      saveRows(
                        rows.map((r) => (r.id === detail.id ? updated : r)),
                      );
                      setDetail(updated);
                      setReply("");
                      notify("Internal note saved");
                    }}
                  >
                    Add internal note
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      if (!reply.trim()) return;
                      const updated = {
                        ...detail,
                        notes: [
                          ...(detail.notes || []),
                          `Demo reply: ${reply}`,
                        ],
                      };
                      saveRows(
                        rows.map((r) => (r.id === detail.id ? updated : r)),
                      );
                      setDetail(updated);
                      setReply("");
                      notify("Reply saved locally; no message sent");
                    }}
                  >
                    <Send size={15} />
                    Save demo reply
                  </button>
                </div>
              </>
            )}
            {detail.reason && (
              <p className="info-box">Reason: {detail.reason}</p>
            )}
            <div className="action-row">
              {page === "users" ? (
                <>
                  <Link className="button-link" href={`/users/${detail.id}`}>
                    Open profile
                  </Link>
                  <button
                    onClick={() =>
                      setModal(
                        detail.status === "Active" ? "Suspend" : "Activate",
                      )
                    }
                  >
                    {detail.status === "Active" ? "Suspend" : "Activate"} user
                  </button>
                </>
              ) : page === "kyc" ? (
                <>
                  <button onClick={() => openForm("Request documents")}>
                    Request documents
                  </button>
                  <button
                    className="danger-text"
                    onClick={() => openForm("Reject")}
                  >
                    Reject
                  </button>
                  <button
                    className="primary"
                    onClick={() => setModal("Approve")}
                  >
                    Approve KYC
                  </button>
                </>
              ) : page === "withdrawals" ? (
                <>
                  <button onClick={() => openForm("Reject")}>Reject</button>
                  <button onClick={() => setModal("Retry")}>Retry demo</button>
                  <button
                    className="primary"
                    onClick={() => setModal("Approve")}
                  >
                    Approve demo request
                  </button>
                </>
              ) : page === "payments" ? (
                <button onClick={() => setModal("Refund")}>
                  Demonstrate refund
                </button>
              ) : page === "limits" ? (
                <button
                  className="primary"
                  onClick={() => openForm("Adjust limit")}
                >
                  Adjust limit
                </button>
              ) : page === "support" ? (
                <>
                  <button onClick={() => setModal("Assign agent")}>
                    Assign agent
                  </button>
                  <button
                    className="primary"
                    onClick={() => updateStatus("Resolved")}
                  >
                    Mark resolved
                  </button>
                </>
              ) : page === "admin-users" ? (
                <button onClick={() => openForm("Edit Admin")}>
                  Edit administrator
                </button>
              ) : page === "notifications" ? (
                <button
                  className="primary"
                  onClick={() => setModal("Send notification")}
                >
                  Simulate delivery
                </button>
              ) : null}
            </div>
          </div>
        )}
      </Dialog>
      <Dialog open={!!modal} onClose={() => setModal("")} title={modal}>
        {[
          "Add new",
          "Add record",
          "Add Admin",
          "Edit Admin",
          "Assign Limit",
          "Adjust limit",
          "Create notification",
          "Edit template",
          "Reject",
          "Request documents",
        ].includes(modal) ? (
          <form className="modal-form" onSubmit={submit}>
            <label>
              {page === "notifications"
                ? "Notification title"
                : "Customer / administrator name"}
              <input {...form.register("name")} />
              <small className="error">
                {form.formState.errors.name?.message}
              </small>
            </label>
            <label>
              Email
              <input type="email" {...form.register("email")} />
              <small className="error">
                {form.formState.errors.email?.message}
              </small>
            </label>
            <label>
              Amount / demo credit limit
              <input
                type="number"
                {...form.register("amount", { valueAsNumber: true })}
              />
              <small className="error">
                {form.formState.errors.amount?.message}
              </small>
            </label>
            <label>
              Role / audience
              <select {...form.register("role")}>
                <option>Operations</option>
                <option>Administrator</option>
                <option>Support</option>
                <option>Viewer</option>
                <option>All customers</option>
              </select>
            </label>
            <label>
              {page === "notifications" ? "Message content" : "Reason / notes"}
              <textarea {...form.register("reason")} />
              <small className="error">
                {form.formState.errors.reason?.message}
              </small>
            </label>
            <Button type="submit">Save demo changes</Button>
          </form>
        ) : modal === "Assign agent" ? (
          <div className="modal-form">
            <label>
              Agent
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="">Choose agent</option>
                <option>Anjali Sharma</option>
                <option>Rohit Mehra</option>
                <option>Priya Kapoor</option>
              </select>
            </label>
            <button
              className="primary"
              onClick={() => {
                if (
                  !detail ||
                  !["Anjali Sharma", "Rohit Mehra", "Priya Kapoor"].includes(
                    template,
                  )
                ) {
                  notify("Select an agent");
                  return;
                }
                const next = { ...detail, agent: template };
                saveRows(rows.map((r) => (r.id === detail.id ? next : r)));
                setDetail(next);
                setModal("");
                notify("Agent assigned");
              }}
            >
              Assign agent
            </button>
          </div>
        ) : ["Identity proof", "Address proof", "Selfie verification"].includes(
            modal,
          ) ? (
          <div className="document-preview">
            <ShieldCheck size={65} />
            <h2>{modal}</h2>
            <p>SAMPLE DOCUMENT</p>
            <p>No personal document is stored or verified.</p>
            <div className="sample-lines">
              •••• •••• 4281
              <br />
              DEMO CUSTOMER
              <br />
              FOR UI PREVIEW ONLY
            </div>
          </div>
        ) : modal === "Notification preview" ? (
          <div className="notification-preview">
            <h3>In-app preview</h3>
            <p>
              <b>QuickFunds · {template}</b>
            </p>
            <p>{templateMessage}</p>
            <hr />
            <h3>Push preview</h3>
            <p className="info-box">
              QuickFunds
              <br />
              {template}
              <br />
              This is a local preview. No notification will be sent.
            </p>
          </div>
        ) : modal === "Inbox" ? (
          <div className="modal-form">
            {[
              "12 KYC applications need review",
              "5 withdrawal requests are pending",
              "Weekly collection report is ready",
            ].map((n) => (
              <p className="info-box" key={n}>
                <Bell size={16} /> {n}
              </p>
            ))}
            <Link className="button-link" href="/notifications">
              Open notifications
            </Link>
          </div>
        ) : modal === "Profile" ? (
          <div className="modal-form">
            <Avatar name="Anjali Sharma" />
            <h2>Anjali Sharma</h2>
            <p>Super Administrator · Demo session</p>
            <Link className="button-link" href="/settings">
              Edit profile & preferences
            </Link>
          </div>
        ) : (
          <div className="modal-form">
            <p>
              {modal === "Reset"
                ? "Reset all saved demo records and preferences in this browser?"
                : modal === "Logout"
                  ? "End this demonstration session? You can reopen the workspace immediately."
                  : `Confirm ${modal.toLowerCase()} for this sample record?`}
            </p>
            <p className="info-box">
              This action updates local demonstration data only. No money is
              moved, no authentication occurs, and no external message is sent.
            </p>
            <div className="action-row">
              <button onClick={() => setModal("")}>Cancel</button>
              <button
                className="primary"
                onClick={() => {
                  if (modal === "Reset") {
                    Object.keys(localStorage)
                      .filter((k) => k.startsWith("qf-"))
                      .forEach((k) => localStorage.removeItem(k));
                    setRows(makeRows(page));
                    setModal("");
                    window.dispatchEvent(new Event("qf-demo-reset"));
                    notify("Demo data reset");
                  } else if (modal === "Logout") {
                    setModal("");
                    setDetail(null);
                    notify("Demo session ended. Workspace remains available.");
                  } else
                    updateStatus(
                      (
                        {
                          Approve: page === "kyc" ? "Approved" : "Processing",
                          Suspend: "Suspended",
                          Activate: "Active",
                          Retry: "Processing",
                          Refund: "Refund requested",
                          "Send notification": "Delivered",
                        } as Record<string, string>
                      )[modal] || "Completed",
                    );
                }}
              >
                Confirm demo action
              </button>
            </div>
          </div>
        )}
      </Dialog>
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={18} />
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
