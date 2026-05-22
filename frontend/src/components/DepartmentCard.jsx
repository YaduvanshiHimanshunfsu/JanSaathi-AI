import { useState, useEffect } from "react";
import {
  Globe,
  Phone,
  Droplet,
  Zap,
  Hammer,
  Trash2,
  Signpost,
  HeartPulse,
  Receipt,
  ShieldAlert,
  UserCheck,
  Lock,
  Building
} from "lucide-react";

export default function DepartmentCard({ department }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  const name = lang === "hi" ? department.name_hi : department.name_en;
  const subName = lang === "hi" ? department.name_en : department.name_hi;
  const visitText = lang === "hi" ? "वेबसाइट पर जाएं" : "Visit Website";
  const helplineLabel = lang === "hi" ? "आधिकारिक हेल्पलाइन" : "Official Helpline";

  // Dynamic Lucide icon mapper based on department name
  const getDepartmentIcon = (nameEn) => {
    switch (nameEn) {
      case "Water Supply":
        return <Droplet size={24} className="text-blue-500" />;
      case "Electricity":
        return <Zap size={24} className="text-yellow-500 animate-pulse" />;
      case "Road Repair":
        return <Hammer size={24} className="text-amber-600" />;
      case "Sanitation":
        return <Trash2 size={24} className="text-green-600" />;
      case "Encroachment":
        return <Signpost size={24} className="text-orange-500" />;
      case "Health Services":
        return <HeartPulse size={24} className="text-red-500" />;
      case "Property Tax":
        return <Receipt size={24} className="text-teal-500" />;
      case "Public Safety":
        return <ShieldAlert size={24} className="text-indigo-500 animate-bounce" />;
      case "Women Security":
        return <UserCheck size={24} className="text-purple-500" />;
      case "Cyber Crime":
        return <Lock size={24} className="text-rose-500" />;
      default:
        return <Building size={24} className="text-primary" />;
    }
  };

  return (
    <div
      className="
        bg-white/95
        backdrop-blur-md
        border
        border-orange-100
        hover:border-primary/30
        hover:shadow-2xl
        transition-all
        duration-300
        p-6
        rounded-3xl
        flex
        flex-col
        justify-between
        h-full
        slide-up
        hover:scale-[1.02]
      "
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-800 tracking-tight leading-tight">
              {name}
            </h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1.5">
              {subName}
            </p>
          </div>

          <div
            className="
              bg-orange-50
              p-3
              rounded-2xl
              flex-shrink-0
              shadow-inner
              border
              border-orange-100/50
            "
          >
            {getDepartmentIcon(department.name_en)}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/50 hover:bg-orange-50/20 transition-all duration-300">
            <Phone
              size={18}
              className="text-primary flex-shrink-0 animate-pulse"
            />
            <div className="flex flex-col font-semibold">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                {helplineLabel}
              </span>
              <a
                href={`tel:${department.helpline}`}
                className="font-extrabold text-gray-800 hover:text-primary transition-colors text-sm mt-0.5"
              >
                {department.helpline}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <a
          href={department.website}
          target="_blank"
          rel="noreferrer"
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            px-4
            bg-orange-50
            text-primary
            font-bold
            text-xs
            rounded-2xl
            border
            border-orange-100/30
            hover:bg-primary
            hover:text-white
            hover:border-transparent
            transition-all
            duration-300
            shadow-sm
            uppercase
            tracking-wider
          "
        >
          <Globe size={14} />
          {visitText}
        </a>
      </div>
    </div>
  );
}