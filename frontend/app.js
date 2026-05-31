// Base Backend URL fallback (forces port 8000 if loaded under Live Server port 5500)
const BACKEND_URL = (window.location.port !== '8000') ? 'http://127.0.0.1:8000' : '';

// 14 Uttar Pradesh official state portals and municipal utilities database
const directoryItems = [
  {
    id: "samadhan",
    name_en: "CM Jansunwai Samadhan Portal",
    name_hi: "मुख्यमंत्री जनसुनवाई समाधान पोर्टल",
    gov_en: "UP State Government",
    gov_hi: "उत्तर प्रदेश सरकार",
    desc_en: "The centralized public grievance portal of Uttar Pradesh for direct appeals to the Chief Minister's office.",
    desc_hi: "मुख्यमंत्री कार्यालय में सीधे अपील के लिए उत्तर प्रदेश का केंद्रीकृत लोक शिकायत पोर्टल।",
    url: "https://jansunwai.up.nic.in/",
    keywords: "samadhan jansunwai grievance complaint appeal cm up samadhan मुख्यमंत्री जनसुनवाई समाधान"
  },
  {
    id: "upgov",
    name_en: "Uttar Pradesh Official Portal",
    name_hi: "उत्तर प्रदेश आधिकारिक पोर्टल",
    gov_en: "UP State Government",
    gov_hi: "उत्तर प्रदेश सरकार",
    desc_en: "The official state entry-point providing information about state administration, districts, and civic schemes.",
    desc_hi: "राज्य प्रशासन, जिलों और नागरिक योजनाओं के बारे में जानकारी प्रदान करने वाला आधिकारिक राज्य प्रवेश बिंदु।",
    url: "https://up.gov.in/",
    keywords: "up government official state gateway lucknow services उत्तर प्रदेश सरकार प्रशासन"
  },
  {
    id: "lnn",
    name_en: "Lucknow Nagar Nigam (LNN)",
    name_hi: "लखनऊ नगर निगम (LNN)",
    gov_en: "Lucknow Civic Body",
    gov_hi: "लखनऊ नागरिक निकाय",
    desc_en: "Municipal corporation of Lucknow governing city sanitation, solid waste, taxation, and localized civil works.",
    desc_hi: "शहर की स्वच्छता, ठोस कचरा, कराधान और स्थानीय नागरिक कार्यों को नियंत्रित करने वाला लखनऊ का नगर निगम।",
    url: "https://lmc.up.nic.in/",
    keywords: "lucknow nagar nigam municipal corporation lmc lnn ward sanitation लखनऊ नगर निगम स्वच्छता"
  },
  {
    id: "jalkal",
    name_en: "Jal Kal Vibhag Lucknow",
    name_hi: "जल कल विभाग लखनऊ",
    gov_en: "Lucknow Utility",
    gov_hi: "लखनऊ उपयोगिता विभाग",
    desc_en: "Specialized city organization managing water distribution networks, filtration plants, and sewer operations.",
    desc_hi: "जल वितरण नेटवर्क, जल शोधन संयंत्रों और सीवर संचालन का प्रबंधन करने वाला विशेष शहर संगठन।",
    url: "http://www.jalkalnnlko.org/",
    keywords: "jal kal water sewer supply drainage pipeline metro water जल कल विभाग पानी सीवर पाइपलाइन"
  },
  {
    id: "lesa",
    name_en: "LESA / MVVNL Electricity",
    name_hi: "लेसा / एमवीवीएनएल विद्युत",
    gov_en: "UP State Utility",
    gov_hi: "उत्तर प्रदेश विद्युत उपयोगिता",
    desc_en: "Lucknow Electricity Supply Administration, a subsidiary of MVVNL, regulating city grid lines and outages.",
    desc_hi: "मध्यांचल विद्युत वितरण निगम लिमिटेड की सहायक कंपनी, लखनऊ विद्युत आपूर्ति प्रशासन, जो ग्रिड और आउटेज को नियंत्रित करती है।",
    url: "https://www.mvvnl.in/",
    keywords: "lesa electricity power bill sparking transformer blackout mvvnl लेसा बिजली ट्रांसफार्मर आउटेज"
  },
  {
    id: "lda",
    name_en: "Lucknow Development Authority",
    name_hi: "लखनऊ विकास प्राधिकरण (LDA)",
    gov_en: "Lucknow Development",
    gov_hi: "लखनऊ विकास निकाय",
    desc_en: "Urban engineering agency responsible for metropolitan mapping, housing schemes, and encroachment checks.",
    desc_hi: "महानगरीय मानचित्रण, आवास योजनाओं और अतिक्रमण जांच के लिए जिम्मेदार शहरी इंजीनियरिंग एजेंसी।",
    url: "https://www.ldaonline.co.in/",
    keywords: "lda lucknow development authority planning map building registration लखनऊ विकास प्राधिकरण नक्शा"
  },
  {
    id: "uppolice",
    name_en: "Uttar Pradesh Police Force",
    name_hi: "उत्तर प्रदेश पुलिस बल",
    gov_en: "Public Safety",
    gov_hi: "जन सुरक्षा",
    desc_en: "State enforcement and police services for maintaining law and order, public safety, and tourist coordinates.",
    desc_hi: "कानून व्यवस्था, जन सुरक्षा और पर्यटन समन्वय बनाए रखने के लिए राज्य प्रवर्तन और पुलिस सेवाएं।",
    url: "https://uppolice.gov.in/",
    keywords: "up police lucknow police safety security threat crime emergency dial 112 उत्तर प्रदेश पुलिस सुरक्षा"
  },
  {
    id: "uphealth",
    name_en: "UP Health & Family Welfare",
    name_hi: "यूपी स्वास्थ्य एवं परिवार कल्याण",
    gov_en: "UP State Government",
    gov_hi: "उत्तर प्रदेश सरकार",
    desc_en: "Directorate of Medical Services, managing epidemic control, hospital registrations, and sanitary health checks.",
    desc_hi: "चिकित्सा सेवा निदेशालय, महामारी नियंत्रण, अस्पताल पंजीकरण और स्वच्छता स्वास्थ्य जांच का प्रबंधन करता है।",
    url: "http://uphealth.up.nic.in/",
    keywords: "up health family welfare hospital medical dengue mosquito malaria यूपी स्वास्थ्य चिकित्सा डेंगू मलेरिया"
  },
  {
    id: "uppwd",
    name_en: "UP Public Works Department (PWD)",
    name_hi: "उत्तर प्रदेश लोक निर्माण विभाग (PWD)",
    gov_en: "UP Road Infrastructure",
    gov_hi: "सड़क एवं मार्ग ढांचा",
    desc_en: "State agency responsible for designing, building, and maintaining major highways, public buildings, and state roads.",
    desc_hi: "प्रमुख राजमार्गों, सरकारी भवनों और राज्य की सड़कों के निर्माण और रखरखाव के लिए जिम्मेदार राज्य एजेंसी।",
    url: "https://uppwd.gov.in/",
    keywords: "pwd highway construction road maintenance state pwd लोक निर्माण विभाग लोक निर्माण राजमार्ग सड़क"
  },
  {
    id: "uprevenue",
    name_en: "UP Board of Revenue",
    name_hi: "उत्तर प्रदेश राजस्व परिषद",
    gov_en: "UP Land Administration",
    gov_hi: "भूमि एवं राजस्व प्रशासन",
    desc_en: "Apex judicial and administrative body for land records, property registry disputes, and revenue collections.",
    desc_hi: "भूमि अभिलेखों, संपत्ति रजिस्ट्री विवादों और राजस्व संग्रह के लिए सर्वोच्च न्यायिक और प्रशासनिक निकाय।",
    url: "https://bor.up.nic.in/",
    keywords: "revenue land registry records property dispute khatauni राजस्व परिषद भूमि खतौनी रजिस्ट्री"
  },
  {
    id: "upsrtc",
    name_en: "UP State Road Transport (UPSRTC)",
    name_hi: "उत्तर प्रदेश राज्य सड़क परिवहन (UPSRTC)",
    gov_en: "UP Public Transport",
    gov_hi: "सार्वजनिक परिवहन",
    desc_en: "Public passenger transport corporation operating long-distance buses and intercity routes across UP and adjoining states.",
    desc_hi: "लंबी दूरी की बसों और अंतरराज्यीय मार्गों का संचालन करने वाला सार्वजनिक यात्री परिवहन निगम।",
    url: "http://www.upsrtc.up.gov.in/",
    keywords: "upsrtc bus transport ticket booking travel intercity bus stand परिवहन बस सेवा टिकट बुकिंग"
  },
  {
    id: "uppcl",
    name_en: "UP Power Corporation Limited (UPPCL)",
    name_hi: "उत्तर प्रदेश पावर कॉरपोरेशन लिमिटेड (UPPCL)",
    gov_en: "UP Power Generation",
    gov_hi: "विद्युत उत्पादन एवं वितरण",
    desc_en: "Central state corporation coordinating planning, transmission, and billing management for electricity in Uttar Pradesh.",
    desc_hi: "उत्तर प्रदेश में विद्युत नियोजन, पारेषण और बिलिंग प्रबंधन का समन्वय करने वाला केंद्रीय राज्य निगम।",
    url: "https://www.upenergy.in/",
    keywords: "uppcl power grid energy electricity bill supply transmission पावर कॉरपोरेशन विद्युत ऊर्जा"
  },
  {
    id: "upjalnigam",
    name_en: "UP Jal Nigam",
    name_hi: "उत्तर प्रदेश जल निगम",
    gov_en: "UP Water Infrastructure",
    gov_hi: "जल ढांचा विकास",
    desc_en: "State body tasked with planning, execution, and quality control of drinking water and rural sewage systems.",
    desc_hi: "पेयजल और ग्रामीण सीवरेज प्रणालियों के नियोजन, निष्पादन और गुणवत्ता नियंत्रण के लिए जिम्मेदार राज्य निकाय।",
    url: "http://jn.upsdc.gov.in/",
    keywords: "jal nigam water infrastructure drinking water sewage project rural water जल निगम पेयजल परियोजना"
  },
  {
    id: "upurbandev",
    name_en: "UP Urban Development Department",
    name_hi: "उत्तर प्रदेश नगर विकास विभाग",
    gov_en: "UP Urban Schemes",
    gov_hi: "शहरी विकास एवं योजनाएं",
    desc_en: "State nodal department for Swachh Bharat urban missions, smart city plans, and civic authority coordination.",
    desc_hi: "स्वच्छ भारत शहरी मिशन, स्मार्ट सिटी योजनाओं और नागरिक प्राधिकरण समन्वय के लिए राज्य नोडल विभाग।",
    url: "http://urbandevelopment.up.nic.in/",
    keywords: "urban development smart city swachh bharat schemes municipality नगर विकास स्मार्ट सिटी"
  }
];

