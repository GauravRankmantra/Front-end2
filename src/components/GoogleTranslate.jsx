import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleTranslate = () => {
    const location = useLocation();

 useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (window.google && window.google.translate) {
        initTranslate();
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
        initTranslate();
      };
    };

    const initTranslate = () => {
      const interval = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          select.value = "fr"; // Set default to French
          select.dispatchEvent(new Event("change"));
          clearInterval(interval);
        }
      }, 500); // Wait for the widget to load
    };

    addGoogleTranslateScript();
    console.log("redneres translate")
  }, [location.pathname=='dashboard']);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600"></span>
      <div
        id="google_translate_element"
        className="border border-cyan-500/30 bg-transparent text-cyan-500  rounded-lg px-2 py-1  text-sm"
      />
    </div>
  );
};

export default GoogleTranslate;
