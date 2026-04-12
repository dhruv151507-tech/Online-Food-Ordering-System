import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER", // default role
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const response = await register(formData);
    if (response.success) {
      setStep("verify");
      setMessage(
        response.message ||
          "Registration successful. Enter the OTP sent to your email.",
      );
      setResendCountdown(30);
      setLoading(false);
    } else {
      setError(
        response.message || "Registration failed. Username may be taken.",
      );
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const response = await verifyOtp({ username: formData.username, otp });
    if (response.success) {
      setMessage("OTP verified successfully! Redirecting to login...");
      setLoading(false);
      navigate("/login");
    } else {
      setError(response.message || "OTP verification failed.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    const response = await resendOtp(formData.username);
    if (response.success) {
      setMessage(response.message || "New OTP sent successfully!");
      setResendCountdown(30);
      setLoading(false);
    } else {
      setError(response.message || "Failed to resend OTP.");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card animate-fade-in"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center flex items-center justify-center gap-2">
          <UserPlus /> Create Account
        </h2>
        <p className="text-center text-muted mb-4">
          Join us and start ordering delicious food
        </p>

        {message && (
          <div className="badge badge-success text-center mb-4 p-2">
            {message}
          </div>
        )}
        {error && (
          <div className="badge badge-primary text-center mb-4 p-2">
            {error}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email (Username)</label>
              <input
                type="email"
                className="form-control"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="Create a strong password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="USER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter the 6-digit code"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
            <div className="text-center mt-3 text-muted text-sm">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || loading}
                className="btn-link"
                style={{
                  color: resendCountdown > 0 ? "#999" : "var(--primary)",
                  cursor: resendCountdown > 0 ? "not-allowed" : "pointer",
                }}
              >
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4 text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
