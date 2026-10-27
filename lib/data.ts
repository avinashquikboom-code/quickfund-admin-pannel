import type { RecordRow } from "@/types/record";
export type { RecordRow } from "@/types/record";
export const names = [
  "Aarav Sharma",
  "Priya Patel",
  "Rahul Verma",
  "Sneha Reddy",
  "Vikram Singh",
  "Ananya Iyer",
  "Arjun Mehta",
  "Neha Gupta",
  "Rohan Desai",
  "Ishita Shah",
  "Aditya Kumar",
  "Kavya Nair",
  "Dev Malhotra",
  "Pooja Joshi",
  "Siddharth Rao",
  "Meera Kapoor",
  "Karan Bhat",
  "Riya Sinha",
  "Nikhil Jain",
  "Tanvi Bose",
  "Varun Sethi",
  "Aditi Kulkarni",
  "Yash Agarwal",
  "Sana Khan",
];
export const users: RecordRow[] = names.map((name, i) => ({
  id: `QF-${10420 + i}`,
  name,
  email: name.toLowerCase().replace(" ", ".") + "@example.com",
  phone: `+91 98${String(54321000 + i)}`,
  status: i % 7 === 0 ? "Suspended" : "Active",
  kyc: ["Approved", "Pending", "Approved", "Rejected"][i % 4],
  amount: 10000 + (i % 8) * 5000,
  balance: 5000 + (i % 5) * 2500,
  date: `2026-10-${String(27 - (i % 22)).padStart(2, "0")}`,
  method: ["UPI", "Bank transfer", "Debit card"][i % 3],
  type: [
    "Credit",
    "Withdrawal",
    "Repayment",
    "Daily Charge",
    "Refund",
    "Debit",
  ][i % 6],
  subject: [
    "Payment not reflected",
    "KYC document update",
    "Withdrawal status",
    "Credit limit inquiry",
  ][i % 4],
  priority: ["High", "Medium", "Low"][i % 3],
  agent: ["Anjali Sharma", "Rohit Mehra", "Unassigned"][i % 3],
  role: ["Administrator", "Operations", "Support", "Viewer"][i % 4],
}));
export const makeRows = (page: string): RecordRow[] =>
  users.map((u, i) => ({
    ...u,
    id:
      page === "users"
        ? u.id
        : `${({ kyc: "KYC", limits: "LIM", withdrawals: "WD", payments: "PAY", transactions: "TXN", support: "TKT", "admin-users": "ADM", "audit-logs": "LOG", notifications: "NTF" } as Record<string, string>)[page] || "QF"}-${10420 + i}`,
    status:
      page === "kyc"
        ? u.kyc
        : page === "withdrawals"
          ? ["Pending", "Processing", "Completed", "Failed", "Rejected"][i % 5]
          : page === "payments"
            ? ["Paid", "Pending", "Overdue"][i % 3]
            : page === "support"
              ? ["Open", "In progress", "Resolved"][i % 3]
              : page === "transactions"
                ? ["Completed", "Completed", "Pending", "Failed"][i % 4]
                : page === "notifications"
                  ? ["Delivered", "Scheduled", "Draft"][i % 3]
                  : page === "audit-logs"
                    ? ["Success", "Success", "Failed"][i % 3]
                    : u.status,
  }));
export const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
  (name, i) => ({
    name,
    registrations: [140, 220, 180, 320, 260, 380, 340][i],
    collections: [90, 140, 120, 230, 180, 290, 260][i],
  }),
);
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const navigation = [
  ["dashboard", "Dashboard"],
  ["users", "Users"],
  ["kyc", "KYC Verification"],
  ["limits", "Credit Limits"],
  ["withdrawals", "Withdrawals"],
  ["payments", "Payments"],
  ["transactions", "Transactions"],
  ["reports", "Reports & Analytics"],
  ["notifications", "Notifications"],
  ["support", "Support Tickets"],
  ["admin-users", "Admin Users"],
  ["audit-logs", "Audit Logs"],
  ["settings", "Settings"],
];
