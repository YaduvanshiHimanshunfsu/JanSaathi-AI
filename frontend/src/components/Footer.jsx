import { useState, useEffect } from "react";

export default function Footer() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Read current language setting from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  const t = {
    en: {
      creator: "Created by Himanshu Yadav",
      hackathon: "APL Hackathon organized by GDG Lucknow",
      tagline: "सुनवाई SunwAI - Autonomous AI-Powered Grievance Resolution System"
    },
    hi: {
      creator: "हिमांशु यादव द्वारा निर्मित",
      hackathon: "GDG लखनऊ द्वारा आयोजित APL हैकाथॉन",
      tagline: "सुनवाई SunwAI - स्वायत्त एआई-संचालित शिकायत निवारण प्रणाली"
    }
  }[lang];

  return (
    <footer className="bg-dark text-white py-6 mt-10 border-t border-orange-950/20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-bold text-lg text-primary-light tracking-wide">
          सुनवाई SunwAI 🇮🇳
        </h2>

        <p className="text-sm text-gray-300 mt-2 font-medium">
          {t.creator}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {t.hackathon}
        </p>

        <p className="text-xs text-gray-500 mt-3 italic">
          {t.tagline}
        </p>
      </div>
    </footer>
  );
}