// Global variables
let activeTab = 'citizen';
let currentLang = 'en'; // default English
let grievancesData = [];
let departmentsData = [];
let sampleComplaints = [];
let isOTPVerified = false;
let sessionToken = null;

// Chart.js instances
let deptChartInstance = null;
let priorityChartInstance = null;

// Dual-Language Translation Dictionary
const translations = {
  en: {
    // Nav elements
    nav_citizen: "Citizen Portal",
    nav_officer: "Officer Panel",
    nav_directory: "UP Gov Directory",
    nav_analytics: "Analytics",
    sim_tick: "Sim Follow-up Tick",
    lang_btn: "हिंदी (Hindi)",
    
    // Global Header
    header_subtitle: "Autonomous Grievance Intelligence System • Lucknow Nagar Nigam",
    
    // Intake Portal
    intake_title: "File a Grievance",
    intake_subtitle: "Enter your official coordinates and submit details. SunwAI triages the issue natively.",
    lbl_citizen_name: "Citizen Name / आपका नाम *",
    lbl_citizen_mobile: "Mobile Number / मोबाइल नंबर *",
    lbl_citizen_otp: "Enter OTP / ओटीपी दर्ज करें *",
    lbl_citizen_address: "Full Address / पूरा पता *",
    lbl_citizen_district: "District / जिला *",
    lbl_citizen_pincode: "Pincode / पिनकोड *",
    lbl_select_dept: "Select Department / विभाग चुनें *",
    lbl_complaint_lang: "Language of Complaint / शिकायत की भाषा *",
    lbl_other_dept: "Specify Department Name / विभाग का नाम लिखें *",
    lbl_comp_desc: "Describe your complaint / समस्या का विस्तृत विवरण लिखें *",
    btn_process: "Process via AI Agents",
    agent_triage_title: "AI Multi-Agent Triage Pipeline",
    
    // Steps
    step1_name: "Agent 1: Intake & Normalization",
    step1_desc: "Detecting dialect and cleaning transcription noise...",
    step2_name: "Agent 2: Classification & Urgency",
    step2_desc: "Extracting category tone, priority score, and target SLA...",
    step3_name: "Agent 3: Routing & Load Balancer",
    step3_desc: "Scanning departmental stress levels to assign officer...",
    step4_name: "Agent 4: Vernacular Communication",
    step4_desc: "Crafting polite Lucknow-style Hindi update & briefing...",
    
    // Result card
    res_success: "Grievance Registered Successfully!",
    res_dept: "Assigned Department",
    res_officer: "Nodal Officer",
    res_prio: "Urgency & Priority",
    res_sla: "Resolution SLA Goal",
    res_sms_title: "Vernacular Citizen SMS Sendout (Hindi)",
    
    // Sandbox
    sandbox_title: "Sandbox Cases",
    sandbox_subtitle: "Click any complaint below to auto-fill the form coordinates for lightning-fast presentation demos.",
    
    // Officer Panel
    registry_title: "Unified Grievance Registry",
    registry_subtitle: "Internal municipal node panel for LNN commissioners and nodal officers.",
    lbl_dept_filter: "Department Filter:",
    th_ticket_id: "Ticket ID",
    th_details: "Citizen Info & Description",
    th_keywords: "Matched Keywords",
    th_priority: "Priority",
    th_sla: "SLA Clock",
    th_status: "Status",
    th_officer: "Assigned Officer",
    th_action: "Action",
    
    // Directory Panel
    dir_title: "Uttar Pradesh Government Directory",
    dir_subtitle: "Official directory and links to primary state portals and Lucknow civic bodies.",
    dir_search: "Search departments, portals, or official coordinates...",
    
    // Analytics
    anal_total: "Total Grievances",
    anal_resolved: "Resolved Tickets",
    anal_avg_sla: "Avg. SLA Target",
    anal_overload: "Overloaded Nodes",
    anal_dept_title: "Grievances by Department",
    anal_prio_title: "Urgency Priority Distribution",
    
    // Footer & Modal
    modal_title: "Grievance Deep-Dive",
    footer_text: "SunwAI Autonomous Agent Portal — Built at GDG Lucknow Agentic Premier League (APL) Qualifiers."
  },
  hi: {
    // Nav elements
    nav_citizen: "नागरिक पोर्टल",
    nav_officer: "अधिकारी पैनल",
    nav_directory: "यूपी सरकारी निर्देशिका",
    nav_analytics: "सटीक विश्लेषण",
    sim_tick: "बैकग्राउंड चक्र चलाएं",
    lang_btn: "English (अंग्रेजी)",
    
    // Global Header
    header_subtitle: "स्वायत्त शिकायत निवारण प्रणाली • लखनऊ नगर निगम",
    
    // Intake Portal
    intake_title: "शिकायत दर्ज करें",
    intake_subtitle: "अपने विवरण दर्ज करें। SunwAI एजेंट तुरंत कार्रवाई शुरू कर देंगे।",
    lbl_citizen_name: "नागरिक का नाम *",
    lbl_citizen_mobile: "मोबाइल नंबर *",
    lbl_citizen_otp: "ओटीपी दर्ज करें *",
    lbl_citizen_address: "पूरा पता *",
    lbl_citizen_district: "जिला चुनें *",
    lbl_citizen_pincode: "पिनकोड *",
    lbl_select_dept: "संबंधित विभाग *",
    lbl_complaint_lang: "शिकायत की भाषा *",
    lbl_other_dept: "विभाग का नाम निर्दिष्ट करें *",
    lbl_comp_desc: "अपनी समस्या का विस्तृत विवरण लिखें *",
    btn_process: "एआई एजेंटों द्वारा निवारण करें",
    agent_triage_title: "एआई मल्टी-एजेंट सॉर्टिंग पाइपलाइन",
    
    // Steps
    step1_name: "एजेंट 1: शिकायत स्वीकरण एवं शोधन",
    step1_desc: "भाषा का विश्लेषण एवं स्पेलिंग में सुधार चालू है...",
    step2_name: "एजेंट 2: श्रेणी निर्धारण एवं प्राथमिकता",
    step2_desc: "शिकायत की गंभीरता, प्राथमिकता (1-5) एवं समाधान अवधि गणना...",
    step3_name: "एजेंट 3: रूटिंग एवं कार्यभार संतुलन",
    step3_desc: "लखनऊ नगर निगम के विभाग भार की जांच एवं अधिकारी आवंटन...",
    step4_name: "एजेंट 4: नागरिक सूचना निर्माण",
    step4_desc: "लखनऊ शैली में शिष्ट हिंदी संदेश एवं अधिकारी निर्देश रचना...",
    
    // Result card
    res_success: "शिकायत सफलतापूर्वक दर्ज कर ली गई है!",
    res_dept: "आवंटित विभाग",
    res_officer: "मुख्य नोडल अधिकारी",
    res_prio: "तीव्रता एवं प्राथमिकता",
    res_sla: "निर्धारित समाधान अवधि",
    res_sms_title: "नागरिक को भेजा गया हिंदी संदेश (SMS)",
    
    // Sandbox
    sandbox_title: "डेमो शिकायत गैलरी",
    sandbox_subtitle: "किसी भी कार्ड पर क्लिक करके त्वरित रूप से शिकायत फॉर्म भरें। त्वरित डेमो हेतु उत्तम।",
    
    // Officer Panel
    registry_title: "एकीकृत जनसुनवाई पंजिका",
    registry_subtitle: "लखनऊ नगर निगम के आयुक्तों एवं नोडल अधिकारियों हेतु आंतरिक कमान केंद्र।",
    lbl_dept_filter: "विभाग द्वारा खोजें:",
    th_ticket_id: "शिकायत संख्या",
    th_details: "नागरिक विवरण एवं समस्या विवरण",
    th_keywords: "स्कैन किए गए कीवर्ड",
    th_priority: "प्राथमिकता",
    th_sla: "समाधान अवधि",
    th_status: "स्थिति",
    th_officer: "नोडल अधिकारी",
    th_action: "कार्रवाई",
    
    // Directory Panel
    dir_title: "उत्तर प्रदेश सरकार विभाग निर्देशिका",
    dir_subtitle: "मुख्य राजकीय विभागों, पोर्टल और लखनऊ नागरिक निकायों के आधिकारिक लिंक।",
    dir_search: "विभागों, पोर्टलों या आधिकारिक कड़ियों को खोजें...",
    
    // Analytics
    anal_total: "कुल शिकायतें",
    anal_resolved: "निवारित शिकायतें",
    anal_avg_sla: "औसत समाधान समय",
    anal_overload: "अतिभारित विभाग",
    anal_dept_title: "विभाग अनुसार कुल शिकायतें",
    anal_prio_title: "गंभीरता अनुसार प्राथमिकता आवंटन",
    
    // Footer & Modal
    modal_title: "शिकायत विस्तृत विवरण",
    footer_text: "सुनवाई (SunwAI) स्वायत्त एजेंट पोर्टल — जीडीजी लखनऊ एजेंटिक प्रीमियर लीग (APL) हेतु निर्मित।"
  }
};

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchInitialData();
  renderDirectory();
});

