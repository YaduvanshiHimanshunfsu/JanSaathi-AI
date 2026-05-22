export default function SLAIndicator({
  hours
}) {

  return (
    <div className="flex flex-col">

      <span className="text-sm text-gray-500">
        Predicted SLA
      </span>

      <span className="font-bold text-primary">
        {hours} Hours
      </span>

    </div>
  );
}