import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
const apiUrl = import.meta.env.VITE_API_URL;



const ForgetPass = () => {
  const [data, setData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle email check and OTP sending
  const checkData = async (obj) => {
    const { email } = obj;

    if (!validateEmail(email)) {
      notify("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${apiUrl}api/v1/user/forgetPass`,
        { email: email.toLowerCase() }
      );

      if (response.data) {
        notify("Otp sent to your email", "success");
        setOtpVisible(true); // Show OTP and newPassword inputs
      } else {
        notify("Email is incorrect or not valid", "error");
      }
    } catch (error) {
      console.error("Error during email check:", error);
      notify(
        error.response?.data?.message ||
          "Something went wrong, please try again",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle OTP verification and password reset
  const verifyOtpAndChangePassword = async (obj) => {
    const { email, otp, newPassword } = obj;

    if (!otp || !newPassword || !email) {
      notify("Please fill in all fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${apiUrl}api/v1/user/verifyOtp`,
        { email, otp, newPassword }
      );

      if (response.data.success) {
        notify("Password changed successfully!", "success");
        navigate("/login"); // Navigate to login page
      } else {
        notify("OTP is incorrect or expired", "error");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      notify(
        error.response?.data?.message ||
          "Something went wrong, please try again",
        "error"
      );
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
      if (!otpVisible) {
        // Send OTP if not visible
        checkData(data);
      } else {
        // Verify OTP and change password
        verifyOtpAndChangePassword(data);
      }
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

  return (
    <div className={styles.container}>
      <form
        className={styles.formLogin}
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2 style={{ fontSize: "30px" }}>Reset Password</h2>
        <div>
          <input
            type="text"
            name="email"
            value={data.email}
            placeholder="E-mail"
            onChange={changeHandler}
            onFocus={focusHandler}
            autoComplete="off"
            disabled={otpVisible} // Disable email field after OTP is sent
          />
        </div>

        {otpVisible && (
          <>
            <div>
              <input
                type="text"
                name="otp"
                value={data.otp}
                placeholder="Enter OTP"
                onChange={changeHandler}
                onFocus={focusHandler}
              />
            </div>
            <div>
              <input
                type="password"
                name="newPassword"
                value={data.newPassword}
                placeholder="New Password"
                onChange={changeHandler}
                onFocus={focusHandler}
              />
            </div>
          </>
        )}

        {/* reCAPTCHA component */}
        <div style={{ margin: "20px 0" }}>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaSuccess}
            onExpired={onRecaptchaExpired}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={!captchaValid}
            style={{
              fontSize: "20px",
              backgroundColor: captchaValid ? "#000" : "#ccc",
            }}
          >
            {isLoading
              ? otpVisible
                ? "Verifying OTP..."
                : "Sending OTP..."
              : otpVisible
              ? "Verify OTP"
              : "Get OTP"}
          </button>
          {isLoading && <div className={styles.spinner}></div>}
          <div className="flex flex-col">
            <span
              style={{
                color: "white",
                textAlign: "center",
                display: "inline-block",
                width: "100%",
                fontSize: "20px",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#e2f50c", fontSize: "20px" }}
              >
                Create account
              </Link>
            </span>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgetPass;
