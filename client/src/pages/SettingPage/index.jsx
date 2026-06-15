import { useState, useEffect } from "react";
// import { getSettings, updateSettings } from "../../services/setting";\
import SettingService from "../../services/setting";

const FIELDS = [
  {
    key: "restaurant_name",
    label: "Restaurant Name",
    type: "text",
    required: true,
  },
  { key: "address", label: "Address", type: "text", required: false },
  { key: "phone", label: "Phone", type: "text", required: false },
  {
    key: "footer_message",
    label: "Receipt Footer Message",
    type: "text",
    required: false,
  },
  { key: "logo_url", label: "Logo URL", type: "text", required: false },
];

export default function SettingsPage() {
  const [form, setForm] = useState({
    restaurant_name: "",
    address: "",
    phone: "",
    footer_message: "",
    currency: "USD",
    logo_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const settings = await SettingService.getSettings();
        setForm({
          restaurant_name: settings.restaurant_name || "",
          address: settings.address || "",
          phone: settings.phone || "",
          footer_message: settings.footer_message || "",
          currency: settings.currency || "USD",
          logo_url: settings.logo_url || "",
        });
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!form.restaurant_name.trim()) {
      setError("Restaurant name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await SettingService.updateSettings(form);
      setSaved(true);
    } catch (err) {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-dimmed)" }} className="text-sm">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ color: "var(--color-heading)" }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: "var(--color-dimmed)" }}>
          Configure your restaurant information and receipt defaults.
        </p>
      </div>

      {/* Restaurant Info Section */}
      <Section title="Restaurant Info">
        {FIELDS.map(({ key, label, required }) => (
          <Field key={key} label={label} required={required}>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "var(--color-input)",
                border: "1px solid var(--color-panel-border)",
                color: "var(--color-heading)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-brand)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-panel-border)";
              }}
            />
          </Field>
        ))}
      </Section>

      {/* Currency Section */}
      <Section title="Currency">
        <Field label="Display Currency" required={false}>
          <div className="flex gap-3">
            {["USD", "KHR"].map((option) => (
              <button
                key={option}
                onClick={() => handleChange("currency", option)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background:
                    form.currency === option
                      ? "var(--color-brand)"
                      : "var(--color-input)",
                  color:
                    form.currency === option
                      ? "var(--color-page)"
                      : "var(--color-dimmed)",
                  border: "1px solid",
                  borderColor:
                    form.currency === option
                      ? "var(--color-brand)"
                      : "var(--color-panel-border)",
                }}
              >
                {option === "USD" ? "🇺🇸 USD" : "🇰🇭 KHR"}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Error */}
      {error && (
        <p className="text-sm mb-4" style={{ color: "#e57373" }}>
          {error}
        </p>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: saving ? "var(--color-faint)" : "var(--color-brand)",
            color: saving ? "var(--color-dimmed)" : "var(--color-page)",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {saved && (
          <p className="text-sm" style={{ color: "var(--color-brand)" }}>
            ✓ Settings saved
          </p>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        background: "var(--color-panel)",
        border: "1px solid var(--color-panel-border)",
      }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--color-brand)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label
        className="block text-xs mb-1.5 font-medium"
        style={{ color: "var(--color-dimmed)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-brand)" }} className="ml-1">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
