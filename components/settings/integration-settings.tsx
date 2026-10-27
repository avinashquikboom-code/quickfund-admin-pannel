"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  Cloud,
  Mail,
  KeyRound,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Send,
  FileText,
  Trash2,
  Search,
  ChevronRight,
  ShieldCheck,
  Save,
  X,
  Settings2,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared";
import {
  initialIntegrations,
  initialTemplates,
  providers,
  settingsLinks,
  sampleFiles,
  previewMessage,
  type ProviderKey,
  type IntegrationConfig,
  type MessageTemplate,
} from "@/lib/integrations";
const initialPreferences: Record<string, string | boolean> = {
  company: "QuickFunds Technologies",
  email: "admin@quickfunds.example",
  address: "Bengaluru, Karnataka, India",
  currency: "INR",
  timezone: "Asia/Kolkata",
  language: "English",
  mfa: true,
  timeout: "30",
  audit: true,
};
const providerIcons = {
  whatsapp: MessageCircle,
  s3: Cloud,
  email: Mail,
  otp: KeyRound,
};
const emptyTemplate: MessageTemplate = {
  id: "",
  name: "",
  category: "UTILITY",
  language: "English (en)",
  status: "Pending",
  body: "",
};
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="integration-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span aria-hidden="true" className="switch-track" />
    </label>
  );
}
function SecretInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <label>
      {label}
      <span className="secret-input">
        <input
          type={show ? "text" : "password"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Demo placeholder only"
        />
        <button
          type="button"
          aria-label={`${show ? "Hide" : "Show"} ${label}`}
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
  );
}
export function IntegrationSettings({
  section = "",
  legacy,
}: {
  section?: string;
  legacy: React.ReactNode;
}) {
  const [configs, setConfigs] = useState(initialIntegrations),
    [templates, setTemplates] = useState(initialTemplates),
    [ready, setReady] = useState(false),
    [draft, setDraft] = useState<IntegrationConfig>(
      initialIntegrations.whatsapp,
    ),
    [secrets, setSecrets] = useState<Record<string, string>>({
      token: "DEMO_ACCESS_TOKEN_NOT_VALID",
      webhookToken: "DEMO_WEBHOOK_TOKEN",
      accessKey: "DEMO_ACCESS_KEY",
      secretKey: "DEMO_SECRET_KEY",
      password: "DEMO_SMTP_PASSWORD",
      authKey: "DEMO_MSG91_AUTH_KEY",
    }),
    [toast, setToast] = useState(""),
    [testing, setTesting] = useState(""),
    [modal, setModal] = useState(""),
    [editing, setEditing] = useState<MessageTemplate>(emptyTemplate),
    [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0].id),
    [recipient, setRecipient] = useState(""),
    [result, setResult] = useState("success"),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [folder, setFolder] = useState("All folders"),
    [files, setFiles] = useState(sampleFiles),
    [fileId, setFileId] = useState(""),
    [preferences, setPreferences] =
      useState<Record<string, string | boolean>>(initialPreferences);
  const providerKey = (
    section.startsWith("integrations/") ? section.split("/")[1] : null
  ) as ProviderKey | null;
  const provider = providers.find((p) => p.key === providerKey);
  function notify(text: string) {
    setToast(text);
  }
  useEffect(() => {
    try {
      const saved = localStorage.getItem("qf-integrations");
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfigs({ ...initialIntegrations, ...parsed });
      }
      const savedTemplates = localStorage.getItem("qf-integration-templates");
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      const savedPrefs = localStorage.getItem("qf-integration-preferences");
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
      const savedFiles = localStorage.getItem("qf-integration-files");
      if (savedFiles) setFiles(JSON.parse(savedFiles));
    } catch {
      /* Recover with fictional fixtures. */
    }
    setReady(true);
    const reset = () => {
      setConfigs(initialIntegrations);
      setTemplates(initialTemplates);
      setFiles(sampleFiles);
      setPreferences(initialPreferences);
      setSearch("");
      setFolder("All folders");
      setModal("");
      setError("");
    };
    window.addEventListener("qf-demo-reset", reset);
    return () => window.removeEventListener("qf-demo-reset", reset);
  }, []);
  useEffect(() => {
    if (providerKey) setDraft(configs[providerKey]);
  }, [providerKey, configs]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    setError("");
    setModal("");
    setSearch("");
  }, [section]);
  function saveConfigs(next: typeof configs) {
    setConfigs(next);
    localStorage.setItem("qf-integrations", JSON.stringify(next));
  }
  function saveTemplates(next: MessageTemplate[]) {
    setTemplates(next);
    localStorage.setItem("qf-integration-templates", JSON.stringify(next));
  }
  function setValue(key: string, value: string | boolean) {
    setDraft((d) => ({ ...d, values: { ...d.values, [key]: value } }));
  }
  function runTest(key: ProviderKey) {
    const config = configs[key];
    if (!config.configured) {
      notify("Save the mock configuration before running a simulated test.");
      return;
    }
    setTesting(key);
    const passed = key !== "otp";
    const next = {
      ...config,
      lastResult: passed
        ? ("Passed (simulated)" as const)
        : ("Failed (simulated)" as const),
      lastTested: new Date().toISOString(),
    };
    saveConfigs({ ...configs, [key]: next });
    setTesting("");
    notify(
      passed
        ? "Mock test passed. No external connection was made."
        : "Mock test failed: sample provider unavailable. No external connection was made.",
    );
  }
  function field(
    label: string,
    key: string,
    options?: string[],
    type = "text",
    required = true,
  ) {
    return (
      <label key={key}>
        {label}
        {options ? (
          <select
            value={String(draft.values[key] ?? "")}
            onChange={(e) => setValue(key, e.target.value)}
            required={required}
          >
            {options.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            required={required}
            min={type === "number" ? 1 : undefined}
            max={
              type === "number" ? (key === "port" ? 65535 : 1000) : undefined
            }
            value={String(draft.values[key] ?? "")}
            onChange={(e) => setValue(key, e.target.value)}
          />
        )}
      </label>
    );
  }
  function saveConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!providerKey) return;
    setError("");
    if (
      providerKey === "s3" &&
      !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(String(draft.values.bucket))
    ) {
      setError(
        "Use a 3–63 character lowercase bucket name with letters, numbers, dots or hyphens.",
      );
      return;
    }
    if (
      providerKey === "whatsapp" &&
      (!/^\d{5,20}$/.test(String(draft.values.accountId)) ||
        !/^\d{5,20}$/.test(String(draft.values.phoneId)))
    ) {
      setError("Business account and phone IDs must contain 5–20 digits.");
      return;
    }
    saveConfigs({ ...configs, [providerKey]: { ...draft, configured: true } });
    notify(
      "Mock configuration saved. Credential placeholders stay in this session only.",
    );
  }
  const dateLabel = (v: string) =>
    v
      ? new Date(v).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        })
      : "Never tested";
  const chosen =
    templates.find((t) => t.id === selectedTemplate) || templates[0];
  const filteredTemplates = templates.filter((t) =>
    (t.name + " " + t.category + " " + t.language)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const currentFile = files.find((f) => f.id === fileId);
  function templateSection() {
    return (
      <section className="card integration-section">
        <div className="card-heading">
          <div>
            <h3>Message templates</h3>
            <p>Sample provider approval states and reusable message content.</p>
          </div>
          <button
            className="primary"
            onClick={() => {
              setEditing(emptyTemplate);
              setError("");
              setModal("template");
            }}
          >
            <Plus size={15} />
            Create template
          </button>
        </div>
        <div className="toolbar">
          <div className="search-input">
            <Search size={16} />
            <input
              aria-label="Search templates"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              notify("Mock statuses refreshed. No provider was contacted.")
            }
          >
            <RefreshCw size={15} />
            Refresh status
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Template",
                  "Category",
                  "Language",
                  "Approval",
                  "Variables",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((t) => (
                <tr key={t.id}>
                  <td>
                    <b>{t.name}</b>
                    <small className="block">{t.id}</small>
                  </td>
                  <td>{t.category}</td>
                  <td>{t.language}</td>
                  <td>
                    <Badge value={t.status} />
                  </td>
                  <td className="template-variables">
                    {(t.body.match(/{{.*?}}/g) || ["None"]).join(", ")}
                  </td>
                  <td>
                    <div className="file-actions">
                      <button
                        onClick={() => {
                          setEditing(t);
                          setModal("preview");
                        }}
                        aria-label={`Preview ${t.name}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(t);
                          setError("");
                          setModal("template");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setEditing(t);
                          setModal("delete-template");
                        }}
                        aria-label={`Delete ${t.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTemplates.length === 0 && (
            <div className="empty">
              No matching templates. Create a template or clear your search.
            </div>
          )}
        </div>
      </section>
    );
  }
  if (!ready)
    return (
      <div className="stats-grid">
        {providers.map((p) => (
          <div key={p.key} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  return (
    <div className="integration-workspace">
      <aside className="card integration-nav">
        <span className="nav-label">SETTINGS</span>
        {settingsLinks.map(([path, label]) => (
          <Link
            key={path}
            className={section === path ? "selected" : ""}
            href={path ? `/settings/${path}` : "/settings"}
          >
            {label}
            <ChevronRight size={14} />
          </Link>
        ))}
      </aside>
      <div className="integration-content">
        <div className="integration-banner">
          <ShieldCheck size={17} />
          <span>
            Demo configuration workspace · All tests and sends are simulated.
            Use placeholder credentials only.
          </span>
        </div>
        {section === "" ? (
          <>
            <div className="integration-page-heading">
              <div>
                <h2>Connected services</h2>
                <p className="muted">
                  One workspace for your communication and storage preferences.
                </p>
              </div>
              <span className="count-pill">
                {Object.values(configs).filter((c) => c.enabled).length} of 4
                enabled
              </span>
            </div>
            <div className="provider-grid">
              {providers.map((p) => {
                const config = configs[p.key],
                  Icon = providerIcons[p.key];
                return (
                  <section className="card provider-card" key={p.key}>
                    <div className="provider-card-top">
                      <span className="integration-icon">
                        <Icon size={23} />
                      </span>
                      <Badge
                        value={
                          config.configured ? "Configured" : "Not Configured"
                        }
                      />
                    </div>
                    <h3>{p.name}</h3>
                    <small className="provider-name">{p.provider}</small>
                    <p>{p.description}</p>
                    <div className="test-result">
                      <span>Last mock test</span>
                      <b
                        className={
                          config.lastResult.startsWith("Failed") ? "error" : ""
                        }
                      >
                        {config.lastResult}
                      </b>
                      <small>{dateLabel(config.lastTested)}</small>
                    </div>
                    <Toggle
                      label={config.enabled ? "Enabled" : "Disabled"}
                      checked={config.enabled}
                      onChange={(enabled) => {
                        if (enabled && !config.configured) {
                          notify(
                            "Configure this mock integration before enabling it.",
                          );
                          return;
                        }
                        saveConfigs({
                          ...configs,
                          [p.key]: { ...config, enabled },
                        });
                        notify(
                          `${p.name} ${enabled ? "enabled" : "disabled"} locally`,
                        );
                      }}
                    />
                    <div className="provider-card-actions">
                      <Link
                        className="button-link"
                        href={`/settings/integrations/${p.key}`}
                      >
                        Configure <ArrowUpRight size={14} />
                      </Link>
                      <button
                        disabled={testing === p.key}
                        onClick={() => runTest(p.key)}
                      >
                        <RefreshCw size={14} />
                        Test connection
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>
            <p className="muted">
              “Configured” describes saved mock settings. It does not indicate a
              live provider connection.
            </p>
          </>
        ) : provider && providerKey ? (
          <>
            <div className="integration-page-heading">
              <div>
                <h2>{provider.name}</h2>
                <p className="muted">{provider.description}</p>
              </div>
              <Badge
                value={
                  configs[providerKey].configured
                    ? "Configured"
                    : "Not Configured"
                }
              />
            </div>
            {providerKey === "s3" && (
              <div className="storage-summary">
                {[
                  ["Bucket name", String(draft.values.bucket)],
                  ["AWS region", String(draft.values.region)],
                  ["Estimated storage", "2.4 GB · sample"],
                  ["Stored files", `${files.length} sample files`],
                  ["File size limit", `${draft.values.size} MB`],
                  [
                    "Storage status",
                    draft.enabled ? "Enabled · demo" : "Disabled · demo",
                  ],
                ].map(([k, v]) => (
                  <div className="card" key={k}>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
            )}
            <form className="card integration-form" onSubmit={saveConfig}>
              <div className="card-heading">
                <div>
                  <h3>Configuration</h3>
                  <p>{provider.provider} · Local mock settings</p>
                </div>
                <span className="integration-icon">
                  {(() => {
                    const Icon = providerIcons[providerKey];
                    return <Icon size={20} />;
                  })()}
                </span>
              </div>
              <div className="integration-form-grid">
                <label>
                  Integration name
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Provider
                  <input readOnly value={provider.provider} />
                </label>
                {providerKey === "whatsapp" ? (
                  <>
                    {field("WhatsApp Business Account ID", "accountId")}
                    {field("Phone Number ID", "phoneId")}
                    {field("Business phone number", "phone", undefined, "tel")}
                    {field("API version", "version", [
                      "v23.0",
                      "v22.0",
                      "v21.0",
                    ])}
                    <SecretInput
                      label="Access token (demo)"
                      value={secrets.token}
                      onChange={(v) => setSecrets({ ...secrets, token: v })}
                    />
                    <SecretInput
                      label="Webhook verification token (demo)"
                      value={secrets.webhookToken}
                      onChange={(v) =>
                        setSecrets({ ...secrets, webhookToken: v })
                      }
                    />
                    <label className="field-wide">
                      Webhook URL · example
                      <input readOnly value={String(draft.values.webhook)} />
                    </label>
                    {field("Default country code", "country", [
                      "+91",
                      "+1",
                      "+44",
                    ])}
                  </>
                ) : providerKey === "s3" ? (
                  <>
                    {field("AWS Region", "region", [
                      "ap-south-1",
                      "ap-south-2",
                      "ap-southeast-1",
                      "eu-west-1",
                      "us-east-1",
                      "us-west-2",
                    ])}
                    {field("S3 Bucket Name", "bucket")}
                    <SecretInput
                      label="AWS Access Key ID (demo)"
                      value={secrets.accessKey}
                      onChange={(v) => setSecrets({ ...secrets, accessKey: v })}
                    />
                    <SecretInput
                      label="AWS Secret Access Key (demo)"
                      value={secrets.secretKey}
                      onChange={(v) => setSecrets({ ...secrets, secretKey: v })}
                    />
                    {field("Folder prefix", "prefix", [
                      "kyc/",
                      "profile-images/",
                      "documents/",
                      "reports/",
                      "exports/",
                    ])}
                    {field("File size limit (MB)", "size", undefined, "number")}
                    {field("Allowed file types", "types", [
                      "PDF, JPG, PNG",
                      "PDF, JPG, PNG, CSV",
                      "PDF",
                      "JPG, PNG",
                    ])}
                    <label className="field-wide">
                      Storage path preview
                      <input
                        readOnly
                        value={`s3://${draft.values.bucket}/${draft.values.prefix}`}
                      />
                    </label>
                  </>
                ) : providerKey === "email" ? (
                  <>
                    {field("SMTP host", "host")}
                    {field("SMTP port", "port", undefined, "number")}
                    {field("Sender name", "sender")}
                    {field("Sender email address", "email", undefined, "email")}
                    {field("SMTP username", "username")}
                    <SecretInput
                      label="SMTP password (demo)"
                      value={secrets.password}
                      onChange={(v) => setSecrets({ ...secrets, password: v })}
                    />
                    {field("Encryption", "encryption", ["STARTTLS", "TLS"])}
                    {field("Reply-to address", "reply", undefined, "email")}
                  </>
                ) : (
                  <>
                    <SecretInput
                      label="MSG91 auth key (demo)"
                      value={secrets.authKey}
                      onChange={(v) => setSecrets({ ...secrets, authKey: v })}
                    />
                    {field("Sender ID", "sender")}
                    {field("Template ID", "templateId")}
                    {field("Flow ID", "flowId")}
                    {field(
                      "OTP expiry (minutes)",
                      "expiry",
                      undefined,
                      "number",
                    )}
                    {field("OTP length", "length", ["6", "4"])}
                    {field("Default country code", "country", [
                      "+91",
                      "+1",
                      "+44",
                    ])}
                    {field("Retry limit", "retries", undefined, "number")}
                  </>
                )}
              </div>
              <div className="integration-form-footer">
                {providerKey === "s3" && (
                  <Toggle
                    label="Use as default storage"
                    checked={Boolean(draft.values.default)}
                    onChange={(v) => setValue("default", v)}
                  />
                )}
                <Toggle
                  label={
                    providerKey === "whatsapp"
                      ? "Enable WhatsApp notifications"
                      : `Enable ${provider.name}`
                  }
                  checked={draft.enabled}
                  onChange={(enabled) => setDraft({ ...draft, enabled })}
                />
                {error && (
                  <p role="alert" className="error">
                    {error}
                  </p>
                )}
                <div className="action-row">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(configs[providerKey]);
                      notify("Unsaved configuration changes discarded");
                    }}
                  >
                    Discard changes
                  </button>
                  <Button type="submit">
                    <Save size={15} />
                    Save configuration
                  </Button>
                </div>
              </div>
            </form>
            <section className="card connection-test">
              <div>
                <h3>Test workspace</h3>
                <p className="muted">
                  Saved configuration · Last mock test:{" "}
                  {configs[providerKey].lastResult} ·{" "}
                  {dateLabel(configs[providerKey].lastTested)}
                </p>
              </div>
              <button onClick={() => runTest(providerKey)}>
                <RefreshCw size={15} />
                Test connection
              </button>
              {providerKey !== "s3" && (
                <button
                  className="primary"
                  onClick={() => {
                    setError("");
                    setRecipient("");
                    setModal("test-message");
                  }}
                >
                  <Send size={15} />
                  {providerKey === "whatsapp"
                    ? "Test message"
                    : providerKey === "email"
                      ? "Test email"
                      : "Test OTP"}
                </button>
              )}
            </section>
            {providerKey === "whatsapp" && templateSection()}
            {providerKey === "s3" && (
              <section className="card integration-section">
                <div className="card-heading">
                  <div>
                    <h3>Sample file browser</h3>
                    <p>
                      Fictional metadata only. No files are uploaded or stored
                      in AWS.
                    </p>
                  </div>
                  <span className="count-pill">{files.length} files</span>
                </div>
                <div className="toolbar">
                  <div className="search-input">
                    <Search size={16} />
                    <input
                      aria-label="Search files"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search sample files..."
                    />
                  </div>
                  <select
                    aria-label="Filter folder"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                  >
                    {[
                      "All folders",
                      "kyc/",
                      "profile-images/",
                      "documents/",
                      "reports/",
                      "exports/",
                    ].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {[
                          "File name",
                          "Folder",
                          "File type",
                          "Size",
                          "Actions",
                        ].map((t) => (
                          <th key={t}>{t}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {files
                        .filter(
                          (f) =>
                            f.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) &&
                            (folder === "All folders" || f.folder === folder),
                        )
                        .map((f) => (
                          <tr key={f.id}>
                            <td>
                              <span className="file-name">
                                <FileText size={16} />
                                {f.name}
                              </span>
                            </td>
                            <td>{f.folder}</td>
                            <td>{f.type}</td>
                            <td>{f.size}</td>
                            <td>
                              <div className="file-actions">
                                <button
                                  aria-label={`Preview ${f.name}`}
                                  onClick={() => {
                                    setFileId(f.id);
                                    setModal("file-preview");
                                  }}
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  aria-label={`Delete ${f.name}`}
                                  onClick={() => {
                                    setFileId(f.id);
                                    setModal("delete-file");
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {!files.some(
                    (f) =>
                      f.name.toLowerCase().includes(search.toLowerCase()) &&
                      (folder === "All folders" || f.folder === folder),
                  ) && (
                    <div className="empty">
                      No sample files match your filters.
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        ) : section === "notification-templates" ? (
          <>
            <div className="integration-page-heading">
              <div>
                <h2>Notification templates</h2>
                <p className="muted">
                  Manage shared sample messages and preview customer
                  notifications.
                </p>
              </div>
            </div>
            {templateSection()}
          </>
        ) : (
          <>
            <div className="integration-page-heading">
              <h2>
                {section === "company"
                  ? "Company Profile"
                  : section === "security"
                    ? "Security Settings"
                    : "General Settings"}
              </h2>
            </div>
            <form
              className="card integration-form"
              onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem(
                  "qf-integration-preferences",
                  JSON.stringify(preferences),
                );
                notify("Demo preferences saved to this browser");
              }}
            >
              <div className="integration-form-grid">
                {section === "company" ? (
                  <>
                    {[
                      ["Company name", "company"],
                      ["Contact email", "email"],
                      ["Address", "address"],
                    ].map(([label, key]) => (
                      <label key={key}>
                        {label}
                        <input
                          required
                          type={key === "email" ? "email" : "text"}
                          value={String(preferences[key])}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              [key]: e.target.value,
                            })
                          }
                        />
                      </label>
                    ))}
                  </>
                ) : section === "security" ? (
                  <>
                    <Toggle
                      label="Require two-step verification (UI preference only)"
                      checked={Boolean(preferences.mfa)}
                      onChange={(v) =>
                        setPreferences({ ...preferences, mfa: v })
                      }
                    />
                    <Toggle
                      label="Activity logging preference"
                      checked={Boolean(preferences.audit)}
                      onChange={(v) =>
                        setPreferences({ ...preferences, audit: v })
                      }
                    />
                    <label>
                      Session timeout preview
                      <select
                        value={String(preferences.timeout)}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            timeout: e.target.value,
                          })
                        }
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </label>
                    <p className="info-box field-wide">
                      These preferences demonstrate the UI. They do not enforce
                      authentication, sessions or access control.
                    </p>
                  </>
                ) : (
                  <>
                    {[
                      ["Currency", "currency", ["INR"]],
                      ["Timezone", "timezone", ["Asia/Kolkata", "UTC"]],
                      ["Language", "language", ["English", "Hindi"]],
                    ].map(([label, key, options]) => (
                      <label key={String(key)}>
                        {label}
                        <select
                          value={String(preferences[String(key)])}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              [String(key)]: e.target.value,
                            })
                          }
                        >
                          {(options as string[]).map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </>
                )}
              </div>
              <div className="integration-form-footer">
                <Button type="submit">Save preferences</Button>
              </div>
            </form>
            {section === "general" && (
              <details className="legacy-preferences">
                <summary>
                  <Settings2 size={17} />
                  Additional workspace preferences
                </summary>
                {legacy}
              </details>
            )}
          </>
        )}
      </div>
      <Dialog
        open={!!modal}
        onClose={() => {
          setModal("");
          setError("");
        }}
        title={
          modal === "template"
            ? editing.id
              ? "Edit template"
              : "Create template"
            : modal === "preview"
              ? "Template preview"
              : modal === "delete-template"
                ? "Delete sample template"
                : modal === "test-message"
                  ? "Simulate message delivery"
                  : modal === "file-preview"
                    ? "Sample file preview"
                    : "Delete sample file"
        }
      >
        {modal === "template" ? (
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim() || !editing.body.trim()) {
                setError("Add a template name and message.");
                return;
              }
              const item = {
                ...editing,
                id: editing.id || `TPL-${Date.now()}`,
                name: editing.name.trim(),
                status: "Pending" as const,
              };
              saveTemplates(
                editing.id
                  ? templates.map((t) => (t.id === editing.id ? item : t))
                  : [...templates, item],
              );
              setModal("");
              notify(
                "Template saved locally with a mock Pending approval status",
              );
            }}
          >
            <label>
              Template name
              <input
                required
                maxLength={80}
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </label>
            <div className="integration-form-grid compact-grid">
              <label>
                Category
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  {["AUTHENTICATION", "UTILITY", "MARKETING"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Language
                <select
                  value={editing.language}
                  onChange={(e) =>
                    setEditing({ ...editing, language: e.target.value })
                  }
                >
                  <option>English (en)</option>
                  <option>Hindi (hi)</option>
                </select>
              </label>
            </div>
            <label>
              Message content
              <textarea
                required
                maxLength={1500}
                value={editing.body}
                onChange={(e) =>
                  setEditing({ ...editing, body: e.target.value })
                }
                placeholder="Hi {{name}}, your payment of {{amount}} is due on {{due_date}}."
              />
            </label>
            <p className="muted">
              Variables:{" "}
              {
                "{{name}}, {{otp}}, {{amount}}, {{due_date}}, {{transaction_id}}"
              }
            </p>
            <div className="message-bubble">
              {previewMessage(editing.body) ||
                "Your message preview will appear here."}
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">Save template</Button>
          </form>
        ) : modal === "preview" ? (
          <div className="modal-form">
            <h3>{editing.name}</h3>
            <Badge value={editing.status} />
            <div className="message-bubble">{previewMessage(editing.body)}</div>
            <p className="muted">
              Variables:{" "}
              {(editing.body.match(/{{.*?}}/g) || ["None"]).join(", ")}
              <br />
              Preview uses fictional sample values.
            </p>
          </div>
        ) : modal === "test-message" ? (
          <form
            className="modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!providerKey) return;
              if (
                !configs[providerKey].configured ||
                !configs[providerKey].enabled
              ) {
                setError(
                  "Save and enable the mock integration before simulating a message.",
                );
                return;
              }
              if (
                providerKey !== "email" &&
                (!/^\+?[\d\s-]+$/.test(recipient) ||
                  !/^\d{10,15}$/.test(recipient.replace(/\D/g, "")))
              ) {
                setError("Enter a sample mobile number with 10–15 digits.");
                return;
              }
              if (!chosen) {
                setError("Create a sample template first.");
                return;
              }
              setError("");
              setModal("");
              notify(
                result === "success"
                  ? "Simulated delivery succeeded. No message was sent."
                  : "Simulated delivery failed. No message was sent.",
              );
            }}
          >
            <label>
              {providerKey === "email"
                ? "Sample recipient email"
                : "Sample recipient mobile number"}
              <input
                required
                type={providerKey === "email" ? "email" : "tel"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  providerKey === "email"
                    ? "customer@example.com"
                    : "+91 90000 00000"
                }
              />
            </label>
            <label>
              Template
              <select
                value={chosen?.id || ""}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {templates.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.name} · {t.status}
                  </option>
                ))}
              </select>
            </label>
            <div className="message-bubble">
              {chosen ? previewMessage(chosen.body) : "No templates available"}
            </div>
            <label>
              Mock result
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
              >
                <option value="success">Simulated success</option>
                <option value="failure">Simulated failure</option>
              </select>
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">
              <Send size={15} />
              Simulate send
            </Button>
          </form>
        ) : modal === "file-preview" ? (
          <div className="document-preview">
            <FileText size={60} />
            <h3>{currentFile?.name}</h3>
            <p>
              {currentFile?.folder} · {currentFile?.type} · {currentFile?.size}
            </p>
            <div className="sample-lines">
              SAMPLE FILE
              <br />
              Metadata preview only
              <br />
              No document content stored
            </div>
          </div>
        ) : (
          <div className="modal-form">
            <p>
              Remove{" "}
              {modal === "delete-template" ? editing.name : currentFile?.name}{" "}
              from the local demonstration?
            </p>
            <p className="muted">
              This affects mock data in this browser only.
            </p>
            <div className="action-row">
              <button onClick={() => setModal("")}>Cancel</button>
              <button
                className="danger-text"
                onClick={() => {
                  if (modal === "delete-template")
                    saveTemplates(templates.filter((t) => t.id !== editing.id));
                  else {
                    const next = files.filter((f) => f.id !== fileId);
                    setFiles(next);
                    localStorage.setItem(
                      "qf-integration-files",
                      JSON.stringify(next),
                    );
                  }
                  setModal("");
                  notify("Sample record removed locally");
                }}
              >
                <Trash2 size={15} />
                Delete sample
              </button>
            </div>
          </div>
        )}
      </Dialog>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button aria-label="Dismiss message" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
