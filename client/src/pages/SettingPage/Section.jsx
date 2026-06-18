const Section = ({ title, children }) => {
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
};
export default Section;
