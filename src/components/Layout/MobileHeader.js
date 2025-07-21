import React, { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import LogoImg from "../../assets/picture/LOGO.png";
import "./MobileHeader.css";

const MobileHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    // redirect handled by parent/router
  };

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="mobile-header">
      <button
        className="mobile-menu-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <div className="mobile-header-title">
        <img src={LogoImg} alt="Logo" className="mobile-logo" />
        <span>สมาคมเยาวชนสานใจไทย</span>
      </div>

      <div className="mobile-profile" ref={dropdownRef}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="mobile-profile-avatar"
            onClick={toggleDropdown}
          />
        ) : (
          <div className="mobile-profile-initial" onClick={toggleDropdown}>
            {user?.full_name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        {dropdownOpen && (
          <div className="mobile-profile-dropdown">
            <button onClick={() => (window.location.href = "/my-profile")}>
              โปรไฟล์
            </button>
            <button onClick={() => (window.location.href = "/settings")}>
              การตั้งค่า
            </button>
            <button onClick={handleLogout}>ออกจากระบบ</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
