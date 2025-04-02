import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { validate } from "./validate";
import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
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
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    "https://dummyimage.com/150x150"
  );

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
    notify("Captcha expired, please verify again", "error");
  };
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
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
          notify("Email is already registered!", "error");
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        notify("Network error, please try again!", "error");
      }
    } else {
      setIsEmailValid(false);
      notify("Enter a valid Gmail, Yahoo, or Outlook email", "error");
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

    try {
      const response = await axios.post(`${apiUrl}api/v1/user/get-otp`, {
        email: data.email,
      });
      if (response.data.success) {
        setOtp(response.data.data.otp);
        setStep(2);
        notify("OTP sent to your email", "success");
      }
    } catch (error) {
      notify("Failed to send OTP, try again!", "error");
    }
  };

  const verifyOtp = async () => {
    console.log("user otp", userOtp);
    console.log("otp", otp);
    if (userOtp === otp) {
      notify("OTP verified successfully!", "success");

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
          notify("You signed up successfully", "success");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          notify(response.data.message || "Something went wrong", "warning");
        }
      } catch (error) {
        console.error("error while signup", error);
        if (error.response) {
          notify(
            error.response.data.message ||
              "Server error. Please try again later.",
            "error"
          );
        } else if (
          error?.response?.data?.error?.errorResponse?.code === 11000
        ) {
          notify("Email alredy registered . ", "error");
        } else {
          notify("Server error. Please try again later.", "error");
        }
      }
    } else {
      notify("Invalid OTP, please try again!", "error");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-950 p-4">
      <form
        className="bg-cyan-600 rounded-lg shadow-xl p-8 w-full max-w-md"
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
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={data.fullName}
                placeholder="Enter your full name"
                onChange={changeHandler}
                onBlur={() => setTouched({ ...touched, fullName: true })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.fullName ? "border-red-500" : ""
                }`}
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
                Email
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email || (touched.email && !isEmailValid) || emailExists
                    ? "border-red-500"
                    : ""
                }`}
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
                Password
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
              className={`bg-cyan-400 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                !captchaValid ||
                errors.fullName ||
                errors.email ||
                errors.password
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                !captchaValid ||
                errors.fullName ||
                errors.email ||
                errors.password
              }
            >
              Get OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 text-sm font-bold mb-2"
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
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Verify OTP
            </button>
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

      <ToastContainer />
    </div>
  );
};

export default SignUp;