import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import facebook from "../assets/img/facebook.png";
import google from "../assets/img/google.png";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [usingOauth, setUsingOauth] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const checkData = async (obj) => {
    const { email, password } = obj;

    if (!validateEmail(email)) {
      notify("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${apiUrl}api/v1/auth/login`,
        {
          email: email.toLowerCase(),
          password,
        },
        { withCredentials: true }
      );

      if (response.data) {
        dispatch(setUser(response.data.user));
        notify("You logged into your account successfully", "success");
        navigate("/profile");
      } else {
        notify("Your password or email is incorrect", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response) {
        notify(
          error.response.data.message ||
            "Something went wrong, please try again",
          error
        );
      } else {
        notify("Something went wrong, please try again", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (captchaValid) {
      checkData(data);
    } else if (usingOauth) {
      notify("Redirecting...", "success");
    } else {
      notify("Please complete the captcha verification", "error");
    }
  };

  const onRecaptchaSuccess = () => {
    setCaptchaValid(true);
  };

  const onRecaptchaExpired = () => {
    setCaptchaValid(false);
    notify("Captcha expired, please verify again", "error");
  };

  // Redirect to Google OAuth
  const handleGoogleLogin = () => {
    setUsingOauth(true);

    window.open(`${apiUrl}api/v1/auth/google`, "_self");
  };

  // Redirect to Facebook OAuth
  const handleFacebookLogin = () => {
    setUsingOauth(true);
    window.open(`${apiUrl}api/v1/auth/facebook`, "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-950 p-4">
      <form
        className="bg-cyan-600 rounded-lg shadow-lg p-8 w-full max-w-md"
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2 className="text-3xl text-white font-semibold mb-6 text-center">
          Sign In
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="email"
            value={data.email}
            placeholder="E-mail"
            onChange={changeHandler}
            onFocus={focusHandler}
            autoComplete="off"
            className="w-full p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={data.password}
            placeholder="Password"
            onChange={changeHandler}
            onFocus={focusHandler}
            className="w-full p-3 rounded-md bg-gray-100 text-gray-800 focus pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-2xl text-blue-400"
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
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
            disabled={!captchaValid}
            className={`w-full p-3 rounded-md text-white font-semibold ${
              captchaValid ? "bg-black" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
          {isLoading && (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mt-2"></div>
          )}
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

          {/* <p className="text-gray-100 text-sm mt-4">
              By continuing, you agree to our <a href="/terms" className="text-gray-500 hover:underline">Terms</a> and <a href="/privacy" className="text-gray-500 hover:underline">Privacy Policy</a>.
          </p> */}
        </div>

        <div className="flex flex-col space-y-2 text-center">
          <span className="text-gray-100">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-300 hover:underline">
              Create account
            </Link>
          </span>
          <span className="text-gray-100">
            Forget password?{" "}
            <Link to="/forget_pass" className="text-yellow-300 hover:underline">
              Click here
            </Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
