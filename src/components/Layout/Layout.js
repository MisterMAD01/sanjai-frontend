import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

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

  // หน้าเหล่านี้ไม่แสดง Sidebar
  const excludedPaths = ["/", "/login"];
  const showSidebar = !excludedPaths.includes(location.pathname);

  return (
    <div className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {showSidebar && <Sidebar role={userRole} collapsed={collapsed} />}
      <div className="layout-main">
        {/* ไม่มี TopHeader */}
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
