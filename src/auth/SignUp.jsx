import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { validate } from "./validate";
import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [usingOauth, setUsingOauth] = useState(false);

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    validateOnInputChange(name, value);
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
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

  const submitHandler = async (event) => {
    event.preventDefault();
    if (usingOauth) return;

    const validationErrors = validate(data, "signUp");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      notify("Please check fields again", "error");
      setTouched({
        fullName: true,
        email: true,
        password: true,
      });
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}api/v1/user`, {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

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
      } else if (error?.response?.data?.error?.errorResponse?.code === 11000) {
        notify("Email alredy registered . ", "error");
      } else {
        notify("Server error. Please try again later.", "error");
      }
    }
  };

  const handleGoogleLogin = () => {
    event.preventDefault();
    setUsingOauth(true);

    window.open(`${apiUrl}/api/v1/auth/google`, "_self");
    setUsingOauth(false);
  };

  // Redirect to Facebook OAuth
  const handleFacebookLogin = () => {
    event.preventDefault();
    setUsingOauth(true);
    window.open(`${apiUrl}/api/v1/auth/facebook`, "_self");
    setUsingOauth(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-950 p-4">
      <form
        className="bg-cyan-600 rounded-lg shadow-lg p-8 w-full max-w-md"
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2 className="text-3xl text-white font-semibold mb-6 text-center">
          Sign Up
        </h2>

        <div className="mb-4">
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            placeholder="Full Name"
            onChange={changeHandler}
            onFocus={focusHandler}
            className={`w-full p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName && touched.fullName ? "border-red-500" : ""
            }`}
          />
          {errors.fullName && touched.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName}</span>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={data.email}
            placeholder="Email"
            onChange={changeHandler}
            onFocus={focusHandler}
            className={`w-full p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email && touched.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={data.password}
            placeholder="Password"
            onChange={changeHandler}
            onFocus={focusHandler}
            className={`w-full p-3 rounded-md bg-gray-100 text-gray-800  pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password && touched.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
          <div
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-2xl text-blue-400"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="mb-6">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaSuccess}
            onExpired={onRecaptchaExpired}
          />
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={!captchaValid || Object.keys(errors).length > 0}
            className="w-full p-3 rounded-md bg-black text-white font-semibold"
          >
            Create Account
          </button>
        </div>

        {/* Google/Facebook Login buttons */}
        <div className="mb-6">
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

        <h1 className="text-gray-100 text-center w-full">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Sign In
          </Link>
        </h1>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
