import { useEffect, useRef, useState } from "react";
import { IoLanguageOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const languages = [
  { code: "en", label: "English", icon: "fi-us" },
  { code: "fr", label: "French", icon: "fi-fr" },
  { code: "es", label: "Spanish", icon: "fi-es" },
  { code: "pt", label: "Portuguese", icon: "fi-pt" },
  { code: "hi", label: "Hindi", icon: "fi-in" },
  { code: "ru", label: "Russian", icon: "fi-ru" },
  { code: "de", label: "German", icon: "fi-de" },
  { code: "zh-CN", label: "Chinese", icon: "fi-cn" },
];

const GoogleTranslate = () => {
  const location = useLocation();
  const [lanOpen, setLanOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get stored language preference or default to French
  const getStoredLanguage = () => {
    return localStorage.getItem("preferredLanguage") || "fr";
  };

  // Store language preference in localStorage
  const storeLanguage = (langCode) => {
    localStorage.setItem("preferredLanguage", langCode);
  };

  const changeLanguage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      storeLanguage(langCode); // Store the new preference
      setLanOpen(false); // Close dropdown after selection
    }
  };

  const initTranslate = () => {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        const preferredLanguage = getStoredLanguage();
        select.value = preferredLanguage;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 500);
  };

  useEffect(() => {
    if (!window.google || !window.google.translate) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
        initTranslate();
      };
    } else {
      initTranslate();
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div id="google_translate_element" style={{ display: "none" }}></div>

      <button
        className="flex flex-col xl:flex-row items-center gap-2 xl:border border-cyan-500/30 bg-transparent text-white p-2 rounded-md shadow-sm transition duration-200 ease-in-out hover:bg-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
        onClick={() => setLanOpen((prev) => !prev)}
      >
        <IoLanguageOutline className="w-6 h-6" />
        <span className="hidden xl:flex">Language</span>
      </button>

      {lanOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded shadow z-10 w-max">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-black"
            >
              <span className={`fi ${lang.icon} fis`} />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;
