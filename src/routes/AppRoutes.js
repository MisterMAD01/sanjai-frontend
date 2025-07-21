// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/login";
import Home from "../pages/home";
import Profile from "../pages/user/MyProfileuser";
import MyMemberInfo from "../pages/user/MyMemberInfo";
import Settings from "../pages/SettingsPage";
import MyDocuments from "../pages/user/MyDocuments";
import MyActivity from "../pages/user/MyActivity/MyActivityPage";

import ManageAccounts from "../pages/Admin/ManageAccounts";
import ManageMember from "../pages/Admin/ManageMember";
import ManageDocuments from "../pages/Admin/ManageDocuments";
import DataManagement from "../pages/Admin/DataManagement";
import ManageActivity from "../pages/Admin/ManageActivity/ManageActivityPage";

import Layout from "../components/Layout/Layout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected & Layout-wrapped routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Redirect “/” → “/home” */}
                <Route index element={<Navigate to="/home" replace />} />

                <Route path="home" element={<Home />} />
                <Route path="my-profile" element={<Profile />} />
                <Route path="my-member-info" element={<MyMemberInfo />} />
                <Route path="settings" element={<Settings />} />
                <Route path="my-documents" element={<MyDocuments />} />
                <Route path="my-activity" element={<MyActivity />} />

                {/* Admin-only */}
                <Route
                  path="manage-users"
                  element={
                    <AdminRoute>
                      <ManageAccounts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="data-management"
                  element={
                    <AdminRoute>
                      <DataManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="manage-members"
                  element={
                    <AdminRoute>
                      <ManageMember />
                    </AdminRoute>
                  }
                />
                <Route
                  path="manage-documents"
                  element={
                    <AdminRoute>
                      <ManageDocuments />
                    </AdminRoute>
                  }
                />
                <Route
                  path="manage-activity"
                  element={
                    <AdminRoute>
                      <ManageActivity />
                    </AdminRoute>
                  }
                />

                {/* Catch-all for authenticated users → home */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback for any other route → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