// Fetch all initial dataset matrices
async function fetchInitialData() {
  try {
    const deptRes = await fetch(`${BACKEND_URL}/api/departments`);
    departmentsData = await deptRes.json();
    
    const sampleRes = await fetch(`${BACKEND_URL}/api/sample-complaints`);
    sampleComplaints = await sampleRes.json();
    
    const grvRes = await fetch(`${BACKEND_URL}/api/grievances`);
    grievancesData = await grvRes.json();
    
    loadSampleComplaintsLibrary();
    loadGrievancesList();
    renderOverloadAlerts();
    updateAnalyticsKPIs();
    initCharts();
  } catch (error) {
    console.error('Error fetching baseline matrices:', error);
  }
}

// Toggle page translations (English <-> Hindi)
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  document.body.className = currentLang === 'en' ? 'lang-en' : 'lang-hi';
  applyTranslations();
}

// Translate all nodes
function applyTranslations() {
  const dict = translations[currentLang];
  
  // Navigation elements
  document.querySelector('.txt-nav-citizen').innerText = dict.nav_citizen;
  document.querySelector('.txt-nav-officer').innerText = dict.nav_officer;
  document.querySelector('.txt-nav-directory').innerText = dict.nav_directory;
  document.querySelector('.txt-nav-analytics').innerText = dict.nav_analytics;
  document.getElementById('txt-sim-tick').innerText = dict.sim_tick;
  document.getElementById('lang-btn-text').innerText = dict.lang_btn;
  
  // Header Info
  document.getElementById('header-subtitle').innerText = dict.header_subtitle;
  
  // Form Labels & Structure
  document.getElementById('intake-title').innerHTML = `<i class="fa-solid fa-pen-nib text-orange"></i> ${dict.intake_title}`;
  document.getElementById('intake-subtitle').innerText = dict.intake_subtitle;
  document.getElementById('lbl-citizen-name').innerText = dict.lbl_citizen_name;
  document.getElementById('lbl-citizen-mobile').innerText = dict.lbl_citizen_mobile;
  document.getElementById('lbl-citizen-otp').innerText = dict.lbl_citizen_otp;
  document.getElementById('lbl-citizen-address').innerText = dict.lbl_citizen_address;
  document.getElementById('lbl-citizen-district').innerText = dict.lbl_citizen_district;
  document.getElementById('lbl-citizen-pincode').innerText = dict.lbl_citizen_pincode;
  document.getElementById('lbl-select-dept').innerText = dict.lbl_select_dept;
  document.getElementById('lbl-complaint-lang').innerText = dict.lbl_complaint_lang;
  document.getElementById('lbl-other-dept').innerText = dict.lbl_other_dept;
  document.getElementById('lbl-comp-desc').innerText = dict.lbl_comp_desc;
  document.getElementById('txt-submit-btn').innerText = dict.btn_process;
  
  // Sequential Agent Steps Names
  document.getElementById('txt-agent-triage-title').innerHTML = `<i class="fa-solid fa-network-wired spinner-icon"></i> ${dict.agent_triage_title}`;
  document.querySelector('.txt-step1-name').innerText = dict.step1_name;
  document.querySelector('.txt-step1-desc').innerText = dict.step1_desc;
  document.querySelector('.txt-step2-name').innerText = dict.step2_name;
  document.querySelector('.txt-step2-desc').innerText = dict.step2_desc;
  document.querySelector('.txt-step3-name').innerText = dict.step3_name;
  document.querySelector('.txt-step3-desc').innerText = dict.step3_desc;
  document.querySelector('.txt-step4-name').innerText = dict.step4_name;
  document.querySelector('.txt-step4-desc').innerText = dict.step4_desc;
  
  // Result Display Translations
  document.getElementById('txt-success-h4').innerText = dict.res_success;
  document.getElementById('lbl-res-dept').innerText = dict.res_dept;
  document.getElementById('lbl-res-officer').innerText = dict.res_officer;
  document.getElementById('lbl-res-prio').innerText = dict.res_prio;
  document.getElementById('lbl-res-sla').innerText = dict.res_sla;
  document.getElementById('lbl-res-sms-title').innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> ${dict.res_sms_title}`;
  
  // Sandbox Sidebar
  document.getElementById('sandbox-title').innerHTML = `<i class="fa-solid fa-folder-open text-blue"></i> ${dict.sandbox_title}`;
  document.getElementById('sandbox-subtitle').innerText = dict.sandbox_subtitle;
  
  // Registry Table headers
  document.getElementById('registry-title').innerHTML = `<i class="fa-solid fa-shield-halved text-orange"></i> ${dict.registry_title}`;
  document.getElementById('registry-subtitle').innerText = dict.registry_subtitle;
  document.getElementById('lbl-dept-filter').innerHTML = `<i class="fa-solid fa-filter"></i> ${dict.lbl_dept_filter}`;
  
  document.getElementById('th-ticket-id').innerText = dict.th_ticket_id;
  document.getElementById('th-details').innerText = dict.th_details;
  document.getElementById('th-keywords').innerText = dict.th_keywords;
  document.getElementById('th-priority').innerText = dict.th_priority;
  document.getElementById('th-sla').innerText = dict.th_sla;
  document.getElementById('th-status').innerText = dict.th_status;
  document.getElementById('th-officer').innerText = dict.th_officer;
  document.getElementById('th-action').innerText = dict.th_action;
  
  // Directory Tab
  document.getElementById('dir-title').innerHTML = `<i class="fa-solid fa-building-columns text-orange"></i> ${dict.dir_title}`;
  document.getElementById('dir-subtitle').innerText = dict.dir_subtitle;
  document.getElementById('directory-search').placeholder = dict.dir_search;
  
  // Analytics
  document.querySelector('.id-total-lbl').innerText = dict.anal_total;
  document.querySelector('.id-resolved-lbl').innerText = dict.anal_resolved;
  document.querySelector('.id-avg-sla-lbl').innerText = dict.anal_avg_sla;
  document.querySelector('.id-overload-lbl').innerText = dict.anal_overload;
  document.getElementById('anal-dept-title').innerText = dict.anal_dept_title;
  document.getElementById('anal-prio-title').innerText = dict.anal_prio_title;
  
  // Footer & Modal
  document.getElementById('txt-footer-tag').innerText = dict.footer_text;
  document.getElementById('modal-heading-text').innerText = dict.modal_title;
  
  // Re-load table dynamic contents
  loadGrievancesList();
  renderDirectory();
}

// Show/Hide slide-down manual department name text field
function toggleOtherDeptField() {
  const deptSelect = document.getElementById('selected-department');
  const otherGroup = document.getElementById('other-department-group');
  
  if (deptSelect.value === 'other') {
    otherGroup.style.display = 'flex';
  } else {
    otherGroup.style.display = 'none';
  }
}

// Tab navigation handler
function switchTab(tabName) {
  activeTab = tabName;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`tab-${tabName}`).classList.add('active');
  
  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`section-${tabName}`).classList.add('active');
  
  if (tabName === 'officer') {
    loadGrievancesList();
    renderOverloadAlerts();
  } else if (tabName === 'directory') {
    filterDirectory();
  } else if (tabName === 'analytics') {
    updateAnalyticsKPIs();
    refreshCharts();
  }
}

// Load Sandbox Cases Side-Deck
function loadSampleComplaintsLibrary() {
  const container = document.getElementById('sample-complaints-box');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (sampleComplaints.length === 0) {
    container.innerHTML = '<p class="text-muted">No sandbox cases loaded.</p>';
    return;
  }
  
  sampleComplaints.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'sample-card';
    card.onclick = () => {
      // Auto-fill full coordinates dynamically to make demo beautiful and swift
      const names = ["Rajesh Kumar Mishra", "Smt. Sunita Sharma", "Shri Alok Dwivedi", "Preeti Verma", "Vikas Singh Chaudhary", "Dr. Manoj Pandey"];
      const mobiles = ["9415123456", "9935102030", "9839456789", "8090554433", "7007123987", "9140987654"];
      const districts = ["Lucknow", "Kanpur", "Prayagraj", "Varanasi", "Gorakhpur", "Noida", "Ayodhya"];
      const pincodes = ["226001", "208002", "211003", "221005", "273001", "201301", "224123"];
      
      const addresses = [
        "Flat 101, Gomti Nagar Phase 2",
        "House 45, Civil Lines",
        "Block C, Sector 42",
        "12/A, Near Sankat Mochan",
        "Villa 3, Gorakhnath Road",
        "Tower B, Tech Park",
        "Street 5, Ram Janmabhoomi Marg"
      ];
      
      document.getElementById('citizen-name').value = names[idx % names.length];
      document.getElementById('citizen-mobile').value = mobiles[idx % mobiles.length];
      document.getElementById('citizen-address').value = addresses[idx % addresses.length];
      document.getElementById('citizen-district').value = districts[idx % districts.length];
      document.getElementById('citizen-pincode').value = pincodes[idx % pincodes.length];
      document.getElementById('selected-department').value = item.category || 'auto';
      document.getElementById('complaint-text').value = item.text;
      
      // Auto-verify OTP for seamless demos
      isOTPVerified = true;
      document.getElementById('otp-group').style.display = 'block';
      document.getElementById('citizen-otp').value = "123456";
      document.getElementById('citizen-mobile').disabled = true;
      document.getElementById('citizen-otp').disabled = true;
      const verifyBtn = document.getElementById('btn-verify-otp');
      if(verifyBtn) verifyBtn.style.display = 'none';
      const statusMsg = document.getElementById('otp-status-msg');
      if(statusMsg) statusMsg.style.display = 'block';
      
      toggleOtherDeptField();
    };
    
    let icon = 'fa-circle-question';
    if (item.category === 'pothole_road') icon = 'fa-road';
    if (item.category === 'water_supply') icon = 'fa-faucet-drip';
    if (item.category === 'electricity') icon = 'fa-bolt';
    if (item.category === 'sanitation_waste') icon = 'fa-trash-can';
    if (item.category === 'encroachment') icon = 'fa-building-shield';
    if (item.category === 'health_hospital') icon = 'fa-hand-holding-medical';
    if (item.category === 'property_tax') icon = 'fa-file-invoice-dollar';
    if (item.category === 'public_safety') icon = 'fa-shield-halved';
    
    card.innerHTML = `
      <div class="sample-meta">
        <span class="text-orange" style="font-weight:600;"><i class="fa-solid ${icon}"></i> ${formatDeptName(item.category)}</span>
        <span class="lang-pill">${item.language}</span>
      </div>
      <p class="sample-text">${item.text}</p>
    `;
    container.appendChild(card);
  });
}

// OTP Generation logic
async function requestOTP() {
  const mobile = document.getElementById('citizen-mobile').value.trim();
  if (!mobile || mobile.length !== 10) {
    alert(currentLang === 'en' ? 'Please enter a valid 10-digit mobile number first.' : 'कृपया पहले एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।');
    return;
  }
  
  const btn = document.getElementById('btn-send-otp');
  btn.disabled = true;
  btn.innerText = currentLang === 'en' ? 'Sending...' : 'भेज रहे हैं...';
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/otp/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    
    if (res.ok) {
      document.getElementById('otp-group').style.display = 'block';
      btn.innerText = currentLang === 'en' ? 'OTP Sent' : 'ओटीपी भेजा गया';
    } else {
      throw new Error('OTP generation failed or rate limited.');
    }
  } catch (error) {
    alert(currentLang === 'en' ? 'Failed to send OTP. Please try again later.' : 'ओटीपी भेजने में विफल। कृपया बाद में प्रयास करें।');
    btn.disabled = false;
    btn.innerText = currentLang === 'en' ? 'Send OTP' : 'ओटीपी भेजें';
  }
}

async function verifyOTP() {
  const mobile = document.getElementById('citizen-mobile').value.trim();
  const otp = document.getElementById('citizen-otp').value.trim();
  
  if (!otp || otp.length < 4) return;
  
  const btn = document.getElementById('btn-verify-otp');
  btn.disabled = true;
  btn.innerText = currentLang === 'en' ? 'Verifying...' : 'सत्यापित कर रहे हैं...';
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    
    if (res.ok) {
      const data = await res.json();
      sessionToken = data.token;
      isOTPVerified = true;
      document.getElementById('citizen-mobile').disabled = true;
      document.getElementById('citizen-otp').disabled = true;
      btn.style.display = 'none';
      document.getElementById('otp-status-msg').style.display = 'block';
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    alert(currentLang === 'en' ? 'Invalid OTP. Please try again.' : 'अमान्य ओटीपी। कृपया पुनः प्रयास करें।');
    btn.disabled = false;
    btn.innerText = 'Verify';
  }
}

// POST complaint details with step delay agentic checks
async function submitComplaint() {
  const citizenName = document.getElementById('citizen-name').value.trim();
  const citizenMobile = document.getElementById('citizen-mobile').value.trim();
  const address = document.getElementById('citizen-address').value.trim();
  const district = document.getElementById('citizen-district').value;
  const pincode = document.getElementById('citizen-pincode').value.trim();
  const selectedDept = document.getElementById('selected-department').value;
  const complaintLang = document.getElementById('complaint-language').value;
  const otherDept = document.getElementById('other-department').value.trim();
  const complaintText = document.getElementById('complaint-text').value.trim();
  
  // Validation checks
  if (!citizenName || !citizenMobile || !pincode || !complaintText || !address) {
    alert(currentLang === 'en' ? 'Please fill in all required fields (*) before processing!' : 'कृपया प्रसंस्करण से पहले सभी आवश्यक फ़ील्ड (*) भरें!');
    return;
  }
  
  if (!isOTPVerified) {
    alert(currentLang === 'en' ? 'Please generate and verify OTP first.' : 'कृपया पहले ओटीपी जनरेट करें और सत्यापित करें।');
    return;
  }
  
  if (selectedDept === 'other' && !otherDept) {
    alert(currentLang === 'en' ? 'Please specify other department name!' : 'कृपया अन्य विभाग का नाम लिखें!');
    return;
  }
  
  const submitBtn = document.getElementById('submit-btn');
  const orchestrator = document.getElementById('agent-orchestrator');
  const successCard = document.getElementById('grievance-result');
  
  successCard.style.display = 'none';
  orchestrator.style.display = 'block';
  submitBtn.disabled = true;
  
  // Rate-limiting visual cue
  const originalBtnText = document.getElementById('txt-submit-btn').innerText;
  document.getElementById('txt-submit-btn').innerText = currentLang === 'en' ? 'Please wait... Processing securely' : 'कृपया प्रतीक्षा करें... सुरक्षित प्रसंस्करण जारी';
  
  const steps = [
    { id: 'step-intake' },
    { id: 'step-classify' },
    { id: 'step-route' },
    { id: 'step-comm' }
  ];
  
  steps.forEach(s => {
    const el = document.getElementById(s.id);
    el.className = 'agent-step';
    el.querySelector('.step-bullet').innerHTML = '<i class="fa-regular fa-circle"></i>';
  });
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/grievance/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        citizen_name: citizenName,
        citizen_mobile: citizenMobile,
        district: district,
        pincode: pincode,
        selected_department: selectedDept,
        other_department: otherDept,
        raw_text: complaintText + "\n[Address: " + address + "]",
        complaint_language: complaintLang,
        otp_verified: isOTPVerified
      })
    });
    
    if (!response.ok) throw new Error('Orchestration Node Failure.');
    
    const result = await response.json();
    
    // Animate sequential checklist with visual pace delays (600ms)
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const el = document.getElementById(step.id);
      
      el.classList.add('active');
      el.querySelector('.step-bullet').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin spinner-icon"></i>';
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      el.classList.remove('active');
      el.classList.add('completed');
      el.querySelector('.step-bullet').innerHTML = '<i class="fa-solid fa-circle-check text-green"></i>';
    }
    
    setTimeout(() => {
      orchestrator.style.display = 'none';
      submitBtn.disabled = false;
      document.getElementById('txt-submit-btn').innerText = originalBtnText;
      
      // Clean intake form
      document.getElementById('citizen-name').value = '';
      document.getElementById('citizen-mobile').value = '';
      document.getElementById('citizen-pincode').value = '';
      document.getElementById('citizen-address').value = '';
      document.getElementById('other-department').value = '';
      document.getElementById('complaint-text').value = '';
      document.getElementById('selected-department').value = 'auto';
      document.getElementById('complaint-language').value = 'auto';
      
      // Reset OTP states
      document.getElementById('citizen-otp').value = '';
      document.getElementById('otp-group').style.display = 'none';
      document.getElementById('citizen-mobile').disabled = false;
      document.getElementById('citizen-otp').disabled = false;
      document.getElementById('btn-send-otp').disabled = false;
      document.getElementById('btn-send-otp').innerText = currentLang === 'en' ? 'Send OTP' : 'ओटीपी भेजें';
      document.getElementById('btn-verify-otp').style.display = 'inline-block';
      document.getElementById('btn-verify-otp').disabled = false;
      document.getElementById('btn-verify-otp').innerText = 'Verify';
      document.getElementById('otp-status-msg').style.display = 'none';
      isOTPVerified = false;
      sessionToken = null;
      
      toggleOtherDeptField();
      
      // Set results values
      document.getElementById('result-ticket-id').innerText = result.id;
      document.getElementById('result-dept').innerText = currentLang === 'en' ? formatDeptName(result.category) : result.department_name_hi;
      document.getElementById('result-officer').innerText = result.assigned_officer;
      document.getElementById('result-priority').innerHTML = `
        <span class="prio-pill prio-${result.priority}">Priority ${result.priority} (${capitalize(result.urgency_label)})</span>
      `;
      document.getElementById('result-sla').innerText = `${result.predicted_sla_hours} ${currentLang === 'en' ? 'Hours' : 'घंटे'}`;
      document.getElementById('result-sms').innerText = result.citizen_sms_hi;
      
      // Render Credibility Index
      if (result.credibility_index !== undefined) {
        document.getElementById('credibility-container').style.display = 'block';
        
        let color = '#ef4444'; // Red for low
        let label = 'Low (Manual Review)';
        let check = '';
        
        if (result.credibility_level === 'medium') {
          color = '#f59e0b'; // Orange
          label = 'Medium (Standard)';
        } else if (result.credibility_level === 'high') {
          color = '#3b82f6'; // Blue
          label = 'High (Priority)';
          check = '✓';
        } else if (result.credibility_level === 'verified') {
          color = '#10b981'; // Green
          label = 'Verified (Fast-track)';
          check = '✓';
        }
        
        document.getElementById('result-credibility-text').innerHTML = `${result.credibility_index}/100 ${check} ${label}`;
        document.getElementById('result-credibility-text').style.color = color;
        
        // Slight delay for animation
        setTimeout(() => {
          document.getElementById('result-credibility-bar').style.width = `${result.credibility_index}%`;
          document.getElementById('result-credibility-bar').style.background = `linear-gradient(90deg, #3b82f6, ${color})`;
        }, 100);
      } else {
        document.getElementById('credibility-container').style.display = 'none';
      }
      
      // Render dynamic bilingual keyword tags if present in response
      const keywordsContainer = document.getElementById('result-keywords-container');
      const keywordsList = document.getElementById('result-keywords-list');
      if (keywordsContainer && keywordsList) {
        keywordsList.innerHTML = '';
        if (result.matched_keywords && result.matched_keywords.length > 0) {
          result.matched_keywords.forEach(kw => {
            const badge = document.createElement('span');
            badge.className = 'kw-badge';
            badge.innerText = kw;
            keywordsList.appendChild(badge);
          });
          keywordsContainer.style.display = 'block';
        } else {
          keywordsContainer.style.display = 'none';
        }
      }
      
      successCard.style.display = 'block';
      fetchInitialData();
    }, 350);
    
  } catch (error) {
    alert('Agent processing failed. Verify server bindings.');
    submitBtn.disabled = false;
    document.getElementById('txt-submit-btn').innerText = originalBtnText;
    orchestrator.style.display = 'none';
  }
}

