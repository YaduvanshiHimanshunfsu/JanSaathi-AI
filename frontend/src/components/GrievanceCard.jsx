import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import SLAIndicator from "./SLAIndicator";

export default function GrievanceCard({
  grievance
}) {

  return (
    <div className="card mt-8 slide-up">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Grievance Registered
          </h2>

          <p className="text-gray-500 mt-1">
            Autonomous routing completed successfully
          </p>

        </div>

        <PriorityBadge
          priority={grievance.priority}
        />

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Grievance ID
            </p>

            <h3 className="font-bold text-lg">
              {grievance.grievance_id}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Assigned Department
            </p>

            <h3 className="font-semibold">
              {grievance.department_hi}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Assigned Officer
            </p>

            <h3 className="font-semibold">
              {grievance.assigned_officer}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Urgency Level
            </p>

            <h3 className="font-semibold">
              {grievance.urgency_label}
            </h3>
          </div>

        </div>

        <div className="space-y-6">

          <StatusBadge
            status={grievance.status}
          />

          <SLAIndicator
            hours={
              grievance.predicted_sla_hours
            }
          />

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">

            <h3 className="font-bold text-primary mb-3">
              Citizen Acknowledgement
            </h3>

            <p className="leading-relaxed text-gray-700 whitespace-pre-line">
              {grievance.citizen_message}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}