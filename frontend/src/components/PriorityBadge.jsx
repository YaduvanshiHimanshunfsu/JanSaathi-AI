export default function PriorityBadge({
  priority
}) {

  let styles = "";

  if (priority >= 5) {
    styles =
      "bg-red-100 text-red-700";
  }

  else if (priority >= 4) {
    styles =
      "bg-orange-100 text-orange-700";
  }

  else if (priority >= 3) {
    styles =
      "bg-yellow-100 text-yellow-700";
  }

  else {
    styles =
      "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-semibold
        ${styles}
      `}
    >
      Priority {priority}
    </span>
  );
}