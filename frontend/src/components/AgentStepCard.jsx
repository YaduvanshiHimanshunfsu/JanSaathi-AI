import LoaderAnimation from "./LoaderAnimation";

export default function AgentStepCard({
  title,
  active,
  completed
}) {

  return (
    <div
      className={`
        p-4 rounded-2xl border transition-all duration-300
        ${
          active
            ? "border-primary bg-orange-50 pulse-glow"
            : completed
            ? "border-green-500 bg-green-50"
            : "border-gray-200 bg-white"
        }
      `}
    >

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            Autonomous Processing
          </p>
        </div>

        {active && <LoaderAnimation />}

        {completed && (
          <span className="text-green-600 font-bold">
            ✓
          </span>
        )}

      </div>
    </div>
  );
}