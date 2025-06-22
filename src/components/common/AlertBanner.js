// src/components/common/AlertBanner.jsx
import React from "react";
import PropTypes from "prop-types";
import "./AlertBanner.css";

export default function AlertBanner({ type, message, onClose }) {
  if (!message) return null;
  return (
    <div className={`ab-banner ab-${type}`}>
      <span>{message}</span>
      <button className="ab-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

AlertBanner.propTypes = {
  type: PropTypes.oneOf(["success", "error", "info"]),
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
