import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPlus,
} from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { validate } from "./validate";
import toast, { Toaster } from "react-hot-toast";

import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
import loginBg from "../assets/loginBg.jpg";

const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ fullName: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    "https://dummyimage.com/150x150"
  );

  const showToast = (message, type = "success") => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 px-4 py-3`}
        >
          <div className="flex-1 w-0">
            <p className="text-sm font-medium text-gray-900">
              {type === "success" ? "Success" : "Error"}
            </p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
      ),
      { position: "bottom-center" }
    );
  };

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data]);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    validateOnInputChange(name, value);
  };

  const validateOnInputChange = (name, value) => {
    const newErrors = validate({ ...data, [name]: value }, "signUp");
    setErrors(newErrors);
  };

  const onRecaptchaSuccess = () => {
    setCaptchaValid(true);
  };

  const onRecaptchaExpired = () => {
    setCaptchaValid(false);
    toast.error("Captcha expired, please verify again");
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleEmailBlur = async () => {
    if (validateEmail(data.email)) {
      setIsEmailValid(true);
      try {
        const response = await axios.post(`${apiUrl}api/v1/user/check-email`, {
          email: data.email,
        });

        if (response.data.data.exists) {
          setEmailExists(true);
          toast.error("Email is already registered!");
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        toast.error("Network error, please try again!");
      }
    } else {
      setIsEmailValid(false);
    }
  };

  const sendOtp = async () => {
    if (
      !isEmailValid ||
      emailExists ||
      !captchaValid ||
      errors.fullName ||
      errors.password
    )
      return;
    setOtpLoading(true);

    try {
      const response = await axios.post(`${apiUrl}api/v1/user/get-otp`, {
        email: data.email,
      });
      if (response.data.success) {
        setOtp(response.data.data.otp);
        setStep(2);
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      toast.error("Failed to send OTP, try again!");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (userOtp === otp) {
      // toast.success("OTP verified successfully!");
      setVerifyLoading(true);

      try {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email.toLowerCase());
        formData.append("password", data.password);
        if (coverImage) {
          formData.append("coverImage", coverImage);
        }

        const response = await axios.post(`${apiUrl}api/v1/user`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("You signed up successfully");
          setTimeout(() => {
            navigate("/login");
          }, 500);
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Signup error", error);
        if (error.response?.data?.error?.errorResponse?.code === 11000) {
          toast.error("Email already registered");
        } else {
          toast.error("Server error. Please try again later.");
        }
      } finally {
        setVerifyLoading(false);
      }
    } else {
      toast.error("Invalid OTP, please try again!");
    }
  };

  const handleGoogleLogin = (event) => {
    event.preventDefault();

    window.open(`${apiUrl}api/v1/auth/google`, "_self");
  };

  const handleFacebookLogin = (event) => {
    event.preventDefault();

    window.open(`${apiUrl}api/v1/auth/facebook`, "_self");
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        className=" bg-cyan-700/30 border border-cyan-500 rounded-lg shadow-xl p-8 w-full max-w-md"
        autoComplete="off"
      >
        <h2 className="text-3xl text-gray-200 font-semibold mb-6 text-center">
          Sign Up
        </h2>

        {step === 1 && (
          <>
            <div className="relative mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden relative">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="coverImageInput"
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <FaPlus className="text-white text-2xl" />
                </label>
                <input
                  type="file"
                  id="coverImageInput"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-200 text-sm font-bold mb-2"
              >
                <FaUser className="inline mr-2" /> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={data.fullName}
                placeholder="Enter your full name"
                onChange={changeHandler}
                onBlur={() => setTouched({ ...touched, fullName: true })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              />
              {touched.fullName && errors.fullName && (
                <p className="text-red-500 text-xs italic">{errors.fullName}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-200 text-sm font-bold mb-2"
              >
                <FaEnvelope className="inline mr-2" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                placeholder="Enter your email"
                onBlur={() => {
                  handleEmailBlur();
                  setTouched({ ...touched, email: true });
                }}
                onChange={changeHandler}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs italic">{errors.email}</p>
              )}
              {touched.email && !isEmailValid && !errors.email && (
                <p className="text-red-500 text-xs italic">
                  Enter a valid Gmail, Yahoo, or Outlook email
                </p>
              )}
              {emailExists && (
                <p className="text-red-500 text-xs italic">
                  Email is already registered!
                </p>
              )}
            </div>

            <div className="mb-6  relative">
              <label
                htmlFor="password"
                className="block text-gray-200 text-sm font-bold mb-2"
              >
                <FaLock className="inline mr-2" /> Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                placeholder="Enter your password"
                onChange={changeHandler}
                onBlur={() => setTouched({ ...touched, password: true })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute top-[50%] bottom-0 right-3 flex items-center text-gray-400"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FaEye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs italic">{errors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onRecaptchaSuccess}
                onExpired={onRecaptchaExpired}
              />
            </div>

            <button
              type="button"
              onClick={sendOtp}
              className={`bg-cyan-400 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center ${
                !captchaValid ||
                errors.fullName ||
                errors.email ||
                errors.password
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                otpLoading ||
                !captchaValid ||
                errors.fullName ||
                errors.email ||
                errors.password
              }
            >
              {otpLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Get OTP"
              )}
            </button>

            {/* Toast rendered near this button */}
            <Toaster position="bottom-center" />
          </>
        )}
        {step === 2 && (
          <>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-100 text-sm font-bold mb-2"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={userOtp}
                placeholder="Enter OTP"
                onChange={(e) => setUserOtp(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="button"
              onClick={verifyOtp}
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
              disabled={verifyLoading}
            >
              {verifyLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Verify OTP"
              )}
            </button>

            <Toaster position="bottom-center" />
          </>
        )}
      </form>
      {/* Google/Facebook Login buttons */}
      <div className="mt-8">
        <button
          className="w-full mb-4 flex items-center justify-center py-3 px-4 rounded-lg shadow-xl transition-colors duration-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleGoogleLogin}
        >
          <img className="w-6 h-6 mr-2" src={google} alt="Google logo" />
          <span className="font-semibold">Continue with Google</span>
        </button>

        <button
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-xl transition-colors duration-300 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleFacebookLogin}
        >
          <img className="w-6 h-6 mr-2" src={facebook} alt="Facebook logo" />
          <span className="font-semibold">Continue with Facebook</span>
        </button>
      </div>

      <h1 className="text-gray-100 text-center w-full mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-yellow-300 hover:underline">
          Sign In
        </Link>
      </h1>
    </div>
  );
};

export default SignUp;
