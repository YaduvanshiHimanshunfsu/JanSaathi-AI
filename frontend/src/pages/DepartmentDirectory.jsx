import { useEffect, useState } from "react";
import DepartmentCard from "../components/DepartmentCard";
import { fetchDepartments } from "../services/grievanceApi";
import { Search, Building, RefreshCw } from "lucide-react";

// Robust self-healing hardcoded fallback of 10 real UP departments
const FALLBACK_DEPARTMENTS = [
  {
    "id": 1,
    "name_en": "Water Supply",
    "name_hi": "जल आपूर्ति विभाग",
    "helpline": "1916",
    "website": "https://jalnigam.up.gov.in"
  },
  {
    "id": 2,
    "name_en": "Electricity",
    "name_hi": "विद्युत विभाग",
    "helpline": "1912",
    "website": "https://uppcl.org"
  },
  {
    "id": 3,
    "name_en": "Road Repair",
    "name_hi": "सड़क मरम्मत विभाग",
    "helpline": "1800-180-5646",
    "website": "https://pwd.up.gov.in"
  },
  {
    "id": 4,
    "name_en": "Sanitation",
    "name_hi": "स्वच्छता विभाग",
    "helpline": "1533",
    "website": "https://lmc.up.nic.in"
  },
  {
    "id": 5,
    "name_en": "Encroachment",
    "name_hi": "अतिक्रमण विभाग",
    "helpline": "0522-2307770",
    "website": "https://ldaonline.co.in"
  },
  {
    "id": 6,
    "name_en": "Health Services",
    "name_hi": "स्वास्थ्य सेवा विभाग",
    "helpline": "108",
    "website": "https://uphealth.up.nic.in"
  },
  {
    "id": 7,
    "name_en": "Property Tax",
    "name_hi": "संपत्ति कर विभाग",
    "helpline": "1533",
    "website": "https://lmc.up.nic.in"
  },
  {
    "id": 8,
    "name_en": "Public Safety",
    "name_hi": "जन सुरक्षा विभाग",
    "helpline": "112",
    "website": "https://uppolice.gov.in"
  },
  {
    "id": 9,
    "name_en": "Women Security",
    "name_hi": "महिला सुरक्षा एवं सहायता विभाग",
    "helpline": "1090",
    "website": "https://1090.up.gov.in"
  },
  {
    "id": 10,
    "name_en": "Cyber Crime",
    "name_hi": "साइबर अपराध विभाग",
    "helpline": "1930",
    "website": "https://cybercrime.gov.in"
  }
];

export default function DepartmentDirectory() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Read current language setting from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    loadDepartments();
  }, []);

  async function loadDepartments() {
    setLoading(true);
    try {
      const response = await fetchDepartments();
      if (response && response.data && response.data.length > 0) {
        setDepartments(response.data);
        setIsOffline(false);
      } else {
        // Use enriched fallback
        setDepartments(FALLBACK_DEPARTMENTS);
        setIsOffline(true);
      }
    } catch (error) {
      console.warn("Backend offline or error loading departments. Initiating self-healing mock fallback.", error);
      setDepartments(FALLBACK_DEPARTMENTS);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }

  // Bilingual translation dictionary
  const t = {
    en: {
      title: "UP Government",
      titleSpan: "Department Directory",
      subtitle: "Verified contacts, emergency helplines, and official state resources.",
      searchPlaceholder: "Search departments by name...",
      loading: "Loading Official Directory...",
      offlineBadge: "Self-Healing Offline Mode Active",
      departmentsFound: "departments listed",
      retryBtn: "Retry API Sync",
    },
    hi: {
      title: "उत्तर प्रदेश सरकार",
      titleSpan: "विभाग निर्देशिका",
      subtitle: "सत्यापित संपर्क सूत्र, आपातकालीन हेल्पलाइन और आधिकारिक सरकारी संसाधन।",
      searchPlaceholder: "विभाग का नाम खोजें...",
      loading: "आधिकारिक निर्देशिका लोड हो रही है...",
      offlineBadge: "स्वायत्त ऑफलाइन सैंडबॉक्स सक्रिय",
      departmentsFound: "विभाग सूचीबद्ध हैं",
      retryBtn: "पुनः प्रयास करें",
    }
  }[lang];

  // Filtering based on search query
  const filteredDepartments = departments.filter((dept) => {
    const query = searchQuery.toLowerCase();
    const nameEn = (dept.name_en || "").toLowerCase();
    const nameHi = (dept.name_hi || "").toLowerCase();
    return nameEn.includes(query) || nameHi.includes(query);
  });

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="card text-center p-12 max-w-md bg-white/80 backdrop-blur-md border border-orange-100 shadow-xl rounded-3xl">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold mt-6 text-gray-800">
            {t.loading}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-8">
      {/* Header section with branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-150">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-100 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Building size={12} />
              सुनवाई SunwAI Directory
            </span>
            {isOffline && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                {t.offlineBadge}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight leading-none">
            {t.title}
            <span className="text-primary block md:inline md:ml-2">
              {t.titleSpan}
            </span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Action button if offline */}
        {isOffline && (
          <button
            onClick={loadDepartments}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-200 hover:border-primary text-primary font-bold text-sm rounded-xl shadow-sm hover:shadow transition"
          >
            <RefreshCw size={15} />
            {t.retryBtn}
          </button>
        )}
      </div>

      {/* Search Bar section */}
      <div className="mb-8 relative max-w-md bg-white rounded-2xl shadow-sm border border-orange-100 p-1 flex items-center gap-2">
        <div className="pl-3 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full py-2.5 pr-4 text-gray-700 bg-transparent focus:outline-none font-medium text-sm"
        />
      </div>

      {/* Department Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Building size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">
            {lang === "hi" ? "कोई विभाग नहीं मिला" : "No departments found"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {lang === "hi" ? "कृपया अपनी खोज बदलें" : "Try adjusting your search criteria"}
          </p>
        </div>
      )}

      {/* Footer stats badge */}
      <div className="mt-12 text-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
        {filteredDepartments.length} {t.departmentsFound}
      </div>
    </div>
  );
}