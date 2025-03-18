import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Cookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA

const Login = ({ setUser }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false); // Manage captcha state
  const navigate = useNavigate();

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
        "https://backend-music-xg6e.onrender.com/api/v1/auth/login",
        {
          email: email.toLowerCase(),
          password,
        }
      );

      console.log("Response from server:", response);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const cookies = new Cookies();
        cookies.set("user", response.data.user, {
          path: "/",
          maxAge: 1 * 24 * 60 * 60,
        });
        setUser(response.data.user);

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
          "error"
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
    } else {
      notify("Please complete the captcha verification", "error");
    }
  };

  // Handle reCAPTCHA verification success
  const onRecaptchaSuccess = (token) => {
    setCaptchaValid(true);
  };

  // Handle reCAPTCHA verification expiration
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
        <h2 style={{ fontSize: "30px" }}>Sign In</h2>
        <div>
          <input
            type="text"
            name="email"
            value={data.email}
            placeholder="E-mail"
            onChange={changeHandler}
            onFocus={focusHandler}
            autoComplete="off"
          />
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={data.password}
            placeholder="Password"
            onChange={changeHandler}
            onFocus={focusHandler}
            style={{ paddingRight: "40px" }}
          />

          <div
            onClick={() => setPasswordVisible(!passwordVisible)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "20px",
              color: "#3bc8e7",
            }}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

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
            disabled={!captchaValid} // Disable the button until captcha is valid
            style={{
              fontSize: "20px",
              backgroundColor: captchaValid ? "#000" : "#ccc",
            }}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
          {isLoading && <div className={styles.spinner}></div>}
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
            <Link to="/register" style={{ color: "#e2f50c", fontSize: "20px" }}>
              Create account
            </Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
