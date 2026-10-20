const messages: Record<string, string> = {
  saved: "Saved.",
  created: "Created.",
  deleted: "Deleted.",
  moved: "Reordered.",
};

export default function StatusBanner({
  status,
  message,
}: {
  status?: string;
  message?: string;
}) {
  if (status === "error") {
    return (
      <div
        role="alert"
        className="mb-6 rounded-lg border-[1.5px] border-accent bg-accent/10 px-4 py-3 text-sm font-semibold text-ink"
      >
        {message || "Something went wrong — please try again."}
      </div>
    );
  }

  if (!status || !messages[status]) return null;
  return (
    <div
      role="status"
      className="mb-6 rounded-lg border-[1.5px] border-accent-2 bg-accent-2/10 px-4 py-3 text-sm font-semibold text-ink"
    >
      {messages[status]}
    </div>
  );
}
