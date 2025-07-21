import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import MobileHeader from "./MobileHeader";
import SidebarMobile from "../Layout/SidebarMobile";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
      }
    }
  }, []);

  const excludedPaths = ["/", "/login"];
  const showSidebar = !excludedPaths.includes(location.pathname);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {showSidebar && (
        <>
          {/* MobileHeader จะมีปุ่มเปิดปิดเมนูมือถือ */}
          <MobileHeader onToggleSidebar={toggleMobileSidebar} />

          {/* Sidebar สำหรับ desktop */}
          <Sidebar
            role={userRole}
            collapsed={collapsed}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          {/* SidebarMobile สำหรับมือถือ */}
          <SidebarMobile
            role={userRole}
            isOpen={isMobileSidebarOpen}
            setIsOpen={setIsMobileSidebarOpen}
          />
        </>
      )}

      <div
        className="layout-main"
        style={{ marginTop: showSidebar ? "50px" : 0 }}
      >
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
