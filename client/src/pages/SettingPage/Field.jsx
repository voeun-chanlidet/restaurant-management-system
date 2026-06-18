const Field = ({ label, required, children }) => {
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
};

export default Field;
