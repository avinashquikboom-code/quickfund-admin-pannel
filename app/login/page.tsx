import { Metadata } from "next";
import AdminLogin from "@/components/admin-login";

export const metadata: Metadata = {
  title: "Admin Sign In — QuickFunds Enterprise Console",
  description: "Secure administrative login for QuickFunds financial operations and merchant credit management.",
};

export default function LoginPage() {
  return <AdminLogin />;
}
