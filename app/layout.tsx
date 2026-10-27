import "./globals.css";
export const metadata = {
  title: "QuickFunds — Admin workspace",
  description: "QuickFunds frontend demonstration",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
