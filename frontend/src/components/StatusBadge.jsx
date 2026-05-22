export default function StatusBadge({
  status
}) {

  const statusStyles = {

    "Assigned":
      "bg-blue-100 text-blue-700",

    "In Progress":
      "bg-yellow-100 text-yellow-700",

    "Resolved":
      "bg-green-100 text-green-700",

    "Escalated":
      "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-semibold
        ${statusStyles[status]}
      `}
    >
      {status}
    </span>
  );
}