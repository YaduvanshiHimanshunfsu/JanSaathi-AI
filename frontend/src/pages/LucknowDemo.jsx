import { useState } from "react";
import { 
  MapPin, 
  User, 
  Activity, 
  Shield, 
  Sparkles, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Clock, 
  ArrowRight,
  UserCheck
} from "lucide-react";

/**
 * Lucknow Nagar Nigam Demonstration Page
 * Illustrates end-to-end multi-agent orchestration for real-world Lucknow contexts.
 * Fully supports Dynamic English/Hindi translation.
 */
export default function LucknowDemo() {
  const lang = localStorage.getItem("lang") || "en";

  // State to track currently running simulation grievance
  const [activeSimulationId, setActiveSimulationId] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [completedSimulations, setCompletedSimulations] = useState({});

  // Bilingual translation dictionary
  const t = {
    en: {
      title: "Lucknow Context Hub",
      sub: "जनसुनवाई पोर्टल · लखनऊ नगर निगम",
      adminTitle: "Municipal Command & Key Officials",
      mayor: "Mayor of Lucknow",
      commissioner: "Municipal Commissioner (IAS)",
      additionalComm: "Addl. Municipal Commissioner",
      chiefEngineer: "Chief Engineer (Water & Sewage)",
      cmo: "Chief Health & Medical Officer",
      sandboxTitle: "Lucknow Citizen Sandbox (15 Demo Grievances)",
      sandboxSub: "Click 'Run AI Agent Pipeline' to simulate autonomous agent processing in real-time.",
      area: "Area / Ward",
      reporter: "Submitted By",
      btnRun: "Run AI Agent Pipeline",
      btnRunning: "Orchestrating...",
      btnDone: "Simulation Active",
      outcomeHeader: "AI Orchestration Outcome",
      assignedDept: "Assigned Department",
      assignedOfficer: "Assigned Officer",
      predictedSla: "Predicted SLA Time",
      citizenAlert: "Vernacular Citizen Update (Hindi)",
      credits: "Created by Himanshu Yadav | APL Hackathon organized by GDG Lucknow",
      step1: "1. Intake Normalization Agent running...",
      step2: "2. Keyword Router detecting matching areas...",
      step3: "3. LLM Urgency & Priority Analysis ongoing...",
      step4: "4. Load-Balancer selecting optimal official...",
      step5: "5. Vernacular Translation generating Hindi update...",
      toastSuccess: "Complaint processed successfully!"
    },
    hi: {
      title: "लखनऊ संदर्भ हब",
      sub: "जनसुनवाई पोर्टल · लखनऊ नगर निगम",
      adminTitle: "नगर निगम प्रशासन एवं प्रमुख अधिकारी",
      mayor: "लखनऊ की महापौर",
      commissioner: "नगर आयुक्त (IAS)",
      additionalComm: "अपर नगर आयुक्त",
      chiefEngineer: "मुख्य अभियंता (जल एवं जल-निकासी)",
      cmo: "मुख्य चिकित्सा एवं स्वास्थ्य अधिकारी",
      sandboxTitle: "लखनऊ नागरिक सैंडबॉक्स (15 लाइव डेमो शिकायतें)",
      sandboxSub: "स्वायत्त एआई एजेंट प्रसंस्करण देखने के लिए 'रन एआई एजेंट' पर क्लिक करें।",
      area: "क्षेत्र / वार्ड",
      reporter: "द्वारा प्रेषित",
      btnRun: "रन एआई एजेंट पाइपलाइन",
      btnRunning: "समन्वय जारी...",
      btnDone: "सिमुलेशन सक्रिय",
      outcomeHeader: "एआई समन्वय परिणाम",
      assignedDept: "आवंटित विभाग",
      assignedOfficer: "आवंटित अधिकारी",
      predictedSla: "अनुमानित समाधान समय",
      citizenAlert: "नागरिक संदेश (हिन्दी)",
      credits: "हिमांशु यादव द्वारा निर्मित | GDG लखनऊ द्वारा आयोजित APL हैकाथॉन",
      step1: "1. इनटेक सामान्यीकरण एजेंट सक्रिय...",
      step2: "2. कीवर्ड राउटर स्थान का मिलान कर रहा है...",
      step3: "3. एलएलएम तात्कालिकता एवं प्राथमिकता विश्लेषण जारी...",
      step4: "4. लोड-बैलेंसर इष्टतम अधिकारी का चयन कर रहा है...",
      step5: "5. वर्नाकुलर एजेंट हिन्दी नागरिक अपडेट तैयार कर रहा है...",
      toastSuccess: "शिकायत का सफलतापूर्वक समाधान किया गया!"
    }
  }[lang];

  // 1. Municipal Officials Data
  const officials = [
    { name: "Smt. Sushma Kharakwal", role: t.mayor, office: "Lucknow Nagar Nigam HQ, Kaiserbagh" },
    { name: "Shri Inderjit Singh, IAS", role: t.commissioner, office: "Nagar Nigam Commissionerate" },
    { name: "Shri Pankaj Singh", role: t.additionalComm, office: "Nagar Nigam Administration Office" },
    { name: "Er. Manoj Kumar", role: t.chiefEngineer, office: "Jal Kal Vibhag, Aishbagh" },
    { name: "Dr. K.P. Tripathi", role: t.cmo, office: "Swasthya Swachhta Vibhag, Hazratganj" }
  ];

  // 2. Exactly 15 Pre-filled Lucknow citizen complaints for demonstration
  const mockComplaints = [
    {
      id: "LKO-101",
      area: "Gomti Nagar (Sector 4)",
      citizen: "Alok Srivastava",
      complaint: "Water supply has been erratic for 4 days in Sector 4, causing extreme distress to senior citizens and children.",
      problem_hi: "गोमती नगर सेक्टर 4 में 4 दिनों से पानी की आपूर्ति बाधित है, जिससे बुजुर्गों और बच्चों को काफी परेशानी हो रही है।",
      outcome: {
        department: "Water Supply",
        department_hi: "जल आपूर्ति विभाग",
        priority: 5,
        urgency: "Critical",
        sla: "6 Hours",
        officer: "Er. Manoj Kumar (Chief Engineer, LNN)",
        message: "प्रिय आलोक श्रीवास्तव, लखनऊ नगर निगम के जल कल विभाग ने आपकी पेयजल आपूर्ति समस्या दर्ज की है। मुख्य अभियंता Er. Manoj Kumar को मामला सौंप दिया गया है। 6 घंटे में जलापूर्ति सामान्य करने का प्रयास जारी है।"
      }
    },
    {
      id: "LKO-102",
      area: "Aminabad Market",
      citizen: "Rajesh Kesarwani",
      complaint: "Aminabad main market drainage is overflowing onto the market path, creating extremely unhygienic conditions for shopkeepers.",
      problem_hi: "अमीनाबाद मुख्य बाजार की नालियों का पानी सड़कों पर बह रहा है, जिससे दुकानदारों और खरीदारों के लिए अस्वच्छ स्थिति पैदा हो गई है।",
      outcome: {
        department: "Sanitation",
        department_hi: "स्वच्छता विभाग",
        priority: 4,
        urgency: "Distressed",
        sla: "12 Hours",
        officer: "Dr. K.P. Tripathi (Chief Medical Officer, LNN)",
        message: "प्रिय राजेश केसरवानी, अमीनाबाद मार्केट में जलभराव एवं नाली ओवरफ्लो की शिकायत दर्ज कर ली गई है। नगर स्वास्थ्य अधिकारी डॉ. के.पी. त्रिपाठी की देखरेख में सफाई कर्मियों का दस्ता रवाना कर दिया गया है। 12 घंटे में नाली दुरुस्त कर दी जाएगी।"
      }
    },
    {
      id: "LKO-103",
      area: "Chowk Area",
      citizen: "Mohammad Yusuf",
      complaint: "Roadside encroachments in Chowk market are causing massive traffic jams. Ambulances get stuck for hours.",
      problem_hi: "चौक बाजार में सड़क किनारे अवैध अतिक्रमण के कारण भारी ट्रैफिक जाम लग रहा है। एम्बुलेंस भी घंटों फंसी रहती हैं।",
      outcome: {
        department: "Encroachment",
        department_hi: "अतिक्रमण निरोधक विभाग",
        priority: 5,
        urgency: "Critical",
        sla: "8 Hours",
        officer: "Shri Pankaj Singh (Addl. Municipal Commissioner)",
        message: "प्रिय मोहम्मद यूसुफ, चौक मार्केट में गंभीर अतिक्रमण की समस्या पर संज्ञान लिया गया है। अपर नगर आयुक्त श्री पंकज सिंह के निर्देशानुसार पुलिस बल एवं अतिक्रमण विरोधी दस्ते को कार्रवाई हेतु 8 घंटे के भीतर चौक भेजा जा रहा है।"
      }
    },
    {
      id: "LKO-104",
      area: "Aliganj (Sector H)",
      citizen: "Shalini Dixit",
      complaint: "Huge pile of garbage accumulated near Sector H park. Foul smell is spreading and breeding mosquitoes.",
      problem_hi: "सेक्टर एच पार्क के पास कचरे का बहुत बड़ा ढेर जमा हो गया है। दुर्गंध फैल रही है और मच्छर पनप रहे हैं जिससे बीमारी का खतरा है।",
      outcome: {
        department: "Sanitation",
        department_hi: "स्वच्छता एवं कूड़ा निस्तारण",
        priority: 3,
        urgency: "Concerned",
        sla: "24 Hours",
        officer: "Dr. K.P. Tripathi (Chief Medical Officer, LNN)",
        message: "प्रिय शालिनी दीक्षित, पार्क के पास कचरा संचय की शिकायत दर्ज है। स्वास्थ्य विभाग द्वारा कूड़ा उठाने वाली डंपर गाड़ी एवं स्प्रे छिड़काव दल को 24 घंटे में सफाई कार्य पूरा करने का आदेश दिया गया है।"
      }
    },
    {
      id: "LKO-105",
      area: "Hazratganj Main Road",
      citizen: "Amit Kapoor",
      complaint: "Hazratganj main streetlights are completely broken for the last two weeks, making it unsafe for women at night.",
      problem_hi: "हजरतगंज मुख्य मार्ग की स्ट्रीटलाइट्स पिछले दो सप्ताह से बंद पड़ी हैं, जिससे रात के समय महिलाओं की सुरक्षा को लेकर खतरा बना हुआ है।",
      outcome: {
        department: "Electricity",
        department_hi: "विद्युत एवं प्रकाश विभाग",
        priority: 4,
        urgency: "Distressed",
        sla: "18 Hours",
        officer: "Shri Inderjit Singh, IAS (Municipal Commissioner)",
        message: "प्रिय अमित कपूर, हजरतगंज प्रकाश व्यवस्था की शिकायत पर नगर निगम विद्युत टीम को निर्देशित किया गया है। 18 घंटे के भीतर सभी निष्क्रिय स्ट्रीटलाइट्स को ठीक कर मार्ग प्रकाशित किया जाएगा।"
      }
    },
    {
      id: "LKO-106",
      area: "Indiranagar (Block C)",
      citizen: "Vikas Talwar",
      complaint: "Extreme low voltage and power fluctuations in Block C are causing damage to household electronic appliances.",
      problem_hi: "कॉलेज ब्लॉक सी में अत्यधिक कम वोल्टेज और बिजली के उतार-चढ़ाव के कारण घरेलू बिजली के उपकरण खराब हो रहे हैं।",
      outcome: {
        department: "Electricity",
        department_hi: "विद्युत विभाग",
        priority: 3,
        urgency: "Concerned",
        sla: "24 Hours",
        officer: "Er. Manoj Kumar (Chief Engineer, LNN)",
        message: "प्रिय विकास तलवार, इंदिरा नगर ब्लॉक सी में बिजली वोल्टेज की समस्या दर्ज की गई है। मुख्य अभियंता Er. Manoj Kumar ने सबस्टेशन ट्रांसफार्मर ऑडिट का निर्देश दिया है। 24 घंटे के भीतर वोल्टेज सुधार का प्रयास किया जाएगा।"
      }
    },
    {
      id: "LKO-107",
      area: "Charbagh Station Road",
      citizen: "Sandeep Pandey",
      complaint: "Huge potholes on the road leading to Charbagh station are causing daily accidents. Two-wheelers are slipping constantly.",
      problem_hi: "चारबाग स्टेशन जाने वाली सड़क पर बड़े-बड़े गड्ढे हो गए हैं जिससे रोज दुर्घटनाएं हो रही हैं। दोपहिया वाहन लगातार फिसल रहे हैं।",
      outcome: {
        department: "Road Repair",
        department_hi: "सड़क निर्माण एवं मरम्मत विभाग",
        priority: 5,
        urgency: "Critical",
        sla: "12 Hours",
        officer: "Shri Inderjit Singh, IAS (Municipal Commissioner)",
        message: "प्रिय संदीप पांडेय, चारबाग स्टेशन मार्ग पर गड्ढों के कारण हो रही दुर्घटनाओं को गंभीरता से लेते हुए, नगर निगम पैच-वर्क टीम को पैचिंग सामग्री के साथ 12 घंटे में मार्ग अस्थायी रूप से ठीक करने का निर्देश दिया गया है।"
      }
    },
    {
      id: "LKO-108",
      area: "Vrindavan Yojna Sector 3",
      citizen: "Megha Gupta",
      complaint: "Stray dog menace and open garbage bins in Vrindavan Yojna Sector 3 are posing a direct threat to children playing outside.",
      problem_hi: "वृंदावन योजना सेक्टर 3 में लावारिस कुत्तों का आतंक और खुले कूड़ेदान बाहर खेलने वाले बच्चों के लिए सीधा खतरा बने हुए हैं।",
      outcome: {
        department: "Sanitation",
        department_hi: "पशु कल्याण एवं स्वच्छता विभाग",
        priority: 3,
        urgency: "Concerned",
        sla: "24 Hours",
        officer: "Shri Pankaj Singh (Addl. Municipal Commissioner)",
        message: "प्रिय मेघा गुप्ता, आवारा पशु नियंत्रण एवं स्वच्छता विभाग ने आपकी शिकायत दर्ज कर ली है। अपर नगर आयुक्त श्री पंकज सिंह के निर्देशानुसार डॉग-कैट कैचिंग वैन और कचरा निस्तारण दल को 24 घंटे में कार्य संपादन हेतु भेजा जा रहा है।"
      }
    },
    {
      id: "LKO-109",
      area: "Jankipuram Extension",
      citizen: "Anurag Dwivedi",
      complaint: "Open manholes near Sector F Primary School pose an immediate hazard to school children during monsoons.",
      problem_hi: "सेक्टर एफ प्राथमिक विद्यालय के पास खुले सीवर मैनहोल बारिश के मौसम में स्कूली बच्चों के लिए सीधा खतरा बने हुए हैं।",
      outcome: {
        department: "Water Supply / Jal Nigam",
        department_hi: "जल कल एवं सीवरेज विभाग",
        priority: 5,
        urgency: "Critical",
        sla: "4 Hours",
        officer: "Er. Manoj Kumar (Chief Engineer, LNN)",
        message: "प्रिय अनुराग द्विवेदी, स्कूल के पास खुले मैनहोल की शिकायत दर्ज कर ली गई है। सुरक्षा कारणों से 4 घंटे के भीतर ढक्कन बदलने हेतु जलकल विभाग की आपातकालीन टीम रवाना की जा रही है।"
      }
    },
    {
      id: "LKO-110",
      area: "Nishatganj Bridge Road",
      citizen: "Karan Johar",
      complaint: "The pedestrian railing on Nishatganj bridge is completely broken, presenting a huge risk of falling into the river below.",
      problem_hi: "निशातगंज पुल की पैदल यात्री रेलिंग पूरी तरह से टूट चुकी है, जिससे पुल से नदी में गिरने का भारी खतरा बना हुआ है।",
      outcome: {
        department: "Road Repair",
        department_hi: "सड़क एवं पुल रख-रखाव विभाग",
        priority: 4,
        urgency: "Distressed",
        sla: "18 Hours",
        officer: "Shri Pankaj Singh (Addl. Municipal Commissioner)",
        message: "प्रिय करन जौहर, निशातगंज पुल की क्षतिग्रस्त रेलिंग की शिकायत दर्ज है। लोक निर्माण (PWD) और नगर निगम की संयुक्त तकनीकी टीम को 18 घंटे में अस्थायी सुरक्षा बैरिकेड लगाने का निर्देश दिया गया है।"
      }
    },
    {
      id: "LKO-111",
      area: "Alambagh (Sector B)",
      citizen: "Sunita Deshmukh",
      complaint: "Illegal sewer connection in Sector B is backing up directly into our domestic drinking water inlet line, causing sewage smell.",
      problem_hi: "सेक्टर बी में अवैध सीवर कनेक्शन का गंदा पानी हमारी पीने के पानी की लाइन में आ रहा है, जिससे नल में बदबूदार पानी आ रहा है।",
      outcome: {
        department: "Water Supply",
        department_hi: "जल आपूर्ति एवं सीवरेज",
        priority: 5,
        urgency: "Critical",
        sla: "6 Hours",
        officer: "Er. Manoj Kumar (Chief Engineer, LNN)",
        message: "प्रिय सुनीता देशमुख, पेयजल में सीवर रिसाव की गंभीर समस्या दर्ज कर ली गई है। 6 घंटे के भीतर मुख्य लाइन विच्छेद और जल शोधन हेतु जलकल विंग की विशेष जांच टीम घटनास्थल पर पहुंच रही है।"
      }
    },
    {
      id: "LKO-112",
      area: "Mahanagar Sector A",
      citizen: "Pradeep Mehrotra",
      complaint: "Major traffic signal synchronization failure at Sector A crossing is causing 45-minute jams during peak office hours.",
      problem_hi: "महानगर सेक्टर ए चौराहे पर ट्रैफिक सिग्नल खराब होने के कारण दफ्तर के समय 45 मिनट का लंबा ट्रैफिक जाम लग रहा है।",
      outcome: {
        department: "Public Safety",
        department_hi: "जन सुरक्षा एवं यातायात विभाग",
        priority: 3,
        urgency: "Concerned",
        sla: "12 Hours",
        officer: "Inspector Rajeev Sharma (Police Dept / Traffic)",
        message: "प्रिय प्रदीप मेहरोत्रा, महानगर चौराहे पर सिग्नल खराबी की शिकायत पर यातायात पुलिस विभाग को सूचित कर दिया गया है। 12 घंटे में तकनीकी सुधार होने तक मैन्युअल ट्रैफिक संचालन हेतु होमगार्ड तैनात किए गए हैं।"
      }
    },
    {
      id: "LKO-113",
      area: "Vikas Nagar Sector 2",
      citizen: "Preeti Sahay",
      complaint: "Stray cattle herds block the main market road in Sector 2, causing multiple collisions for bikers.",
      problem_hi: "विकास नगर सेक्टर 2 बाजार की मुख्य सड़क पर आवारा पशुओं के झुंड के कारण बाइक चालकों की दुर्घटनाएं हो रही हैं।",
      outcome: {
        department: "Sanitation",
        department_hi: "पशु कल्याण एवं स्वच्छता विभाग",
        priority: 3,
        urgency: "Concerned",
        sla: "24 Hours",
        officer: "Shri Pankaj Singh (Addl. Municipal Commissioner)",
        message: "प्रिय प्रीति सहाय, विकास नगर में आवारा पशुओं के जमावड़े की शिकायत पर पशु कल्याण दस्ते को 24 घंटे में अभियान चलाकर पशुओं को नजदीकी गौशाला में स्थानांतरित करने का निर्देश दिया गया है।"
      }
    },
    {
      id: "LKO-114",
      area: "Jubilee Road (Chowk)",
      citizen: "Mohit Rastogi",
      complaint: "Water pipeline leakage on Jubilee road is flooding the wholesale gold market path, disrupting local business operations.",
      problem_hi: "जुबली रोड पर पेयजल पाइपलाइन फटने से चौक के सराफा बाजार की गलियों में बाढ़ जैसी स्थिति आ गई है, जिससे व्यापार ठप है।",
      outcome: {
        department: "Water Supply",
        department_hi: "जल आपूर्ति विभाग",
        priority: 5,
        urgency: "Critical",
        sla: "8 Hours",
        officer: "Er. Manoj Kumar (Chief Engineer, LNN)",
        message: "प्रिय मोहित रस्तोगी, जुबली रोड चौक पर पाइपलाइन रिसाव की आपातकालीन समस्या दर्ज है। जलकल मरम्मत टीम को 8 घंटे के भीतर मुख्य वाल्व बंद कर पाइप वेल्डिंग कार्य पूरा करने का निर्देश दिया गया है।"
      }
    },
    {
      id: "LKO-115",
      area: "Gomti Nagar Extension",
      citizen: "Nidhi Agrawal",
      complaint: "Complete lack of public garbage bins in Gomti Nagar Extension Sector 6 is forcing residents to litter roadsides.",
      problem_hi: "गोमती नगर विस्तार सेक्टर 6 में सार्वजनिक कूड़ेदान न होने के कारण लोग सड़कों के किनारे कचरा फेंकने को मजबूर हैं।",
      outcome: {
        department: "Sanitation",
        department_hi: "स्वच्छता विभाग (कूड़ा निस्तारण)",
        priority: 3,
        urgency: "Concerned",
        sla: "24 Hours",
        officer: "Dr. K.P. Tripathi (Chief Medical Officer, LNN)",
        message: "प्रिय निधि अग्रवाल, गोमती नगर विस्तार सेक्टर 6 में सार्वजनिक डस्टबिन की मांग दर्ज की गई है। नगर स्वास्थ्य विभाग द्वारा 24 घंटे के भीतर 5 बड़े आधुनिक कवर्ड डस्टबिन स्थापित करने के आदेश जारी किए गए हैं।"
      }
    }
  ];

  // Run the multi-agent pipeline simulation
  function startSimulation(id) {
    setActiveSimulationId(id);
    setSimStep(1);
    
    // Animate through different agent stages
    const timer1 = setTimeout(() => setSimStep(2), 800);
    const timer2 = setTimeout(() => setSimStep(3), 1600);
    const timer3 = setTimeout(() => setSimStep(4), 2400);
    const timer4 = setTimeout(() => setSimStep(5), 3200);
    
    const timer5 = setTimeout(() => {
      setCompletedSimulations(prev => ({ ...prev, [id]: true }));
      setActiveSimulationId(null);
      setSimStep(0);
    }, 4000);
  }

  return (
    <div className="page-container fade-in">
      
      {/* 🏛️ Upgraded Lucknow Nagar Nigam Animated Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center p-8 pointer-events-none">
          <MapPin size={220} className="stroke-[1]" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-white/20">
            <Sparkles size={14} className="animate-pulse" />
            Special Lucknow Context Feature
          </div>
          
          {/* Big stylized glowing header as requested */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight select-none">
            <span className="bg-gradient-to-r from-white via-orange-100 to-yellow-100 bg-clip-text text-transparent hover:brightness-110 transition duration-300">
              {t.sub}
            </span>
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-orange-50 max-w-2xl leading-relaxed">
            {lang === "en" 
              ? "Designed to automate public grievance routing, prioritization, and resolution in partnership with Lucknow Municipal Administration."
              : "लखनऊ नगर निगम प्रशासन के सहयोग से जन शिकायतों के स्वतः वर्गीकरण, प्राथमिकता निर्धारण और तत्काल निस्तारण हेतु विशेष रूप से डिजाइन किया गया मॉड्यूल।"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 font-semibold text-sm">
        
        {/* 👮 Officials & In-Charge Hierarchy Panel */}
        <div className="lg:col-span-1">
          <div className="card h-full border border-orange-100/50 shadow-md">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2 mb-6 border-b pb-4">
              <Shield className="text-primary animate-pulse" size={22} />
              {t.adminTitle}
            </h2>

            <div className="space-y-6">
              {officials.map((official, idx) => (
                <div key={idx} className="flex gap-4 p-3 hover:bg-orange-50/30 rounded-2xl border border-transparent hover:border-orange-100 transition duration-300">
                  <div className="bg-orange-100 p-2.5 rounded-xl text-primary h-fit shadow-inner">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm md:text-base leading-tight">
                      {official.name}
                    </h3>
                    <p className="text-xs text-primary font-bold mt-1">
                      {official.role}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                      {official.office}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-inner text-amber-900">
              <p className="text-xs leading-relaxed font-semibold">
                ℹ️ {lang === "en" 
                  ? "Officials are dynamically assigned to cases based on department workload thresholds and SLA parameters analyzed by SunwAI."
                  : "शिकायत का प्रकार और वर्तमान कार्यभार के अनुसार 'सुनवाई SunwAI' द्वारा नगर निगम के अधिकारियों को मामले स्वतः सौंपे जाते हैं।"}
              </p>
            </div>
          </div>
        </div>

        {/* 💻 Lucknow Citizen Sandbox Panel */}
        <div className="lg:col-span-2">
          <div className="card border border-orange-100/50 shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-dark flex items-center gap-2">
                <Sparkles className="text-primary" size={24} />
                {t.sandboxTitle}
              </h2>
              <p className="text-gray-500 text-xs mt-1.5 font-semibold">{t.sandboxSub}</p>
            </div>

            <div className="space-y-6 max-h-[700px] overflow-y-auto pr-1">
              {mockComplaints.map((item) => {
                const isRunning = activeSimulationId === item.id;
                const isDone = completedSimulations[item.id];

                return (
                  <div 
                    key={item.id} 
                    className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                      isRunning 
                        ? "border-primary bg-orange-50/50 shadow-lg scale-[0.99] pulse-glow" 
                        : isDone 
                        ? "border-green-500 bg-green-50/10 shadow-sm" 
                        : "border-gray-100 bg-white hover:border-orange-200"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-primary font-black text-xs px-3 py-1 rounded-lg">
                          {item.id}
                        </span>
                        <span className="font-extrabold text-gray-800 text-sm flex items-center gap-1">
                          <MapPin size={14} className="text-primary" />
                          {item.area}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">
                        {t.reporter}: <strong className="text-gray-700">{item.citizen}</strong>
                      </span>
                    </div>

                    {/* Complaint Details */}
                    <p className="text-gray-800 text-sm md:text-base italic leading-relaxed pl-3 border-l-4 border-primary">
                      &ldquo;{lang === "en" ? item.complaint : item.problem_hi}&rdquo;
                    </p>

                    {/* Simulation Flow Controller */}
                    <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {!isRunning && !isDone && (
                        <button
                          onClick={() => startSimulation(item.id)}
                          className="primary-btn inline-flex items-center justify-center gap-2 text-xs md:text-sm py-2 px-5 hover:translate-y-[-1px] shadow-md shadow-orange-500/10"
                        >
                          <Play size={14} />
                          {t.btnRun}
                        </button>
                      )}

                      {isRunning && (
                        <div className="w-full">
                          <div className="flex items-center gap-3 text-primary text-sm font-black animate-pulse mb-3">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            {t.btnRunning}
                          </div>
                          
                          {/* Progress bars / Pipeline stages */}
                          <div className="space-y-2 text-xs text-gray-600 font-semibold bg-white p-3.5 rounded-2xl border border-orange-100">
                            {simStep >= 1 && <p className="text-primary animate-pulse">{t.step1}</p>}
                            {simStep >= 2 && <p className="text-amber-600 animate-pulse">{t.step2}</p>}
                            {simStep >= 3 && <p className="text-orange-600 animate-pulse">{t.step3}</p>}
                            {simStep >= 4 && <p className="text-blue-600 animate-pulse">{t.step4}</p>}
                            {simStep >= 5 && <p className="text-green-600 animate-pulse">{t.step5}</p>}
                          </div>
                        </div>
                      )}

                      {isDone && (
                        <div className="w-full mt-2 animate-fade-in">
                          {/* Orchestrated Outcome Container */}
                          <div className="bg-white p-5 rounded-2xl border border-green-200 shadow-sm space-y-4">
                            <h4 className="text-sm font-black text-green-700 flex items-center gap-1.5 border-b border-green-100 pb-2">
                              <CheckCircle size={16} className="text-green-650 animate-pulse" />
                              {t.outcomeHeader}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-gray-650">
                              <div>
                                <p className="text-gray-450 text-[10px] uppercase tracking-wide">{t.assignedDept}</p>
                                <p className="text-gray-800 text-sm mt-1">{lang === "en" ? item.outcome.department : item.outcome.department_hi}</p>
                              </div>
                              <div>
                                <p className="text-gray-450 text-[10px] uppercase tracking-wide">{t.assignedOfficer}</p>
                                <p className="text-gray-800 text-sm mt-1">{item.outcome.officer}</p>
                              </div>
                              <div>
                                <p className="text-gray-450 text-[10px] uppercase tracking-wide">{t.predictedSla}</p>
                                <p className="text-green-600 text-sm mt-1 font-extrabold flex items-center gap-1">
                                  <Clock size={14} />
                                  {item.outcome.sla}
                                </p>
                              </div>
                            </div>

                            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 font-semibold">
                              <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">{t.citizenAlert}</p>
                              <p className="text-xs text-green-800 leading-relaxed">
                                {item.outcome.message}
                              </p>
                            </div>
                            
                            <div className="mt-4">
                              <button
                                onClick={() => startSimulation(item.id)}
                                className="bg-gray-150 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <Play size={12} />
                                Re-run Simulation
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 🏅 Footer Branding (Organizers and Developers) */}
      <footer className="mt-12 py-8 border-t border-orange-100 text-center font-semibold">
        <p className="text-gray-500 text-sm tracking-wide">
          {t.credits}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          APL Qualifiers — GDG Lucknow 🚀 · Built with React, FastAPI & Google Gemini API
        </p>
      </footer>

    </div>
  );
}
