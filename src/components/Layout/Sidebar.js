import React, { useState, useContext } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ role, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const isActive = (path) => location.pathname.startsWith(path);
  const getInitial = (name) =>
    name ? name.trim().charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="mobile-toggle-btn" onClick={toggleMobileSidebar}>
        {isMobileOpen ? "<" : ">"}
      </div>

      <div
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

        {/* Main Menu */}
        <nav className="sidebar-menu">
          <div className="sidebar-menu-group">
            {!collapsed && <p className="section-title11">เมนูหลัก</p>}

            <button
              onClick={() => navigate("/home")}
              className={isActive("/home") ? "active" : ""}
              title="หน้าหลัก"
            >
              <FontAwesomeIcon icon={faHome} />
              {!collapsed && "หน้าหลัก"}
            </button>

            {role === "user" && (
              <>
                <button
                  onClick={() => navigate("/my-documents")}
                  className={isActive("/my-documents") ? "active" : ""}
                  title="เอกสารของฉัน"
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  {!collapsed && " เอกสารของฉัน"}
                </button>
                <button
                  onClick={() => navigate("/my-member-info")}
                  className={isActive("/my-member-info") ? "active" : ""}
                  title="ข้อมูลสมาชิกของฉัน"
                >
                  <FontAwesomeIcon icon={faUsers} />
                  {!collapsed && "ข้อมูลสมาชิกของฉัน"}
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/manage-users")}
                  className={isActive("/manage-users") ? "active" : ""}
                  title="จัดการผู้ใช้"
                >
                  <FontAwesomeIcon icon={faUserCog} />
                  {!collapsed && "จัดการผู้ใช้"}
                </button>
                <button
                  onClick={() => navigate("/manage-members")}
                  className={isActive("/manage-members") ? "active" : ""}
                  title="จัดการสมาชิก"
                >
                  <FontAwesomeIcon icon={faUsers} />
                  {!collapsed && "จัดการสมาชิก"}
                </button>
                <button
                  onClick={() => navigate("/manage-documents")}
                  className={isActive("/manage-documents") ? "active" : ""}
                  title="จัดการเอกสาร"
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  {!collapsed && "จัดการเอกสาร"}
                </button>
                <button
                  onClick={() => navigate("/data-management")}
                  className={isActive("/data-management") ? "active" : ""}
                  title="จัดการข้อมูล"
                >
                  <FontAwesomeIcon icon={faDatabase} />
                  {!collapsed && "จัดการข้อมูล"}
                </button>
              </>
            )}
          </div>

          {/* My Menu */}
          <div className="sidebar-menu-group">
            {!collapsed && <p className="section-title11">เมนูของฉัน</p>}

            <button
              onClick={() => navigate("/my-profile")}
              className={isActive("/my-profile") ? "active" : ""}
              title="โปรไฟล์"
            >
              <FontAwesomeIcon icon={faUserCircle} />
              {!collapsed && "โปรไฟล์"}
            </button>
            <button
              onClick={() => navigate("/settings")}
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
