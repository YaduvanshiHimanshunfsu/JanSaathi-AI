import { useState, useEffect } from "react";
import ComplaintForm from "../components/ComplaintForm";
import AgentPipeline from "../components/AgentPipeline";
import GrievanceCard from "../components/GrievanceCard";
import useAgentFlow from "../hooks/useAgentFlow";
import { submitGrievance } from "../services/grievanceApi";
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  History, 
  AlertTriangle,
  Info,
  X
} from "lucide-react";

export default function CitizenPortal() {
  const [loading, setLoading] = useState(false);
  const [grievance, setGrievance] = useState(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [lang, setLang] = useState("en");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Read current language setting from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    
    // Load local complaint history from localStorage
    const savedGrievances = localStorage.getItem("local_grievances");
    if (savedGrievances) {
      setHistoryList(JSON.parse(savedGrievances));
    }
  }, []);

  const { currentStep, steps } = useAgentFlow(pipelineActive);

  // Dynamic dictionary translation for CitizenPortal
  const t = {
    en: {
      brandSub: "Uttar Pradesh Government",
      cmTitle: "Hon'ble Chief Minister",
      deputyCmTitle: "Hon'ble Deputy Chief Minister",
      csTitle: "Chief Secretary, UP",
      leaderCardTitle: "Government of Uttar Pradesh",
      leaderCardSub: "Key State Cabinet & Administration",
      heroTitle: "Autonomous AI-Powered",
      heroTitleSpan: "Grievance Resolution",
      heroSub: "सुनवाई SunwAI leverages state-of-the-art multi-agent intelligence to intake, classify, balance workload, and autonomously resolve public complaints in native vernaculars.",
      trackerTitle: "Complaint Tracker & History",
      trackerSub: "Track status of your filed grievances in real-time.",
      idLabel: "ID",
      statusLabel: "Status",
      dateLabel: "Registered On",
      noHistory: "No complaints filed yet. Submit a grievance to track its live orchestration.",
      simulationSuccess: "Autonomous multi-agent routing completed successfully!",
      trackingHistoryHeader: "Latest Submissions History",
      viewDetails: "View Details",
      aiAgentOrchestration: "AI Agent Orchestration Active",
      historySectionTitle: "Citizen Complaint History",
      detailTitle: "Grievance Details",
      assignedOfficer: "Assigned Officer",
      department: "Department",
      predictedSla: "Predicted SLA",
      status: "Current Status",
      citizenAlert: "Vernacular SMS Acknowledgement (Hindi)",
      closeBtn: "Close Panel",
      realtimeTracker: "Real-time AI Pipeline Progress"
    },
    hi: {
      brandSub: "उत्तर प्रदेश सरकार",
      cmTitle: "माननीय मुख्यमंत्री",
      deputyCmTitle: "माननीय उप मुख्यमंत्री",
      csTitle: "मुख्य सचिव, उ.प्र.",
      leaderCardTitle: "उत्तर प्रदेश शासन",
      leaderCardSub: "प्रमुख राज्य मंत्रिमंडल एवं प्रशासनिक अधिकारी",
      heroTitle: "स्वायत्त एआई-संचालित",
      heroTitleSpan: "शिकायत निवारण प्रणाली",
      heroSub: "सुनवाई SunwAI जन शिकायतों को स्वीकार करने, वर्गीकृत करने, अधिकारियों का कार्यभार संतुलित करने और स्थानीय भाषाओं में स्वतः संवाद करने के लिए उन्नत एआई एजेंट का उपयोग करती है।",
      trackerTitle: "शिकायत ट्रैकर एवं इतिहास",
      trackerSub: "अपनी दर्ज शिकायतों की वास्तविक समय में स्थिति ट्रैक करें।",
      idLabel: "शिकायत संख्या",
      statusLabel: "स्थिति",
      dateLabel: "दर्ज की तिथि",
      noHistory: "अभी तक कोई शिकायत दर्ज नहीं है। एआई एजेंट का लाइव काम देखने के लिए शिकायत दर्ज करें।",
      simulationSuccess: "स्वायत्त बहु-एजेंट रूटिंग सफलतापूर्वक संपन्न!",
      trackingHistoryHeader: "नवीनतम शिकायतों का इतिहास",
      viewDetails: "विवरण देखें",
      aiAgentOrchestration: "एआई एजेंट पाइपलाइन सक्रिय है",
      historySectionTitle: "नागरिक शिकायत इतिहास",
      detailTitle: "शिकायत विवरण",
      assignedOfficer: "संबंधित अधिकारी",
      department: "विभाग",
      predictedSla: "अनुमानित समाधान समय",
      status: "शिकायत स्थिति",
      citizenAlert: "नागरिक एसएमएस संदेश (हिन्दी)",
      closeBtn: "बंद करें",
      realtimeTracker: "वास्तविक समय एआई पाइपलाइन प्रगति"
    }
  }[lang];

  // Up Government leadership structure data
  const cabinetLeaders = [
    {
      name: "Yogi Adityanath",
      name_hi: "योगी आदित्यनाथ",
      title: t.cmTitle,
      party: "Chief Minister, UP",
      avatarBg: "from-orange-600 via-orange-500 to-amber-600",
      initial: "YA"
    },
    {
      name: "Keshav Prasad Maurya",
      name_hi: "केशव प्रसाद मौर्य",
      title: t.deputyCmTitle,
      party: "Deputy CM, UP",
      avatarBg: "from-amber-500 to-orange-400",
      initial: "KM"
    },
    {
      name: "Brajesh Pathak",
      name_hi: "बृजेश पाठक",
      title: t.deputyCmTitle,
      party: "Deputy CM, UP",
      avatarBg: "from-orange-400 to-yellow-500",
      initial: "BP"
    },
    {
      name: "Shri Manoj Kumar Singh, IAS",
      name_hi: "श्री मनोज कुमार सिंह, IAS",
      title: t.csTitle,
      party: "Chief Secretary, UP",
      avatarBg: "from-blue-600 to-cyan-500",
      initial: "MS"
    }
  ];

  // Robust self-healing offline routing engine
  function resolveOfflineGrievance(formData) {
    const desc = (formData.description || "").toLowerCase();
    const title = (formData.problem_title || "").toLowerCase();
    const combined = `${desc} ${title}`;

    let department = "Other";
    let departmentHi = "अन्य विभाग";
    let officer = "Vikas Yadav";
    let sla = 48;

    // Direct keyword-based routing
    if (combined.includes("पानी") || combined.includes("water") || combined.includes("drinking")) {
      department = "Water Supply";
      departmentHi = "जल आपूर्ति विभाग";
      officer = "Amit Verma";
      sla = 6;
    } else if (combined.includes("बिजली") || combined.includes("light") || combined.includes("power") || combined.includes("electricity") || combined.includes("voltage")) {
      department = "Electricity";
      departmentHi = "विद्युत विभाग";
      officer = "Rakesh Singh";
      sla = 4;
    } else if (combined.includes("सड़क") || combined.includes("गड्ढा") || combined.includes("road") || combined.includes("pothole") || combined.includes("repair")) {
      department = "Road Repair";
      departmentHi = "सड़क मरम्मत विभाग";
      officer = "Neeraj Tiwari";
      sla = 24;
    } else if (combined.includes("सफाई") || combined.includes("कचरा") || combined.includes("garbage") || combined.includes("sewage") || combined.includes("drain") || combined.includes("clean") || combined.includes("sanitation")) {
      department = "Sanitation";
      departmentHi = "स्वच्छता विभाग";
      officer = "Pooja Mishra";
      sla = 12;
    } else if (combined.includes("पुलिस") || combined.includes("सुरक्षा") || combined.includes("police") || combined.includes("safety") || combined.includes("crime")) {
      department = "Public Safety";
      departmentHi = "जन सुरक्षा विभाग";
      officer = "Inspector Rajeev Sharma";
      sla = 3;
    } else if (combined.includes("महिला") || combined.includes("women") || combined.includes("girl") || combined.includes("suraksha")) {
      department = "Women Security";
      departmentHi = "महिला सुरक्षा एवं सहायता विभाग";
      officer = "Smt. Sushma Kharakwal";
      sla = 4;
    } else if (combined.includes("साइबर") || combined.includes("cyber") || combined.includes("hack") || combined.includes("fraud")) {
      department = "Cyber Crime";
      departmentHi = "साइबर अपराध विभाग";
      officer = "Ankit Srivastava";
      sla = 6;
    }

    // Emotion Urgency detection
    let urgency = "Concerned";
    let priority = 3;
    if (combined.includes("urgent") || combined.includes("emergency") || combined.includes("critical") || combined.includes("खतरा") || combined.includes("तुरंत") || combined.includes("!")) {
      urgency = "Critical";
      priority = 5;
    } else if (combined.includes("problem") || combined.includes("bad") || combined.includes("sad") || combined.includes("परेशानी") || combined.includes("खराब")) {
      urgency = "Distressed";
      priority = 4;
    }

    // Acknowledgment messages
    const acknowledgment = lang === "hi" 
      ? `प्रिय ${formData.citizen_name || "नागरिक"}, ${formData.problem_title || "समस्या"} से संबंधित आपकी शिकायत दर्ज कर ली गई है। इसे ${officer} (${departmentHi}) को सौंप दिया गया है। अनुमानित समाधान समय ${sla} घंटे है।`
      : `Dear ${formData.citizen_name || "Citizen"}, your complaint regarding "${formData.problem_title || "Problem"}" has been registered as ID JSA-${Date.now().toString().slice(-4)}. It has been routed to ${officer} (${department}). Predicted resolution SLA is ${sla} Hours.`;

    const newGrievance = {
      grievance_id: `JSA-${Date.now().toString().slice(-4)}`,
      citizen_name: formData.citizen_name || "Citizen",
      department: department,
      department_hi: departmentHi,
      assigned_officer: officer,
      priority: priority,
      urgency_label: urgency,
      predicted_sla_hours: sla,
      overload_flag: false,
      citizen_message: acknowledgment,
      status: "Assigned"
    };

    return newGrievance;
  }

  async function handleSubmission(formData) {
    try {
      setLoading(true);
      setPipelineActive(true);
      setGrievance(null);
      setSelectedHistoryItem(null);

      let resultGrievance = null;
      try {
        // Try submitting to API
        const response = await submitGrievance(formData);
        resultGrievance = response.data;
      } catch (apiError) {
        console.warn("Backend API unavailable. Triggering self-healing offline routing engine:", apiError);
        resultGrievance = resolveOfflineGrievance(formData);
      }

      // Simulate step-by-step multi-agent visual processing
      setTimeout(() => {
        setGrievance(resultGrievance);
        setLoading(false);
        setPipelineActive(false);

        // Update local storage history
        const savedGrievances = localStorage.getItem("local_grievances");
        const list = savedGrievances ? JSON.parse(savedGrievances) : [];
        const updatedList = [resultGrievance, ...list];
        localStorage.setItem("local_grievances", JSON.stringify(updatedList));
        setHistoryList(updatedList);
      }, 6000);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setPipelineActive(false);
      alert("Failed to process grievance");
    }
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-8">
      
      {/* Hero section with smooth animations */}
      <div className="mb-10 text-center md:text-left relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-orange-50/50 via-white to-amber-50/20 border border-orange-100/50 shadow-sm animate-fade-in">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tight leading-tight">
            {t.heroTitle}
            <span className="text-primary block md:inline md:ml-3 bg-gradient-to-r from-primary via-orange-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
              {t.heroTitleSpan}
            </span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-3xl text-base md:text-lg font-medium leading-relaxed">
            {t.heroSub}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main area: Complaint filing and real-time simulator */}
        <div className="lg:col-span-2 space-y-8">
          
          <ComplaintForm onSubmit={handleSubmission} />

          {/* Real-time AI Agent Pipeline Animation */}
          {pipelineActive && loading && (
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden animate-pulse">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-orange-500 to-amber-500 animate-shimmer" />
              <h3 className="text-lg font-black text-primary flex items-center gap-2 mb-4">
                <RefreshCw size={18} className="animate-spin" />
                {t.aiAgentOrchestration}
              </h3>
              <AgentPipeline currentStep={currentStep} steps={steps} />
            </div>
          )}

          {/* Output Outcome Card */}
          {grievance && !pipelineActive && (
            <div className="animate-fade-in space-y-3">
              <div className="bg-green-50/80 text-green-800 text-xs font-bold px-4 py-2.5 rounded-2xl border border-green-200 w-fit flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={16} className="text-green-600" />
                {t.simulationSuccess}
              </div>
              <GrievanceCard grievance={grievance} />
            </div>
          )}

          {/* Clicked History Item Detail Box */}
          {selectedHistoryItem && (
            <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 shadow-lg animate-fade-in space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                  <Info className="text-primary" size={20} />
                  {t.detailTitle} ({selectedHistoryItem.grievance_id})
                </h3>
                <button 
                  onClick={() => setSelectedHistoryItem(null)}
                  className="p-1 rounded-full hover:bg-gray-150 text-gray-400 hover:text-gray-700 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{t.department}</p>
                  <p className="text-gray-800 text-base mt-1">{lang === "hi" ? selectedHistoryItem.department_hi : selectedHistoryItem.department}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{t.assignedOfficer}</p>
                  <p className="text-gray-800 text-base mt-1">{selectedHistoryItem.assigned_officer}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{t.status}</p>
                  <span className={`inline-block px-3 py-1 mt-2.5 rounded-lg text-xs font-bold ${
                    selectedHistoryItem.status === "Resolved" 
                      ? "bg-green-100 text-green-800" 
                      : selectedHistoryItem.status === "In Progress" 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedHistoryItem.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{t.predictedSla}</p>
                  <p className="text-primary text-base mt-1 font-extrabold flex items-center gap-1">
                    <Clock size={16} />
                    {selectedHistoryItem.predicted_sla_hours} Hours
                  </p>
                </div>
              </div>

              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-400 uppercase tracking-wider font-semibold mb-1.5">{t.citizenAlert}</p>
                <p className="text-xs text-orange-850 font-bold leading-relaxed">
                  {selectedHistoryItem.citizen_message}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Area: UP Cabinet Leaders and Citizen Tracking History */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Cabinet Leaders Showcase Panel */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-orange-100 shadow-md">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="bg-orange-100 p-2.5 rounded-2xl text-primary">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-dark tracking-tight leading-tight">
                  {t.leaderCardTitle}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {t.leaderCardSub}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cabinetLeaders.map((leader, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-50 bg-gray-50/20 hover:bg-orange-50/30 hover:scale-[1.02] hover:border-orange-100 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${leader.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                    {leader.initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">
                      {lang === "hi" ? leader.name_hi : leader.name}
                    </h3>
                    <p className="text-xs text-primary font-bold mt-0.5">
                      {leader.title}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mt-0.5">
                      {leader.party}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen History and Tracking Tracker */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-orange-100 shadow-md">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="bg-orange-100 p-2.5 rounded-2xl text-primary">
                <History size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-dark tracking-tight leading-tight">
                  {t.historySectionTitle}
                </h2>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {t.trackerSub}
                </p>
              </div>
            </div>

            {historyList.length > 0 ? (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {historyList.map((item) => (
                  <div 
                    key={item.grievance_id}
                    onClick={() => {
                      setSelectedHistoryItem(item);
                      setGrievance(null);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-xs ${
                      selectedHistoryItem?.grievance_id === item.grievance_id 
                        ? "border-primary bg-orange-50/50 shadow-md"
                        : "border-gray-100 bg-white hover:border-primary/20 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-primary bg-orange-50 px-2.5 py-1 rounded-lg">
                        {item.grievance_id}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg font-bold ${
                        item.status === "Resolved" 
                          ? "bg-green-100 text-green-800" 
                          : item.status === "In Progress" 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="font-bold text-gray-800 line-clamp-1 mb-1">
                      {lang === "hi" ? item.department_hi : item.department}
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold mt-1">
                      <span>Officer: <strong className="text-gray-700">{item.assigned_officer}</strong></span>
                      <span className="text-primary font-bold uppercase hover:underline">{t.viewDetails} &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-6 leading-relaxed italic">
                {t.noHistory}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
