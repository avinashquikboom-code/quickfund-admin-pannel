export type ProviderKey = "whatsapp" | "s3" | "email" | "otp";
export interface IntegrationConfig {
  name: string;
  enabled: boolean;
  configured: boolean;
  lastResult: "Passed (simulated)" | "Failed (simulated)" | "Not tested";
  lastTested: string;
  values: Record<string, string | boolean>;
}
export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  status: "Approved" | "Pending" | "Rejected";
  body: string;
}
export const providers: {
  key: ProviderKey;
  name: string;
  description: string;
  provider: string;
}[] = [
  {
    key: "whatsapp",
    name: "WhatsApp Business API",
    provider: "Meta WhatsApp Cloud API",
    description:
      "Keep customers informed with WhatsApp alerts and account updates.",
  },
  {
    key: "s3",
    name: "Amazon S3 Storage",
    provider: "Amazon Web Services",
    description:
      "Organize sample verification documents, reports and profile images.",
  },
  {
    key: "email",
    name: "Email Service",
    provider: "SMTP email",
    description:
      "Manage transactional email and customer communication preferences.",
  },
  {
    key: "otp",
    name: "MSG91 OTP Service",
    provider: "MSG91",
    description:
      "Configure demonstration OTP messages and delivery preferences.",
  },
];
export const initialIntegrations: Record<ProviderKey, IntegrationConfig> = {
  whatsapp: {
    name: "QuickFunds WhatsApp",
    enabled: true,
    configured: true,
    lastResult: "Passed (simulated)",
    lastTested: "2026-10-27T04:30:00.000Z",
    values: {
      accountId: "100000000000001",
      phoneId: "100000000000002",
      phone: "+91 90000 00000",
      version: "v23.0",
      country: "+91",
      webhook: "https://quickfunds.example/webhooks/whatsapp",
    },
  },
  s3: {
    name: "QuickFunds Documents",
    enabled: true,
    configured: true,
    lastResult: "Passed (simulated)",
    lastTested: "2026-10-26T05:15:00.000Z",
    values: {
      region: "ap-south-1",
      bucket: "quickfunds-demo-documents",
      prefix: "kyc/",
      size: "10",
      types: "PDF, JPG, PNG",
      default: true,
    },
  },
  email: {
    name: "QuickFunds Transactional Email",
    enabled: false,
    configured: false,
    lastResult: "Not tested",
    lastTested: "",
    values: {
      host: "smtp.example.com",
      port: "587",
      sender: "QuickFunds",
      email: "notifications@quickfunds.example",
      username: "demo-smtp-user",
      encryption: "STARTTLS",
      reply: "support@quickfunds.example",
    },
  },
  otp: {
    name: "QuickFunds OTP",
    enabled: false,
    configured: true,
    lastResult: "Failed (simulated)",
    lastTested: "2026-10-25T06:00:00.000Z",
    values: {
      sender: "QFUNDS",
      templateId: "DEMO-OTP-001",
      flowId: "DEMO-FLOW-001",
      expiry: "5",
      length: "6",
      country: "+91",
      retries: "3",
    },
  },
};
const messages = [
  [
    "OTP Verification",
    "AUTHENTICATION",
    "Your QuickFunds verification code is {{otp}}. It expires in {{minutes}} minutes.",
  ],
  [
    "KYC Submitted",
    "UTILITY",
    "Hi {{name}}, your KYC application {{application_id}} has been received.",
  ],
  [
    "KYC Approved",
    "UTILITY",
    "Hi {{name}}, your QuickFunds KYC review is approved.",
  ],
  [
    "KYC Rejected",
    "UTILITY",
    "Hi {{name}}, your KYC needs an update: {{reason}}.",
  ],
  [
    "Credit Limit Assigned",
    "UTILITY",
    "Hi {{name}}, your demo credit limit is {{amount}}.",
  ],
  [
    "Withdrawal Successful",
    "UTILITY",
    "Hi {{name}}, your withdrawal {{transaction_id}} for {{amount}} is marked complete.",
  ],
  [
    "Payment Reminder",
    "UTILITY",
    "Hi {{name}}, your payment of {{amount}} is due on {{due_date}}.",
  ],
  [
    "Payment Received",
    "UTILITY",
    "Hi {{name}}, we received your payment of {{amount}}. Reference: {{transaction_id}}.",
  ],
];
export const initialTemplates: MessageTemplate[] = messages.map(
  ([name, category, body], i) => ({
    id: "TPL-" + (101 + i),
    name,
    category,
    language: "English (en)",
    status: i === 3 ? "Rejected" : i === 6 ? "Pending" : "Approved",
    body,
  }),
);
export const sampleFiles = [
  {
    id: "f1",
    name: "identity-sample.pdf",
    folder: "kyc/",
    type: "PDF",
    size: "284 KB",
  },
  {
    id: "f2",
    name: "profile-sample.jpg",
    folder: "profile-images/",
    type: "JPG",
    size: "96 KB",
  },
  {
    id: "f3",
    name: "address-sample.pdf",
    folder: "documents/",
    type: "PDF",
    size: "410 KB",
  },
  {
    id: "f4",
    name: "collections-october.csv",
    folder: "reports/",
    type: "CSV",
    size: "32 KB",
  },
  {
    id: "f5",
    name: "transactions-demo.csv",
    folder: "exports/",
    type: "CSV",
    size: "18 KB",
  },
];
export const settingsLinks = [
  ["", "Integration overview"],
  ["general", "General Settings"],
  ["company", "Company Profile"],
  ["integrations/whatsapp", "WhatsApp Integration"],
  ["integrations/s3", "Amazon S3 Storage"],
  ["integrations/email", "Email Integration"],
  ["integrations/otp", "OTP / MSG91 Integration"],
  ["notification-templates", "Notification Templates"],
  ["security", "Security Settings"],
];
export const settingsPaths = settingsLinks.map(([path]) => path);
export function previewMessage(body: string) {
  const values: Record<string, string> = {
    name: "Priya",
    otp: "123456",
    minutes: "5",
    amount: "₹15,000",
    due_date: "28 Oct 2026",
    transaction_id: "DEMO-TXN-10421",
    application_id: "DEMO-KYC-10421",
    reason: "Please upload a clearer sample document",
  };
  return body.replace(
    /{{\s*(\w+)\s*}}/g,
    (_, key: string) => values[key] || `[${key}]`,
  );
}
