import Admin from "@/components/admin";
import { notFound } from "next/navigation";
import { settingsPaths } from "@/lib/integrations";
const pages = [
  "dashboard",
  "users",
  "kyc",
  "limits",
  "withdrawals",
  "payments",
  "transactions",
  "reports",
  "notifications",
  "support",
  "admin-users",
  "audit-logs",
  "settings",
];
export function generateStaticParams() {
  return [
    ...pages.map((page) => ({ slug: [page] })),
    ...settingsPaths
      .filter(Boolean)
      .map((path) => ({ slug: ["settings", ...path.split("/")] })),
  ];
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const settingsSection = slug.slice(1).join("/");
  if (
    !pages.includes(slug[0]) ||
    (slug[0] === "settings"
      ? !settingsPaths.includes(settingsSection)
      : slug.length > 1 && (slug[0] !== "users" || slug.length !== 2))
  )
    notFound();
  return (
    <Admin
      page={slug[0]}
      selectedId={slug[0] === "users" ? slug[1] : undefined}
      settingsSection={settingsSection}
    />
  );
}
