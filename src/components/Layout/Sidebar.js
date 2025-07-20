// src/components/Layout/Sidebar.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./Sidebar.css";
import LogoImg from "../../assets/picture/LOGO.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserCog,
  faUsers,
  faFileAlt,
  faUserCircle,
  faDatabase,
  faCog,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ role, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleMobileSidebar = () => {
    setIsMobileOpen((open) => !open);
  };

  const handleClose = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  // ปิด sidebar เมื่อคลิกนอกพื้นที่ (เฉพาะมือถือ/iPad)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        e.target.closest(".mobile-toggle-btn") === null
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const isActive = (path) => location.pathname.startsWith(path);
  const getInitial = (name) =>
    name ? name.trim().charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          isMobileOpen ? "open" : ""
        }`}
      >
        {/* Logo & Site Name */}
        <div className="sidebar-logo-section">
          <img src={LogoImg} alt="Logo" className="sidebar-logo-img" />
          {!collapsed && (
            <span className="sidebar-site-name">
              สมาคมเยาวชนสานใจไทย
              <br />
              สู่ใจใต้ จังหวัดนราธิวาส
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {/* Main Menu */}
          <div className="sidebar-menu-group">
            {!collapsed && <p className="section-title11">เมนูหลัก</p>}

            <button
              onClick={() => handleNavigate("/home")}
              className={isActive("/home") ? "active" : ""}
              title="หน้าหลัก"
            >
              <FontAwesomeIcon icon={faHome} />
              {!collapsed && "หน้าหลัก"}
            </button>

            {(role === "user" || role === "admin") && (
              <>
                <button
                  onClick={() => handleNavigate("/my-documents")}
                  className={isActive("/my-documents") ? "active" : ""}
                  title="เอกสารของฉัน"
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  {!collapsed && "เอกสารของฉัน"}
                </button>
                <button
                  onClick={() => handleNavigate("/my-member-info")}
                  className={isActive("/my-member-info") ? "active" : ""}
                  title="ข้อมูลสมาชิกของฉัน"
                >
                  <FontAwesomeIcon icon={faUsers} />
                  {!collapsed && "ข้อมูลสมาชิกของฉัน"}
                </button>
                <button
                  onClick={() => handleNavigate("/my-Activity")}
                  className={isActive("/my-Activity") ? "active" : ""}
                  title="ข้อมูลสมาชิกของฉัน"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {!collapsed && "กิจกรรมของฉัน"}
                </button>
              </>
            )}
          </div>

          {/* Admin Menu */}
          {role === "admin" && (
            <div className="sidebar-menu-group">
              {!collapsed && <p className="section-title11">เมนูแอดมิน</p>}

              <button
                onClick={() => handleNavigate("/manage-users")}
                className={isActive("/manage-users") ? "active" : ""}
                title="จัดการผู้ใช้"
              >
                <FontAwesomeIcon icon={faUserCog} />
                {!collapsed && "จัดการผู้ใช้"}
              </button>

              <button
                onClick={() => handleNavigate("/manage-members")}
                className={isActive("/manage-members") ? "active" : ""}
                title="จัดการสมาชิก"
              >
                <FontAwesomeIcon icon={faUsers} />
                {!collapsed && "จัดการสมาชิก"}
              </button>

              <button
                onClick={() => handleNavigate("/manage-documents")}
                className={isActive("/manage-documents") ? "active" : ""}
                title="จัดการเอกสาร"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                {!collapsed && "จัดการเอกสาร"}
              </button>
              <button
                onClick={() => handleNavigate("/manage-Activity")}
                className={isActive("/manage-Activity") ? "active" : ""}
                title="จัดการกิจกรรม"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {!collapsed && "จัดการกิจกรรม"}
              </button>
              <button
                onClick={() => handleNavigate("/data-management")}
                className={isActive("/data-management") ? "active" : ""}
                title="จัดการข้อมูล"
              >
                <FontAwesomeIcon icon={faDatabase} />
                {!collapsed && "จัดการข้อมูล"}
              </button>
            </div>
          )}

          {/* My Menu */}
          <div className="sidebar-menu-group">
            {!collapsed && <p className="section-title11">เมนูของฉัน</p>}

            <button
              onClick={() => handleNavigate("/my-profile")}
              className={isActive("/my-profile") ? "active" : ""}
              title="โปรไฟล์"
            >
              <FontAwesomeIcon icon={faUserCircle} />
              {!collapsed && "โปรไฟล์"}
            </button>
            <button
              onClick={() => handleNavigate("/settings")}
              className={isActive("/settings") ? "active" : ""}
              title="การตั้งค่า"
            >
              <FontAwesomeIcon icon={faCog} />
              {!collapsed && "การตั้งค่า"}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="sidebar-footer-avatar"
            />
          ) : (
            <div className="sidebar-footer-avatar-initial">
              {getInitial(user?.full_name)}
            </div>
          )}
          {!collapsed && (
            <div className="sidebar-footer-info">
              <span className="sidebar-footer-name">
                {user?.full_name || "ผู้ใช้"}
              </span>
              <button className="sidebar-logout-btn" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
