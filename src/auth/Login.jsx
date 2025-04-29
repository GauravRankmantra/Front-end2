import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
import loginBg from "../assets/loginBg.jpg";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [usingOauth, setUsingOauth] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const notify = (msg, type = "error") => {
    toast[type](msg, {
      style: {
        background: "#1E293B",
        color: "#fff",
        border: "1px solid #0ea5e9",
        padding: "10px 16px",
      },
      duration: 3000,
    });
  };

  const checkData = async ({ email, password }) => {
    if (!validateEmail(email)) {
      notify("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${apiUrl}api/v1/auth/login`,
        { email: email.toLowerCase(), password },
        { withCredentials: true }
      );

      if (res.data) {
        dispatch(setUser(res.data.user));
        notify("You logged into your account successfully", "success");
        navigate("/profile");
      } else {
        notify("Your password or email is incorrect");
      }
    } catch (err) {
      notify(
        err?.response?.data?.message || "Something went wrong, please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const changeHandler = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });
  const focusHandler = (e) => setTouched({ ...touched, [e.target.name]: true });

  const submitHandler = (e) => {
    e.preventDefault();
    if (captchaValid) checkData(data);
    else if (usingOauth) notify("Redirecting...", "success");
    else notify("Please complete the captcha verification");
  };

  const handleGoogleLogin = () => {
    setUsingOauth(true);
    window.open(`${apiUrl}api/v1/auth/google`, "_self");
  };

  const handleFacebookLogin = () => {
    setUsingOauth(true);
    window.open(`${apiUrl}api/v1/auth/facebook`, "_self");
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
        className="relative bg-cyan-700/30 border border-cyan-500 rounded-lg shadow-lg p-8 w-full max-w-md"
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2 className="text-3xl text-white font-semibold mb-6 text-center">
          Sign In
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-white text-sm font-bold mb-2"
          >
            <FaEnvelope className="inline mr-2" /> E-mail
          </label>
          <input
            type="text"
            name="email"
            value={data.email}
            placeholder="E-mail"
            onChange={changeHandler}
            onFocus={focusHandler}
            className="w-full p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-white text-sm font-bold mb-2"
          >
            <FaLock className="inline mr-2" /> Password
          </label>
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
            className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-xl text-blue-400"
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        <div className="mb-6">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={() => setCaptchaValid(true)}
            onExpired={() => {
              setCaptchaValid(false);
              notify("Captcha expired, please verify again");
            }}
          />
        </div>

        <div className="mb-6 relative">
          <button
            type="submit"
            disabled={!captchaValid}
            className={`w-full p-3 rounded-md text-white font-semibold ${
              captchaValid ? "bg-black" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500 mx-auto mt-2"></div>
            ) : (
              "Login"
            )}
          </button>
         

          {/* 👇 Hot Toast Portal Positioned Below Button */}
          <div className="absolute w-full left-0 mt-3">
            <Toaster position="bottom-center" />
          </div>
        </div>

        {/* Google / Facebook Buttons */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mb-4 flex items-center justify-center py-3 px-4 rounded-lg shadow-xl bg-white text-gray-700 hover:bg-gray-100"
          >
            <img className="w-6 h-6 mr-2" src={google} alt="Google logo" />
            <span className="font-semibold">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <img className="w-6 h-6 mr-2" src={facebook} alt="Facebook logo" />
            <span className="font-semibold">Continue with Facebook</span>
          </button>
        </div>

        <div className="text-center text-gray-100 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-300 hover:underline">
              Create account
            </Link>
          </p>
          <p>
            Forget password?{" "}
            <Link to="/forget_pass" className="text-yellow-300 hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
