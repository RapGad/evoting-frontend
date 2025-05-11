import React, { useState, useEffect } from "react";
import "./Login.css"; // We'll create this next
import Loading from "../loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [indexNumber, setIndexNumber] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [otp, setOtp] = useState("");
  const { loading, error, user, token } = useSelector(
    (state) => state.verifyOtp
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { indexNumber, otp };
    setLoginError(error);
    setTimeout(() => setLoginError(null), 3000);
    dispatch(verifyOtp(data));
  };

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
    setTimeout(() => setLoginError(null), 3000);
  }, [error]);

  return (
    <div className="login-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="login-card">
          <h1 className="login-title">Cast Your Vote</h1>
          <p className="login-subtitle">
            Sign in to access the e-voting system
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="indexNumbere">Index Number</label>
              <input
                type="text"
                id="indexNumber"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                placeholder="Enter your index Number"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">OTP</label>
              <input
                type="password"
                id="password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>
      )}
      <AnimatePresence>
        {loginError && (
          <motion.div
            className="error-notification"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="success-content">
              <span className="success-icon">⚠️</span>
              <p>{loginError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
