import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/login";
import Home from "../pages/home";
import Profile from "../pages/user/MyProfileuser";
import MyMemberInfo from "../pages/user/MyMemberInfo"; // แก้ไขเส้นทางให้ถูกต้อง
import Settings from "../pages/SettingsPage"; // แก้ไขเส้นทางให้ถูกต้อง
import MyDocuments from "../pages/user/MyDocuments"; // แก้ไขเส้นทางให้ถูกต้อง

import ManageAccounts from "../pages/Admin/ManageAccounts";
import ManageMenber from "../pages/Admin/ManageMember";
import ManageDocuments from "../pages/Admin/ManageDocuments";
import DataManagement from "../pages/Admin/DataManagement";

import Layout from "../components/Layout/Layout"; // ย้าย Layout มาใช้ตรงนี้

const AppRoutes = () => (
  <Routes>
    {/* 🔓 ไม่ใช้ Layout */}
    <Route path="/login" element={<Login />} />

    {/* 🔐 เส้นทางที่ใช้ Layout ทุกหน้า */}
    <Route
      path="*"
      element={
        <Layout>
          <Routes>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-member-info"
              element={
                <ProtectedRoute>
                  <MyMemberInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-documents"
              element={
                <ProtectedRoute>
                  <MyDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <AdminRoute>
                  <ManageAccounts />
                </AdminRoute>
              }
            />
            <Route
              path="/data-management"
              element={
                <AdminRoute>
                  <DataManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-members"
              element={
                <AdminRoute>
                  <ManageMenber />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-documents"
              element={
                <AdminRoute>
                  <ManageDocuments />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      }
    />
  </Routes>
);

export default AppRoutes;
