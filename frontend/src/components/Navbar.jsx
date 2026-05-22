import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  BarChart3,
  MapPin,
  Languages
} from "lucide-react";

/**
 * Navbar Component with Dynamic Language Support (English / Hindi)
 * and premium branding for "सुनवाई SunwAI"
 */
export default function Navbar() {
  const location = useLocation();
  
  // Initialize language from localStorage or default to English
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  // Synchronize language state with local storage
  function handleLangToggle(selectedLang) {
    localStorage.setItem("lang", selectedLang);
    setLang(selectedLang);
    // Force complete UI state re-evaluation by refreshing page slightly 
    // to allow self-healing components to synchronize instantly
    window.location.reload();
  }

  // Active path styling helper
  const isActive = (path) => location.pathname === path;

  // Bilingual UI label dictionaries
  const t = {
    en: {
      brandSub: "Autonomous Grievance Intelligence",
      citizen: "Citizen Portal",
      dashboard: "Officer Dashboard",
      departments: "Departments",
      analytics: "Analytics",
      lucknow: "Lucknow Nagar Nigam",
    },
    hi: {
      brandSub: "स्वायत्त शिकायत निवारण प्रणाली",
      citizen: "नागरिक पोर्टल",
      dashboard: "अधिकारी डैशबोर्ड",
      departments: "विभाग निर्देशिका",
      analytics: "सिस्टम एनालिटिक्स",
      lucknow: "लखनऊ नगर निगम",
    }
  }[lang];

  return (
    <nav className="bg-white shadow-md border-b border-orange-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Branding Section */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-dark tracking-tight flex items-center gap-1.5">
              सुनवाई <span className="text-primary font-black">SunwAI</span>
            </h1>

            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {t.brandSub}
            </p>
          </div>
        </Link>

        {/* Navigation Links and Language Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl transition ${
                isActive("/") 
                  ? "bg-orange-50 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-orange-50/50"
              }`}
            >
              {t.citizen}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                isActive("/dashboard") 
                  ? "bg-orange-50 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-orange-50/50"
              }`}
            >
              <LayoutDashboard size={16} />
              {t.dashboard}
            </Link>

            <Link
              to="/departments"
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                isActive("/departments") 
                  ? "bg-orange-50 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-orange-50/50"
              }`}
            >
              <Building2 size={16} />
              {t.departments}
            </Link>

            <Link
              to="/analytics"
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                isActive("/analytics") 
                  ? "bg-orange-50 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-orange-50/50"
              }`}
            >
              <BarChart3 size={16} />
              {t.analytics}
            </Link>

            <Link
              to="/lucknow-demo"
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition border border-dashed ${
                isActive("/lucknow-demo") 
                  ? "bg-orange-100 text-primary border-primary" 
                  : "text-gray-600 hover:text-primary border-orange-200 hover:bg-orange-50"
              }`}
            >
              <MapPin size={16} className="animate-bounce" />
              {t.lucknow}
            </Link>

          </div>

          {/* Language Toggle buttons (Hindi / English) */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => handleLangToggle("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                lang === "en"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLangToggle("hi")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                lang === "hi"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              हिन्दी
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}