// Render dynamic Registry Table feeds
function loadGrievancesList() {
  const tbody = document.getElementById('grievances-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  const filter = document.getElementById('dept-filter').value;
  
  const filtered = grievancesData.filter(g => {
    if (filter === 'all') return true;
    return g.category === filter;
  });
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align:center; padding: 2.2rem;">${currentLang === 'en' ? 'No active grievances registered.' : 'कोई सक्रिय शिकायतें दर्ज नहीं हैं।'}</td></tr>`;
    return;
  }
  
  filtered.forEach(g => {
    const tr = document.createElement('tr');
    
    // Priority badge
    const priorityBadge = `<span class="prio-pill prio-${g.priority}">P-${g.priority} ${capitalize(g.urgency)}</span>`;
    
    // Status badges
    let statusClass = 'status-assigned';
    let statusText = currentLang === 'en' ? 'Assigned' : 'आवंटित';
    if (g.status === 'in_progress') {
      statusClass = 'status-progress';
      statusText = currentLang === 'en' ? 'In Progress' : 'कार्य प्रगति पर';
    } else if (g.status === 'resolved') {
      statusClass = 'status-resolved';
      statusText = currentLang === 'en' ? 'Resolved' : 'निस्तारित';
    }
    
    let statusBadge = `<span class="status-badge ${statusClass}"><i class="fa-solid fa-circle-dot"></i> ${statusText}</span>`;
    if (g.escalated) {
      statusBadge += `<br><span class="escalated-badge"><i class="fa-solid fa-triangle-exclamation"></i> ${currentLang === 'en' ? 'Escalated' : 'उच्च प्रेषित'}</span>`;
    }
    
    // Manual resolution trigger
    let actionCol = '';
    if (g.status !== 'resolved') {
      actionCol = `<button class="action-btn-sm" onclick="manuallyResolve('${g.id}')"><i class="fa-solid fa-circle-check"></i> ${currentLang === 'en' ? 'Resolve' : 'निस्तारण'}</button>`;
    } else {
      actionCol = `<span class="text-green"><i class="fa-solid fa-check-double"></i> ${currentLang === 'en' ? 'Complete' : 'सफल निस्तारण'}</span>`;
    }
    
    const summary = g.normalized_text.length > 55 ? g.normalized_text.substring(0, 52) + '...' : g.normalized_text;
    
    // Citizen detail line (renders name and pincode coordinates directly in grid row)
    const citizenMeta = `${g.citizen_name || 'Citizen'} (${g.district || 'Lko'} - ${g.pincode || '226XXX'})`;
    
    // Matched keywords rendering
    const keywordsHTML = (g.matched_keywords && g.matched_keywords.length > 0)
      ? g.matched_keywords.map(kw => `<span class="kw-badge" style="font-size:0.75rem; margin:0.1rem; display:inline-block; padding:0.15rem 0.4rem; border-radius:4px; background:rgba(249,115,22,0.15); border:1px solid rgba(249,115,22,0.3); color:var(--primary-saffron);">${kw}</span>`).join('')
      : `<span class="text-muted" style="font-size: 0.8rem;">-</span>`;
      
    tr.innerHTML = `
      <td><span class="ticket-id-badge" onclick="openGrievanceModal('${g.id}')">${g.id}</span></td>
      <td>
        <span class="table-dept-tag">${currentLang === 'en' ? formatDeptName(g.category) : g.department_name_hi}</span>
        <div class="table-citizen-meta"><i class="fa-solid fa-user text-muted"></i> ${citizenMeta}</div>
        <p class="table-text-synopsis" title="${g.normalized_text}">${summary}</p>
      </td>
      <td>
        <div style="max-width: 180px; display: flex; flex-wrap: wrap; gap: 0.2rem;">
          ${keywordsHTML}
        </div>
      </td>
      <td>${priorityBadge}</td>
      <td><strong>${g.predicted_sla_hours} ${currentLang === 'en' ? 'hrs' : 'घंटे'}</strong></td>
      <td>${statusBadge}</td>
      <td><i class="fa-solid fa-user-tie text-gray"></i> ${g.assigned_officer}</td>
      <td>${actionCol}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Search and live filter primary UP Government Directory links
function filterDirectory() {
  const searchInput = document.getElementById('directory-search').value.toLowerCase();
  const items = document.querySelectorAll('.dir-item-card');
  
  items.forEach(card => {
    const keywords = card.getAttribute('data-keywords').toLowerCase();
    const heading = card.querySelector('h3').innerText.toLowerCase();
    const desc = card.querySelector('p').innerText.toLowerCase();
    
    if (keywords.includes(searchInput) || heading.includes(searchInput) || desc.includes(searchInput)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Alerts Node capacity warning bars
function renderOverloadAlerts() {
  const container = document.getElementById('overload-alerts-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  departmentsData.forEach(dept => {
    const ratio = dept.open_tickets / dept.max_capacity;
    if (ratio >= 0.8) {
      const banner = document.createElement('div');
      banner.className = 'overload-banner';
      banner.innerHTML = `
        <div class="overload-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="overload-info">
          <h4>SYSTEM CRITICAL: ${dept.name_en.toUpperCase()} OVERLOAD WARNING!</h4>
          <p>Active workload at ${dept.open_tickets}/${dept.max_capacity} capacity levels. Secondary complaints are automatically flagged for commissioner audit checks.</p>
        </div>
      `;
      container.appendChild(banner);
    }
  });
}

// Resolve ticket node
async function manuallyResolve(ticketId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/grievance/${ticketId}/resolve`, { method: 'POST' });
    if (res.ok) fetchInitialData();
  } catch (err) {
    console.error('Manual resolve error:', err);
  }
}

