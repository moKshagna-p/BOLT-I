import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import loginSignupVideo from '../loginsignup.mp4';
import { User, Lock, LogIn, UserPlus } from 'lucide-react';

const Card = styled(motion.div)`
  background: rgba(18, 18, 18, 0.85);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px);
  border-radius: 2rem;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const Toggle = styled.div`
  display: flex;
  background: rgba(139, 92, 246, 0.08);
  border-radius: 9999px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.75rem 0;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#fff" : "#a78bfa")};
  background: ${({ $active }) =>
    $active
      ? "#7c3aed"
      : "transparent"};
  transition: background 0.2s, color 0.2s;
  border: none;
  outline: none;
  cursor: pointer;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.1rem 1rem 0.5rem 1rem;
  background: rgba(0,0,0,0.25);
  border: 1.5px solid rgba(139, 92, 246, 0.18);
  border-radius: 1rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #a78bfa;
  }
`;

const Label = styled.label<{ $active?: boolean }>`
  position: absolute;
  left: 1rem;
  top: ${({ $active }) => ($active ? "0.5rem" : "1.1rem")};
  font-size: ${({ $active }) => ($active ? "0.85rem" : "1rem")};
  color: #a78bfa;
  pointer-events: none;
  transition: all 0.2s;
  background: transparent;
`;

const GradientButton = styled.button`
  width: 100%;
  padding: 0.85rem 0;
  background: #7c3aed;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(139, 92, 246, 0.18);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, opacity 0.2s;
  &:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 16px 0 rgba(124, 58, 237, 0.18);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fields, setFields] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focus, setFocus] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus({ ...focus, [e.target.name]: true });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus({ ...focus, [e.target.name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!fields.email || !fields.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (mode === "signup" && fields.password !== fields.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: fields.email,
          password: fields.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.removeItem('startupDetails');
      localStorage.removeItem('investorDetails');

      // Navigate based on action type
      if (mode === "signup") {
        navigate("/role-selection");
      } else {
        sessionStorage.setItem('showUpgradeModal', '1');
        navigate("/analytics");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src={loginSignupVideo}
      />
      {/* Dark purple tint overlay for readability */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{
        background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)',
        opacity: 0.85,
        mixBlendMode: 'multiply',
        backdropFilter: 'blur(2px)'
      }} />
      {/* Subtle overlay for depth (optional, like ResourcesPage) */}
      <div className="absolute inset-0 bg-[#121212]/50 backdrop-blur-[1px] pointer-events-none z-20" />
      <div className="relative z-30 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-4 mt-4">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-500 rounded-full p-3 shadow-lg mb-2">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent font-poppins drop-shadow-lg tracking-tight">PitchNest</h1>
          <p className="text-lg text-purple-200/90 font-medium text-center mb-2 font-poppins">Welcome to the future of startup & investor connections</p>
        </div>
        {/* Remove Card, place form elements directly */}
        <div className="w-full flex flex-col items-center px-2">
          <Toggle style={{ boxShadow: '0 2px 8px 0 rgba(139, 92, 246, 0.10)' }}>
            <ToggleButton $active={mode === "login"} onClick={() => setMode("login")}
              style={{ transition: 'all 0.3s', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
              <LogIn className="inline-block mr-2 w-5 h-5 align-text-bottom" />Login
            </ToggleButton>
            <ToggleButton $active={mode === "signup"} onClick={() => setMode("signup")}
              style={{ transition: 'all 0.3s', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
              <UserPlus className="inline-block mr-2 w-5 h-5 align-text-bottom" />Sign Up
            </ToggleButton>
          </Toggle>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm w-full max-w-md"
            >
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 mt-2">
            <InputGroup>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
                <User className="w-5 h-5" />
              </span>
              <Input
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                disabled={loading}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Label $active={focus.email || fields.email !== ""}>Email</Label>
            </InputGroup>
            <InputGroup>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
                <Lock className="w-5 h-5" />
              </span>
              <Input
                name="password"
                type="password"
                value={fields.password}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                disabled={loading}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Label $active={focus.password || fields.password !== ""}>Password</Label>
            </InputGroup>
            {mode === "signup" && (
              <InputGroup>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
                  <Lock className="w-5 h-5" />
                </span>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  disabled={loading}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Label $active={focus.confirmPassword || fields.confirmPassword !== ""}>Confirm Password</Label>
              </InputGroup>
            )}
            <GradientButton type="submit" disabled={loading} className="flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span>Loading...</span>
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-5 h-5" /> Login
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Sign Up
                </>
              )}
            </GradientButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage; 