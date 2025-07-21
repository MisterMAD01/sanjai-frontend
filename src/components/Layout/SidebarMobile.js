import React, { useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./SidebarMobile.css";

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

const SidebarMobile = ({ role, isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const sidebarRef = useRef(null);

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeSidebar();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        e.target.closest(".mobile-menu-btn") === null
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`sm-sidebar-mobile ${isOpen ? "sm-open" : "sm-closed"}`}
    >
      <nav>
        <div>
          <p className="sm-section-title">เมนูหลัก</p>
          <button
            onClick={() => handleNavigate("/home")}
            className={`sm-button ${isActive("/home") ? "sm-active" : ""}`}
          >
            <FontAwesomeIcon icon={faHome} /> หน้าหลัก
          </button>

          {(role === "user" || role === "admin") && (
            <>
              <button
                onClick={() => handleNavigate("/my-documents")}
                className={`sm-button ${
                  isActive("/my-documents") ? "sm-active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faFileAlt} /> เอกสารของฉัน
              </button>
              <button
                onClick={() => handleNavigate("/my-member-info")}
                className={`sm-button ${
                  isActive("/my-member-info") ? "sm-active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUsers} /> ข้อมูลสมาชิกของฉัน
              </button>
              <button
                onClick={() => handleNavigate("/my-Activity")}
                className={`sm-button ${
                  isActive("/my-Activity") ? "sm-active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} /> กิจกรรมของฉัน
              </button>
            </>
          )}
        </div>

        {role === "admin" && (
          <div>
            <p className="sm-section-title">เมนูแอดมิน</p>
            <button
              onClick={() => handleNavigate("/manage-users")}
              className={`sm-button ${
                isActive("/manage-users") ? "sm-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUserCog} /> จัดการผู้ใช้
            </button>
            <button
              onClick={() => handleNavigate("/manage-members")}
              className={`sm-button ${
                isActive("/manage-members") ? "sm-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUsers} /> จัดการสมาชิก
            </button>
            <button
              onClick={() => handleNavigate("/manage-documents")}
              className={`sm-button ${
                isActive("/manage-documents") ? "sm-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} /> จัดการเอกสาร
            </button>
            <button
              onClick={() => handleNavigate("/manage-Activity")}
              className={`sm-button ${
                isActive("/manage-Activity") ? "sm-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> จัดการกิจกรรม
            </button>
            <button
              onClick={() => handleNavigate("/data-management")}
              className={`sm-button ${
                isActive("/data-management") ? "sm-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faDatabase} /> จัดการข้อมูล
            </button>
          </div>
        )}

        <div>
          <p className="sm-section-title">เมนูของฉัน</p>
          <button
            onClick={() => handleNavigate("/my-profile")}
            className={`sm-button ${
              isActive("/my-profile") ? "sm-active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faUserCircle} /> โปรไฟล์
          </button>
          <button
            onClick={() => handleNavigate("/settings")}
            className={`sm-button ${isActive("/settings") ? "sm-active" : ""}`}
          >
            <FontAwesomeIcon icon={faCog} /> การตั้งค่า
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SidebarMobile;