// Simulated Follow-up ticker tick dispatches
async function triggerSimulationTick() {
  const simBtn = document.getElementById('sim-ticker-btn');
  simBtn.disabled = true;
  simBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/simulate-followup`, { method: 'POST' });
    if (res.ok) {
      setTimeout(async () => {
        await fetchInitialData();
        simBtn.disabled = false;
        simBtn.querySelector('i').className = 'fa-solid fa-rotate';
      }, 650);
    }
  } catch (err) {
    simBtn.disabled = false;
    simBtn.querySelector('i').className = 'fa-solid fa-rotate';
  }
}

// KPIs math updates
function updateAnalyticsKPIs() {
  const total = grievancesData.length;
  const resolved = grievancesData.filter(g => g.status === 'resolved').length;
  
  let sumSla = 0;
  grievancesData.forEach(g => sumSla += g.predicted_sla_hours);
  const avgSla = total > 0 ? Math.round(sumSla / total) : 24;
  
  let overloadedDepts = 0;
  departmentsData.forEach(d => {
    if (d.open_tickets >= d.max_capacity * 0.8) overloadedDepts++;
  });
  
  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-resolved').innerText = resolved;
  document.getElementById('stat-sla').innerText = `${avgSla}h`;
  document.getElementById('stat-overloaded').innerText = overloadedDepts;
}

// Grievance Deep dive info popup
function openGrievanceModal(ticketId) {
  const item = grievancesData.find(g => g.id === ticketId);
  if (!item) return;
  
  const content = document.getElementById('modal-content-area');
  
  let historyLines = '';
  if (item.history) {
    item.history.forEach(h => {
      const formattedTime = new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      historyLines += `
        <div class="timeline-item">
          <span class="timeline-bullet"><i class="fa-solid fa-circle-check"></i></span>
          <div class="timeline-info">
            <span class="timeline-note">${h.note}</span>
            <span class="timeline-time">${formattedTime}</span>
          </div>
        </div>
      `;
    });
  }
  
  const dict = translations[currentLang];
  
  content.innerHTML = `
    <div class="results-grid">
      <div class="result-item">
        <span class="modal-title">Grievance Ticket ID</span>
        <span class="result-val text-orange" style="font-weight: 800;">${item.id}</span>
      </div>
      <div class="result-item">
        <span class="modal-title">Citizen coordinates</span>
        <span class="result-val">${item.citizen_name || 'Anonymous'} (${item.citizen_mobile || 'N/A'})</span>
      </div>
      <div class="result-item">
        <span class="result-label">${dict.lbl_citizen_district}</span>
        <span class="result-val">${item.district || 'Lucknow'} (PIN: ${item.pincode || '226001'})</span>
      </div>
      <div class="result-item">
        <span class="result-label">${dict.res_dept}</span>
        <span class="result-val">${currentLang === 'en' ? formatDeptName(item.category) : item.department_name_hi}</span>
      </div>
    </div>
    
    <div class="modal-section">
      <span class="modal-title">Original Grievance Text / मूल शिकायत पत्र</span>
      <p class="modal-desc">"${item.raw_text}"</p>
    </div>

    <div class="modal-section">
      <span class="modal-title">Detected Bilingual Keywords / स्कैन किए गए कीवर्ड</span>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem;">
        ${item.matched_keywords && item.matched_keywords.length > 0 
          ? item.matched_keywords.map(kw => `<span class="kw-badge">${kw}</span>`).join('') 
          : `<span class="text-muted" style="font-size: 0.85rem;">No direct keyword matches found. Auto-classified using NLP.</span>`}
      </div>
    </div>
    
    <div class="modal-section">
      <span class="modal-title">Internal Officer Briefing (English)</span>
      <p class="modal-desc" style="white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; background: #000; color: #10b981; border: 1px solid rgba(16,185,129,0.2);">${item.officer_note_en}</p>
    </div>

    <div class="modal-section">
      <span class="modal-title">Vernacular Citizen Notification (Hindi)</span>
      <p class="modal-desc" style="border-left: 3px solid var(--primary-saffron); font-size: 0.88rem; background: rgba(255, 107, 0, 0.03);">${item.citizen_sms_hi}</p>
    </div>
    
    <div class="modal-section">
      <span class="modal-title">Agentic Workflow Audit Trail</span>
      <div class="timeline">
        ${historyLines}
      </div>
    </div>
  `;
  
  document.getElementById('grievance-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('grievance-modal').style.display = 'none';
}

// Chart.js renderers
function initCharts() {
  if (typeof Chart === 'undefined') return;
  
  const ctx1 = document.getElementById('deptChart');
  const ctx2 = document.getElementById('priorityChart');
  
  if (!ctx1 || !ctx2) return;
  
  const deptLabels = [];
  const deptCounts = [];
  
  departmentsData.forEach(d => {
    deptLabels.push(currentLang === 'en' ? formatDeptName(d.id) : d.name_hi.split(' ')[0]);
    deptCounts.push(d.open_tickets);
  });
  
  const prioBuckets = { 'P-5': 0, 'P-4': 0, 'P-3': 0, 'P-2': 0, 'P-1': 0 };
  grievancesData.forEach(g => {
    prioBuckets[`P-${g.priority}`] = (prioBuckets[`P-${g.priority}`] || 0) + 1;
  });
  
  deptChartInstance = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: deptLabels,
      datasets: [{
        label: currentLang === 'en' ? 'Open Grievances' : 'सक्रिय शिकायतें',
        data: deptCounts,
        backgroundColor: 'rgba(255, 107, 0, 0.65)',
        borderColor: 'rgba(255, 107, 0, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
        x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  priorityChartInstance = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(prioBuckets),
      datasets: [{
        data: Object.values(prioBuckets),
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6b7280'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#9ca3af', font: { family: 'Inter' } }
        }
      }
    }
  });
}

function refreshCharts() {
  if (!deptChartInstance || !priorityChartInstance) return;
  
  const deptCounts = [];
  const deptLabels = [];
  departmentsData.forEach(d => {
    deptLabels.push(currentLang === 'en' ? formatDeptName(d.id) : d.name_hi.split(' ')[0]);
    deptCounts.push(d.open_tickets);
  });
  
  deptChartInstance.data.labels = deptLabels;
  deptChartInstance.data.datasets[0].data = deptCounts;
  deptChartInstance.data.datasets[0].label = currentLang === 'en' ? 'Open Grievances' : 'सक्रिय शिकायतें';
  deptChartInstance.update();
  
  const prioBuckets = { 'P-5': 0, 'P-4': 0, 'P-3': 0, 'P-2': 0, 'P-1': 0 };
  grievancesData.forEach(g => {
    prioBuckets[`P-${g.priority}`] = (prioBuckets[`P-${g.priority}`] || 0) + 1;
  });
  priorityChartInstance.data.datasets[0].data = Object.values(prioBuckets);
  priorityChartInstance.update();
}

// Helpers
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDeptName(slug) {
  const map = {
    'pothole_road': 'Road Repair',
    'water_supply': 'Water (Jal Kal)',
    'electricity': 'LESA Electricity',
    'sanitation_waste': 'Sanitation',
    'encroachment': 'Encroachment',
    'health_hospital': 'Health Dept',
    'property_tax': 'Property Tax',
    'public_safety': 'Public Safety'
  };
  return map[slug] || slug;
}

// Dynamically render the 14 Uttar Pradesh Government directory items (Bilingual)
function renderDirectory() {
  const container = document.getElementById('directory-items-box');
  if (!container) return;
  
  container.innerHTML = '';
  
  directoryItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'dir-item-card glass-card-sub';
    card.setAttribute('data-keywords', item.keywords);
    
    const name = currentLang === 'en' ? item.name_en : item.name_hi;
    const gov = currentLang === 'en' ? item.gov_en : item.gov_hi;
    const desc = currentLang === 'en' ? item.desc_en : item.desc_hi;
    const linkText = currentLang === 'en' ? 'Visit Official Site' : 'आधिकारिक साइट पर जाएं';
    
    let icon = 'fa-building-columns';
    if (item.id === 'samadhan') icon = 'fa-comments';
    if (item.id === 'upgov') icon = 'fa-building';
    if (item.id === 'lnn') icon = 'fa-tree-city';
    if (item.id === 'jalkal' || item.id === 'upjalnigam') icon = 'fa-faucet-drip';
    if (item.id === 'lesa' || item.id === 'uppcl') icon = 'fa-bolt';
    if (item.id === 'lda') icon = 'fa-compass-drafting';
    if (item.id === 'uppolice') icon = 'fa-shield-halved';
    if (item.id === 'uphealth') icon = 'fa-hand-holding-medical';
    if (item.id === 'uppwd') icon = 'fa-road';
    if (item.id === 'uprevenue') icon = 'fa-file-invoice';
    if (item.id === 'upsrtc') icon = 'fa-bus';
    if (item.id === 'upurbandev') icon = 'fa-city';
    
    card.innerHTML = `
      <div class="dir-header">
        <span class="dir-icon"><i class="fa-solid ${icon}"></i></span>
        <div>
          <h3 style="font-size: 0.98rem; font-weight: 700;">${name}</h3>
          <span class="dir-gov-badge">${gov}</span>
        </div>
      </div>
      <p style="font-size: 0.8rem; margin: 0.5rem 0; line-height: 1.4; color: var(--text-gray); flex-grow: 1;">${desc}</p>
      <a href="${item.url}" target="_blank" class="dir-link" style="margin-top: auto; font-size: 0.8rem; font-weight: 700;">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> ${linkText}
      </a>
    `;
    container.appendChild(card);
  });
}
