import { useState, useEffect } from "react";
import DashboardTable from "../components/DashboardTable";
import OverloadAlert from "../components/OverloadAlert";
import useDashboardData from "../hooks/useDashboardData";
import api from "../services/api";
import { 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  WifiOff, 
  Lock, 
  Mail, 
  Key, 
  User, 
  Phone, 
  Activity, 
  CheckCircle,
  X,
  ShieldAlert
} from "lucide-react";

export default function OfficerDashboard() {
  const lang = localStorage.getItem("lang") || "en";

  const {
    grievances,
    loading,
    error,
    isOffline,
    refresh,
    loadOfflineData,
    resolveGrievanceOffline,
    resetLiveMode
  } = useDashboardData();

  const [resolving, setResolving] = useState(false);

  // Secure login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Officer detail modal state
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -----------------------------------
  // Dynamic Localization Dictionary
  // -----------------------------------
  const t = {
    en: {
      loadingTitle: "Loading Dashboard",
      loadingSub: "Fetching active grievance statistics...",
      errTitle: "Dashboard Loading Failure",
      errSub: "We encountered a network error while connecting to the FastAPI backend at http://localhost:8000.",
      btnTryAgain: "Try Again",
      btnOfflineMode: "Launch Resilient Offline Mode",
      offlineBadge: "Self-Healing Offline Mode",
      btnResetLive: "Connect Live Server",
      pageTitle: "Officer Control",
      pageSub: "Dashboard",
      desc: "Autonomous grievance routing, escalation, and resolution monitoring.",
      credits: "Created by Himanshu Yadav | APL Hackathon organized by GDG Lucknow",
      loginTitle: "Officer Administration Gateway",
      loginSub: "Access the autonomous grievance monitoring platform.",
      loginLabelEmail: "Government Email ID",
      loginLabelPass: "Security Access Password",
      loginBtn: "Authenticate Portal",
      loginErr: "Invalid secure access credentials. Please verify and retry.",
      testCredsNote: "💡 TEST MODE ACTIVE: Enter any email/password (or default: admin@sunwai.gov.in / admin123) to grant instant access.",
      modalTitle: "In-charge Officer Profile",
      modalActiveCases: "Active Caseload Limit",
      modalSla: "Average Resolution Speed",
      modalEmail: "Official Government Email",
      modalPhone: "Direct Administration Helpline",
      modalNotes: "Department Directives & UP Shasan Guidelines",
      closeBtn: "Close Window"
    },
    hi: {
      loadingTitle: "डैशबोर्ड लोड हो रहा है",
      loadingSub: "सक्रिय शिकायत डेटा प्राप्त किया जा रहा है...",
      errTitle: "डैशबोर्ड लोड होने में विफलता",
      errSub: "FastAPI सर्वर (http://localhost:8000) से सक्रिय शिकायतें लोड करते समय कनेक्टिविटी त्रुटि आई।",
      btnTryAgain: "पुनः प्रयास करें",
      btnOfflineMode: "लचीला ऑफ़लाइन मोड प्रारंभ करें",
      offlineBadge: "लचीला ऑफ़लाइन मोड सक्रिय है",
      btnResetLive: "लाइव सर्वर से जुड़ें",
      pageTitle: "अधिकारी नियंत्रण",
      pageSub: "डैशबोर्ड",
      desc: "स्वायत्त शिकायत रूटिंग, एसएलए एस्केलेशन और समाधान निगरानी प्रणाली।",
      credits: "हिमांशु यादव द्वारा निर्मित | GDG लखनऊ द्वारा आयोजित APL हैकाथॉन",
      loginTitle: "अधिकारी प्रशासनिक लॉगिन",
      loginSub: "स्वायत्त जन शिकायत निस्तारण प्रणाली में लॉग इन करें।",
      loginLabelEmail: "सरकारी ईमेल आईडी",
      loginLabelPass: "सुरक्षा एक्सेस पासवर्ड",
      loginBtn: "प्रवेश प्रमाणित करें",
      loginErr: "अवैध लॉगिन क्रेडेंशियल। कृपया पुनः जांचें।",
      testCredsNote: "💡 परीक्षण मोड: परीक्षण हेतु कोई भी ईमेल और पासवर्ड दर्ज करें (अथवा डिफ़ॉल्ट: admin@sunwai.gov.in / admin123)।",
      modalTitle: "प्रभारी अधिकारी विवरण",
      modalActiveCases: "सक्रिय कार्यभार सीमा",
      modalSla: "औसत समाधान समय",
      modalEmail: "आधिकारिक सरकारी ईमेल",
      modalPhone: "सीधा प्रशासनिक हेल्पलाइन",
      modalNotes: "विभाग निर्देश और उत्तर प्रदेश शासन नियमावली",
      closeBtn: "खिड़की बंद करें"
    }
  }[lang];

  // Officer administrative database details
  const officerDetailsMap = {
    "Amit Verma": {
      email: "amit.verma@up.gov.in",
      phone: "+91-522-2238411",
      activeCases: "14 / 50 Cases",
      avgSla: "6 Hours",
      notes: "Amit Verma handles municipal drinking water pipelines. Under Rule 14-B of UP Shasan, immediate actions include conducting water pressure audits in Sector 4 and repairing main distribution lines."
    },
    "Pooja Mishra": {
      email: "pooja.mishra@up.gov.in",
      phone: "+91-522-2238914",
      activeCases: "38 / 50 Cases (High Workload)",
      avgSla: "12 Hours",
      notes: "Pooja Mishra oversees metropolitan sanitation drives. Directive: deployment of sewer-cleaning vehicle squads in Aminabad within 12 hours of complaint allocation."
    },
    "Neeraj Tiwari": {
      email: "neeraj.tiwari@up.gov.in",
      phone: "+91-522-2234045",
      activeCases: "9 / 50 Cases",
      avgSla: "24 Hours",
      notes: "Neeraj Tiwari coordinates municipal road repair and patching works. Currently dispatching cold-mix pothole repair vans to Charbagh Station Road."
    },
    "Rakesh Singh": {
      email: "rakesh.singh@up.gov.in",
      phone: "+91-522-2238992",
      activeCases: "45 / 50 Cases (Near Capacity)",
      avgSla: "4 Hours",
      notes: "Rakesh Singh manages high-voltage transformer and streetlight grid repair. Collaborates with UPPCL to balance metropolitan load parameters."
    },
    "Inspector Rajeev Sharma": {
      email: "rajeev.sharma@uppolice.gov.in",
      phone: "+91-522-2200112",
      activeCases: "5 / 50 Cases",
      avgSla: "3 Hours",
      notes: "Inspector Rajeev Sharma operates civic security patrol routers. Immediate directive: ensure night patrols around Hazratganj and public places."
    },
    "Dr. K.P. Tripathi": {
      email: "kp.tripathi@uphealth.gov.in",
      phone: "+91-522-2200108",
      activeCases: "19 / 50 Cases",
      avgSla: "8 Hours",
      notes: "Dr. K.P. Tripathi manages vector-borne disease controls and municipal health sanitation programs. Focus: dengue prevention and anti-larval spray sweeps."
    },
    "Smt. Sushma Kharakwal": {
      email: "mayor.lucknow@up.gov.in",
      phone: "+91-522-2230770",
      activeCases: "2 / 20 Cases",
      avgSla: "4 Hours",
      notes: "Smt. Sushma Kharakwal coordinates women safety hotlines and municipal development boards. Supervises LNN metropolises directly."
    },
    "Ankit Srivastava": {
      email: "ankit.srivastava@cybercell.gov.in",
      phone: "+91-522-2231930",
      activeCases: "12 / 50 Cases",
      avgSla: "6 Hours",
      notes: "Ankit Srivastava spearheads metropolitan cyber safety operations. Oversees financial cyber fraud recovery within the golden 2-hour window."
    }
  };

  // -----------------------------------
  // Overload Detection
  // -----------------------------------
  const overloadedDepartments = grievances.filter((item) => item.overload_flag);

  // -----------------------------------
  // Handle Login Authentication
  // -----------------------------------
  function handleLogin(e) {
    e.preventDefault();
    if (email.trim() !== "" && password.trim() !== "") {
      sessionStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError(t.loginErr);
    }
  }

  // -----------------------------------
  // Handle Clicked Officer Name
  // -----------------------------------
  function handleOfficerClick(officerName) {
    const detail = officerDetailsMap[officerName] || {
      email: `${officerName.toLowerCase().replace(/[^a-z]/g, "")}@up.gov.in`,
      phone: "+91-522-2238400",
      activeCases: "10 / 50 Cases",
      avgSla: "24 Hours",
      notes: "Assigned officer operating under general UP Municipal Shasan laws."
    };
    setSelectedOfficer({ name: officerName, ...detail });
    setIsModalOpen(true);
  }

  // -----------------------------------
  // Resolve Grievance Action Handler
  // -----------------------------------
  async function handleResolve(grievanceId) {
    try {
      setResolving(true);
      if (isOffline) {
        // Self-healing offline local update
        resolveGrievanceOffline(grievanceId);
      } else {
        await api.patch(`/dashboard/resolve/${grievanceId}`);
        await refresh();
      }
    } catch (err) {
      console.error("Resolve failed, applying self-healing offline fallback:", err);
      resolveGrievanceOffline(grievanceId);
    } finally {
      setResolving(false);
    }
  }

  // -----------------------------------
  // Login Gate Rendering
  // -----------------------------------
  if (!isLoggedIn) {
    return (
      <div className="page-container flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white/80 backdrop-blur-md border border-orange-100 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-orange-500" />
          
          <div className="text-center">
            <div className="bg-orange-100 text-primary p-3 rounded-2xl w-fit mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-dark tracking-tight">{t.loginTitle}</h2>
            <p className="text-gray-500 text-xs mt-1.5 font-medium leading-relaxed">{t.loginSub}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-semibold text-sm">
            <div className="space-y-1.5">
              <label className="text-gray-650 flex items-center gap-1.5">
                <Mail size={16} className="text-primary" />
                {t.loginLabelEmail}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@sunwai.gov.in"
                required
                className="w-full border border-orange-100 focus:border-primary rounded-xl px-4 py-2.5 outline-none bg-orange-50/10 text-gray-700 font-medium transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-650 flex items-center gap-1.5">
                <Key size={16} className="text-primary" />
                {t.loginLabelPass}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-orange-100 focus:border-primary rounded-xl px-4 py-2.5 outline-none bg-orange-50/10 text-gray-700 font-medium transition"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 animate-pulse text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.01] hover:shadow-orange-500/35 transition duration-300"
            >
              {t.loginBtn}
            </button>
          </form>

          <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 text-[11px] text-orange-900 leading-relaxed font-semibold">
            {t.testCredsNote}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------
  // Loading State Rendering
  // -----------------------------------
  if (loading) {
    return (
      <div className="page-container">
        <div className="card text-center py-20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h2 className="text-2xl font-bold mt-6">{t.loadingTitle}</h2>
          <p className="text-gray-500 mt-2">{t.loadingSub}</p>
        </div>
      </div>
    );
  }

  // -----------------------------------
  // Error State Rendering
  // -----------------------------------
  if (error && !isOffline) {
    return (
      <div className="page-container">
        <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl text-center">
          <div className="bg-red-50 p-4 rounded-2xl w-fit mx-auto text-red-500 mb-6">
            <AlertTriangle size={48} className="animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-red-700">{t.errTitle}</h2>
          <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">{t.errSub}</p>
          <div className="bg-gray-50 text-gray-500 border border-gray-100 rounded-xl p-3 text-xs mt-3 italic font-mono">
            {error}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => refresh()}
              className="primary-btn inline-flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              {t.btnTryAgain}
            </button>
            <button
              onClick={() => loadOfflineData()}
              className="bg-gray-800 text-white hover:bg-black px-6 py-3 rounded-xl font-bold shadow-md hover:translate-y-[-1px] transition-all inline-flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-orange-400" />
              {t.btnOfflineMode}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black text-dark tracking-tight">
            {t.pageTitle}
            <span className="text-primary font-black"> {t.pageSub}</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl">{t.desc}</p>
        </div>

        {/* Dynamic Mode Switcher */}
        {isOffline ? (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm animate-pulse">
            <div className="bg-orange-500 text-white p-2 rounded-xl">
              <WifiOff size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                {t.offlineBadge}
              </p>
              <button
                onClick={() => resetLiveMode()}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-bold mt-0.5 text-left block"
              >
                {t.btnResetLive} &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm">
            <div className="bg-green-500 text-white p-2 rounded-xl animate-pulse">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-green-800 uppercase tracking-wide">
                Connected Live Mode
              </p>
              <button
                onClick={() => loadOfflineData()}
                className="text-xs text-orange-600 hover:text-orange-800 hover:underline font-bold mt-0.5 text-left block"
              >
                Switch Sandbox Offline
              </button>
            </div>
          </div>
        )}
      </div>

      <OverloadAlert departments={overloadedDepartments} />

      <DashboardTable 
        grievances={grievances} 
        onResolve={handleResolve} 
        onOfficerClick={handleOfficerClick} 
      />

      {resolving && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="card text-center p-8 border border-orange-100 bg-white rounded-3xl shadow-2xl">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-black mt-5">Processing State...</h2>
          </div>
        </div>
      )}

      {/* 👮 Glassmorphic In-charge Officer Details Modal Overlay */}
      {isModalOpen && selectedOfficer && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative animate-slide-up">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedOfficer(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={20} />
            </button>

            <div className="flex gap-4 items-center border-b pb-4">
              <div className="bg-gradient-to-tr from-primary to-orange-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                <User size={30} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                  {selectedOfficer.name}
                </h3>
                <span className="inline-block mt-2 bg-orange-100 text-primary text-xs font-bold px-2.5 py-0.5 rounded-md uppercase">
                  UP Government Officer
                </span>
              </div>
            </div>

            <div className="space-y-3 font-semibold text-xs text-gray-600">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t.modalEmail}</span>
                  <a href={`mailto:${selectedOfficer.email}`} className="text-gray-800 font-bold hover:underline">{selectedOfficer.email}</a>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t.modalPhone}</span>
                  <a href={`tel:${selectedOfficer.phone}`} className="text-gray-800 font-bold hover:underline">{selectedOfficer.phone}</a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Activity size={16} className="text-primary flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t.modalActiveCases}</span>
                    <span className="text-gray-800 font-bold mt-0.5">{selectedOfficer.activeCases}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t.modalSla}</span>
                    <span className="text-gray-800 font-bold mt-0.5">{selectedOfficer.avgSla}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              <span className="text-[10px] text-primary uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                <ShieldAlert size={14} />
                {t.modalNotes}
              </span>
              <p className="text-[11px] text-gray-705 leading-relaxed font-semibold">
                {selectedOfficer.notes}
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedOfficer(null);
              }}
              className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl text-xs hover:bg-black transition"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Footer credits inside container for aesthetics */}
      <div className="mt-16 text-center border-t border-orange-100/50 pt-8 pb-4">
        <p className="text-sm font-semibold text-gray-400 tracking-wider">
          {t.credits}
        </p>
      </div>
    </div>
  );
}