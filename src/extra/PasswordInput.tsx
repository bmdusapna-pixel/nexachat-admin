"use client";
import React, { useState } from "react";

interface PasswordInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Enter your Password",
  value,
  placeholder = "Enter your password",
  onChange,
  onKeyDown,
  error,
  name = "password",
  className = "",
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`form-group ${className}`} style={{ position: "relative" }}>
      {label && <label className="mt-2">{label}</label>}
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={value || ""}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          style={{ paddingRight: "40px", width: "100%" }}
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="showpassword"
          style={{
            position: "absolute",
            top: "60%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "18px",
            color: "#aaa",
          }}
        >
          {showPassword ? (
            <i className="fa-solid fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </span>
      </div>
      {error && (
        <span className="text-danger" style={{ fontSize: "12px" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
