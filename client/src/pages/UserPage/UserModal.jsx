import { useState, useEffect } from "react";

const ROLES = [
  { value: "STAFF", label: "Staff" },
  { value: "KITCHEN", label: "Kitchen" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "STAFF",
  isActive: true,
};

const UserModal = ({ user, onSubmit, onClose, submitting, error }) => {
  const isEditMode = Boolean(user);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "", // never pre-fill password
        role: user.role,
        isActive: user.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [user]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-panel border border-panel-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-panel-border">
          <h2 className="text-base font-semibold text-heading">
            {isEditMode ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-dimmed hover:text-heading hover:bg-white/5 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dimmed uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sophea Chan"
              required
              className="w-full bg-input border border-panel-border rounded-lg px-3.5 py-2.5 text-base text-heading placeholder:text-dimmed focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dimmed uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. sophea@rms.com"
              required
              className="w-full bg-input border border-panel-border rounded-lg px-3.5 py-2.5 text-base text-heading placeholder:text-dimmed focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dimmed uppercase tracking-wider">
              Password{" "}
              {isEditMode && (
                <span className="normal-case font-normal text-faint">
                  — leave blank to keep current
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  isEditMode
                    ? "Enter new password to change"
                    : "Min. 8 characters"
                }
                required={!isEditMode}
                minLength={form.password ? 8 : undefined}
                className="w-full bg-input border border-panel-border rounded-lg px-3.5 py-2.5 pr-10 text-base text-heading placeholder:text-dimmed focus:outline-none focus:border-brand transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dimmed hover:text-heading transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dimmed uppercase tracking-wider">
              Role
            </label>
            {user?.role === "ADMIN" ? (
              <div className="w-full bg-input border border-panel-border rounded-lg px-3.5 py-2.5 text-sm text-dimmed">
                Admin
              </div>
            ) : (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-input border border-panel-border rounded-lg px-3.5 py-2.5 text-sm text-heading focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
              >
                {ROLES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Active toggle — only in edit mode */}
          {isEditMode && (
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-heading">Active</p>
                <p className="text-xs text-dimmed">
                  Inactive users cannot log in
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isActive ? "bg-brand" : "bg-panel-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-panel-border text-sm font-medium text-dimmed hover:text-heading hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-hover text-black text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
