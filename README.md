# QuickFunds Admin

Frontend-only QuickFunds operations workspace built with Next.js App Router, strict TypeScript, Tailwind CSS, Radix/shadcn-style UI primitives, Lucide, Recharts, TanStack Table, React Hook Form and Zod.

## Run

Requires Node.js 20.9 or later.

```sh
cd admin-pannel
npm install
npm run dev
```

Open http://localhost:3000/dashboard. Run `npm run lint`, `npm run typecheck`, and `npm run build` to validate. `npm start` serves the production build.

## Pages

Dashboard, users (including `/users/QF-10420` profile links), KYC, limits, withdrawals, payments, transactions, reports, notifications, support, admin users, audit logs and settings are available from the sidebar.

## Demo behavior

All customer information is fictional. Records share centralized customer identities in `lib/data.ts`. Tables support search, sorting, status filters, date filters and pagination. Detail dialogs expose module-specific actions. Changes are saved to browser local storage by module; Settings → Reset demo data clears them. Financial actions simulate status changes only. No APIs, database, authentication, payouts, external messages, credentials, or environment variables are required.

Charts and headline dashboard figures are illustrative static aggregates; they are not live financial calculations and do not recalculate when a record changes. Report CSV downloads contain filtered sample records. Date filters apply to tables and exported records; the illustrative charts remain static.

## Structure

- `app/`: root and validated App Router page routes
- `components/admin.tsx`: shared shell, module views, validated forms and local workflows
- `components/charts.tsx`, `data-table.tsx`, `shared.tsx`: reusable charts, tables, badges and avatars
- `types/record.ts`: shared record interface
- `components/ui/dialog.tsx`: accessible Radix dialog primitive
- `lib/data.ts`: typed centralized fixtures and INR formatter
- `lib/utils.ts`: shadcn class merge utility
- `app/globals.css`: responsive tokens, Tailwind import and workspace styling

The Flutter app in `../app` is independent and unchanged.

## Integration settings

The existing Settings area now includes:

- `/settings`: four-provider overview, local enable/disable switches and explicitly simulated connection tests.
- `/settings/integrations/whatsapp`: mock Meta configuration, masked credential placeholders, shared template management, previews and simulated delivery outcomes.
- `/settings/integrations/s3`: mock bucket/region settings, path preview, file restrictions, storage summaries and a fictional file metadata browser.
- `/settings/integrations/email` and `/settings/integrations/otp`: mock SMTP and MSG91 configuration and test-message forms.
- `/settings/notification-templates`: create, edit, preview and delete shared sample templates.
- `/settings/general`, `/settings/company` and `/settings/security`: local preferences. Earlier policy, payment, appearance and profile controls remain under General Settings → Additional workspace preferences.

Fixtures are centralized in `lib/integrations.ts`; UI is in `components/settings/integration-settings.tsx`. Non-secret configuration, templates, file metadata and preferences persist in browser local storage. Credential fields use visibly fictional placeholders and remain in component memory only; do not enter real credentials. Test buttons never contact providers and simulated sends never deliver messages. Template edits return the local approval status to Pending. Reset demo clears the integration data along with the existing workspace data. No environment configuration is needed.
