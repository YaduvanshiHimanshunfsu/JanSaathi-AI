import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import SLAIndicator from "./SLAIndicator";
import { UserCheck } from "lucide-react";

export default function DashboardTable({
  grievances,
  onResolve,
  onOfficerClick
}) {

  return (
    <div className="card slide-up overflow-x-auto border border-orange-100/50 shadow-md">

      <div className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-dark tracking-tight">
            Grievances List
          </h2>
          <p className="text-gray-500 text-xs mt-1.5 font-semibold">
            Click on any officer's name to view their administrative caseload details and official directives.
          </p>
        </div>
      </div>

      <table className="w-full min-w-[1100px] text-sm text-gray-700">

        <thead>
          <tr className="border-b border-gray-200 text-left font-bold text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-4">ID</th>
            <th>Citizen</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned Officer</th>
            <th>Predicted SLA</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody className="font-semibold">
          {grievances.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-orange-50/40 transition duration-150"
            >
              <td className="py-5 font-black text-primary">
                {item.grievance_id}
              </td>

              <td className="text-gray-800">
                {item.citizen_name}
              </td>

              <td className="text-gray-850">
                {item.department_hi}
              </td>

              <td>
                <PriorityBadge priority={item.priority} />
              </td>

              <td>
                <StatusBadge status={item.status} />
              </td>

              <td>
                <button
                  onClick={() => onOfficerClick(item.assigned_officer)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-primary border border-orange-100 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
                >
                  <UserCheck size={14} />
                  <span className="underline decoration-dotted font-bold">
                    {item.assigned_officer}
                  </span>
                </button>
              </td>

              <td>
                <SLAIndicator hours={item.predicted_sla_hours} />
              </td>

              <td>
                {item.status !== "Resolved" && (
                  <button
                    onClick={() => onResolve(item.grievance_id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}