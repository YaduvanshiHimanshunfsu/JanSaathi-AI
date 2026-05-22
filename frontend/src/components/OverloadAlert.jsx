import { AlertTriangle } from "lucide-react";

export default function OverloadAlert({
  departments
}) {

  if (!departments?.length) {
    return null;
  }

  return (
    <div
      className="
        bg-red-50
        border
        border-red-200
        rounded-2xl
        p-5
        mb-6
        slide-up
      "
    >

      <div className="flex items-start gap-4">

        <div className="bg-red-100 p-3 rounded-xl">

          <AlertTriangle
            className="text-red-600"
            size={28}
          />

        </div>

        <div>

          <h2 className="text-xl font-bold text-red-700">

            Department Overload Detected

          </h2>

          <p className="text-red-600 mt-1">

            AI routing system identified
            overloaded civic departments.

          </p>

          <div className="mt-4 flex flex-wrap gap-3">

            {departments.map((dept, index) => (

              <div
                key={index}
                className="
                  bg-white
                  border
                  border-red-200
                  rounded-xl
                  px-4
                  py-2
                "
              >

                <h3 className="font-semibold text-red-700">
                  {dept.name_en}
                </h3>

                <p className="text-sm text-gray-500">

                  {dept.open_tickets}/
                  {dept.max_capacity}
                  {" "}tickets

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}