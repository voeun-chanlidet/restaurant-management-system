import { useState, useEffect } from "react";
import SettingService from "../../services/setting";
import Field from "./Field";
import Section from "./Section";
import toast from "react-hot-toast";

const FIELDS = [
  { key: "restaurant_name", label: "Restaurant Name", required: true },
  { key: "address", label: "Address", required: false },
  { key: "phone", label: "Phone", required: false },
  { key: "footer_message", label: "Receipt Footer Message", required: false },
  { key: "logo_url", label: "Logo URL", required: false },
];

const SettingsPage = () => {
  const [form, setForm] = useState({
    restaurant_name: "",
    address: "",
    phone: "",
    footer_message: "",
    currency: "USD",
    exchange_rate: 4100,
    logo_url: "",
  });
  const [khqrFile, setKhqrFile] = useState(null);
  const [khqrPreview, setKhqrPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await SettingService.getSettings();
        setForm({
          restaurant_name: settings.restaurant_name || "",
          address: settings.address || "",
          phone: settings.phone || "",
          footer_message: settings.footer_message || "",
          currency: settings.currency || "USD",
          exchange_rate: settings.exchange_rate || 4100,
          logo_url: settings.logo_url || "",
        });
        if (settings.khqr_image_url) {
          setKhqrPreview(settings.khqr_image_url);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            "Failed to load settings. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleKhqrFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setKhqrFile(file);
    setKhqrPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.restaurant_name.trim()) {
      toast.error("Restaurant name is required.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("restaurant_name", form.restaurant_name);
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("footer_message", form.footer_message);
      formData.append("currency", form.currency);
      formData.append("exchange_rate", form.exchange_rate);
      formData.append("logo_url", form.logo_url);
      if (khqrFile) {
        formData.append("khqrImage", khqrFile);
      }
      await SettingService.updateSettings(formData);
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to save settings. Please try again.",
      );
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

  const inputStyle = {
    background: "var(--color-input)",
    border: "1px solid var(--color-panel-border)",
    color: "var(--color-heading)",
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors";

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

      {/* Restaurant Info */}
      <Section title="Restaurant Info">
        {FIELDS.map(({ key, label, required }) => (
          <Field key={key} label={label} required={required}>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-brand)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-panel-border)")
              }
            />
          </Field>
        ))}
      </Section>

      {/* Currency */}
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

        {form.currency === "KHR" && (
          <Field label="Exchange Rate (1 USD = ? KHR)" required={false}>
            <input
              type="number"
              value={form.exchange_rate}
              onChange={(e) =>
                handleChange("exchange_rate", parseFloat(e.target.value))
              }
              placeholder="e.g. 4100"
              className={inputClass}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-brand)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-panel-border)")
              }
            />
          </Field>
        )}
      </Section>

      {/* KHQR */}
      <Section title="KHQR Payment">
        <Field label="KHQR Image" required={false}>
          <div className="flex flex-col gap-2">
            {khqrPreview && (
              <img
                src={khqrPreview}
                alt="KHQR Preview"
                className="w-40 h-40 object-contain rounded-lg border border-panel-border"
              />
            )}
            <label
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
              style={{
                border: "1px dashed var(--color-panel-border)",
                color: "var(--color-dimmed)",
              }}
            >
              <span>
                {khqrPreview ? "Change KHQR image" : "Upload KHQR image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleKhqrFileChange}
                className="hidden"
              />
            </label>
          </div>
        </Field>
      </Section>

      {/* Save */}
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
      </div>
    </div>
  );
};

export default SettingsPage;
