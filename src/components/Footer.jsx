import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/img/logo.jpeg";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faGooglePlusG,
} from "@fortawesome/free-brands-svg-icons";
const apiUrl = import.meta.env.VITE_API_URL;

const Footer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState(null);
  const [footerIn, setFooter] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    axios.get(`${apiUrl}api/v1/contact/contact-info`).then((res) => {
      setContact(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${apiUrl}api/v1/footer`).then((res) => {
      setFooter(res.data.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiUrl}api/v1/contact`, {
        name,
        email,
        phone: "1", // Optional for this form
        message: "Subscribed for newsletter",
      });

      if (response.status === 201) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b font-josefin-r from-gray-900 mt-20 via-gray-800 to-gray-600 text-gray-400 py-12 lg:px-36 px-6 z-40">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <img src={logo} className="w-28 rounded-xl h-24 shadow-2xl mb-1" alt="Logo" />
          <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
            Odg Music
          </h3>
          <p className="text-white leading-6">{footerIn?.mainHeading}</p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
            {t("usefulLinks")}
          </h3>
          <ul className="text-gray-100  space-y-4">
            {footerIn?.links?.map((link, index) => {
              return (
                <li key={link._id}>
                  <Link
                    to={link?.link}
                    onClick={scrollToTop}
                    className="hover:text-gray-300"
                  >
                    {link?.heading}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
            {t("footerSubscribeH")}
          </h3>
          <p className="text-gray-300 mb-4">  {footerIn?.subscribe}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t("yourName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-100 text-gray-700 rounded focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder={t("yourEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-100 text-gray-700 rounded focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-6/12 bg-cyan-500 text-white py-2 rounded-3xl hover:bg-cyan-600 transition duration-200"
            >
              {isSubmitting ? "Sending..." : t("send")}
            </button>
          </form>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
            {t("contactUs")}
          </h3>
          <p className="text-gray-300">
            <strong>Call Us:</strong> {contact?.phone}
          </p>
          <p className="text-gray-300">
            <strong>Email Us:</strong> {contact?.email}
          </p>
          <p className="text-gray-300 mb-4">
            <strong>Walk In:</strong> {contact?.address}
          </p>

          <h3 className="text-cyan-400 text-xl mb-2">{t("followUs")}</h3>
          <div className="flex space-x-3">
            <a
              href={contact?.facebook}
              className="bg-cyan-500 p-2 w-10 h-10 rounded"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-white" />
            </a>
            <a
              href={contact?.instagram}
              className="bg-cyan-500 p-2 w-10 h-10 rounded"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="text-white" />
            </a>
            <a
              href={contact?.twitter}
              className="bg-cyan-500 p-2 w-10 h-10 rounded"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-white" />
            </a>
            <a
              href={contact?.googleplus}
              className="bg-cyan-500 p-2 w-10 h-10 rounded"
            >
              <FontAwesomeIcon icon={faGooglePlusG} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
