import React, { useEffect, useState } from "react";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { validate } from "./validate"; // Assuming you have a validation utility

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

  // Handle reCAPTCHA verification success
  const onRecaptchaSuccess = () => {
    setCaptchaValid(true);
  };

  // Handle reCAPTCHA verification expiration
  const onRecaptchaExpired = () => {
    setCaptchaValid(false);
    notify("Captcha expired, please verify again", "error");
  };

  const submitHandler = async (event) => {
    event.preventDefault();
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
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/user",
        {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          password: data.password,
        }
      );

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
      if (error.response) {
        notify(
          error.response.data.message || "Server error. Please try again later.",
          "error"
        );
      } else {
        notify("Server error. Please try again later.", "error");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2 style={{ fontSize: "30px" }}>Sign Up</h2>

        {/* Full Name Input */}
        <div>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            placeholder="Full Name"
            onChange={changeHandler}
            onFocus={focusHandler}
            className={errors.fullName && touched.fullName ? styles.errorInput : ""}
          />
          {errors.fullName && touched.fullName && (
            <span className={styles.error}>{errors.fullName}</span>
          )}
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            value={data.email}
            placeholder="Email"
            onChange={changeHandler}
            onFocus={focusHandler}
            className={errors.email && touched.email ? styles.errorInput : ""}
          />
          {errors.email && touched.email && (
            <span className={styles.error}>{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
        <div style={{ position: "relative" }}>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={data.password}
            placeholder="Password"
            onChange={changeHandler}
            onFocus={focusHandler}
            style={{ paddingRight: "40px" }}
            className={errors.password && touched.password ? styles.errorInput : ""}
          />
          {errors.password && touched.password && (
            <span className={styles.error}>{errors.password}</span>
          )}

          {/* Toggle Password Visibility */}
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

        {/* reCAPTCHA */}
        <div style={{ margin: "20px 0" }}>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaSuccess}
            onExpired={onRecaptchaExpired}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={!captchaValid || Object.keys(errors).length > 0}
            style={{ fontSize: "20px", backgroundColor: "#000" }}
          >
            Create Account
          </button>
        </div>

        <span
          style={{
            color: "white",
            textAlign: "center",
            display: "inline-block",
            width: "100%",
            fontSize: "20px",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#e2f50c", fontSize: "20px" }}>
            Sign In
          </Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
