// src/components/DataManagement.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faFileExport,
  faClock,
  faUsers,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import api from "../../api";
import ImportExcelModal from "./ImportExcelModal";
import "react-toastify/dist/ReactToastify.css";
import "./DataManagement.css";

export default function DataManagement() {
  const [filterOptions, setFilterOptions] = useState({
    districts: [],
    generations: [],
    memberTypes: [],
  });
  const [filters, setFilters] = useState({
    district: "",
    generation: "",
    memberType: "",
  });
  const [exportOptions, setExportOptions] = useState({
    members: false,
    users: false,
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLogs, setImportLogs] = useState([]);
  const [exportLogs, setExportLogs] = useState([]);
  const [summary, setSummary] = useState({ members: 0, users: 0 });

  // Load filter options and history on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [fRes, iRes, eRes] = await Promise.all([
          api.get("/api/data/filters"),
          api.get("/api/data/import-logs"),
          api.get("/api/data/export-logs"),
        ]);
        setFilterOptions(fRes.data);
        setImportLogs(iRes.data);
        setExportLogs(eRes.data);
      } catch (err) {
        console.error("Error loading data management info:", err);
        toast.error("ไม่สามารถโหลดข้อมูลตั้งต้นได้");
      }
    };
    load();
  }, []);

  // Fetch summary whenever filters change
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const res = await api.get(`/api/data/summary?${params}`);
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
        toast.error("ไม่สามารถโหลดสรุปข้อมูลได้");
      }
    };
    loadSummary();
  }, [filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleExportOption = (key) =>
    setExportOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  // Download one type of data
  const downloadFile = async (type) => {
    try {
      const params = new URLSearchParams({ type, ...filters }).toString();
      const res = await api.get(`/api/data/export?${params}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `${type}_export_${date}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // record in exportLogs
      const ts = new Date().toISOString();
      const newLog = {
        filename: `${type}_export_${ts.slice(0, 10)}.xlsx`,
        count: summary[type],
        created_at: ts,
      };
      setExportLogs((prev) => [newLog, ...prev]);
      toast.success(`ส่งออก ${type} สำเร็จ`);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("เกิดข้อผิดพลาดในการส่งออก");
    }
  };

  const handleExport = () => {
    const types = [];
    if (exportOptions.members) types.push("members");
    if (exportOptions.users) types.push("users");
    if (types.length === 0) {
      toast.info("กรุณาเลือกข้อมูลที่ต้องการส่งออก");
      return;
    }
    types.forEach(downloadFile);
  };

  const handleImportSuccess = (type, count) => {
    const ts = new Date().toISOString();
    const newLog = {
      filename: `import_${type}_${ts.slice(0, 10)}.xlsx`,
      count,
      created_at: ts,
    };
    setImportLogs((prev) => [newLog, ...prev]);
    setShowImportModal(false);
    toast.success(`นำเข้า ${type} สำเร็จ (${count} รายการ)`);
  };

  const clearImportLogs = () => setImportLogs([]);
  const clearExportLogs = () => setExportLogs([]);

  return (
    <div className="data-management-page">
      <h2 className="data-management-title">จัดการข้อมูล</h2>

      {/* Summary & Import */}
      <div className="summary-header">
        <div>
          <h3 className="summary-title">จำนวนข้อมูลทั้งหมด</h3>
          <div className="summary-cards">
            <div
              className={`card ${exportOptions.members ? "selected" : ""}`}
              onClick={() => toggleExportOption("members")}
            >
              <div className="card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="card-content">
                <div className="card-title">สมาชิกทั้งหมด</div>
                <div className="card-value">{summary.members}</div>
              </div>
            </div>
            <div
              className={`card ${exportOptions.users ? "selected" : ""}`}
              onClick={() => toggleExportOption("users")}
            >
              <div className="card-icon">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <div className="card-content">
                <div className="card-title">ผู้ใช้ทั้งหมด</div>
                <div className="card-value">{summary.users}</div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="data-btn import"
          onClick={() => setShowImportModal(true)}
        >
          <FontAwesomeIcon icon={faFileImport} /> นำเข้า Excel
        </button>
      </div>

      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label>อำเภอ:</label>
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange("district", e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {filterOptions.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>รุ่น:</label>
          <select
            value={filters.generation}
            onChange={(e) => handleFilterChange("generation", e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {filterOptions.generations.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>ประเภทสมาชิก:</label>
          <select
            value={filters.memberType}
            onChange={(e) => handleFilterChange("memberType", e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {filterOptions.memberTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="data-btn export" onClick={handleExport}>
        <FontAwesomeIcon icon={faFileExport} /> ส่งออกข้อมูลที่เลือก
      </button>

      {/* Logs */}
      <div className="log-section">
        <div className="log-header">
          <h3>
            <FontAwesomeIcon icon={faClock} /> ประวัติการนำเข้า
          </h3>
          <button className="data-btn clear" onClick={clearImportLogs}>
            เคลียร์ประวัติการนำเข้า
          </button>
        </div>
        {importLogs.length === 0 ? (
          <p className="log-empty">ยังไม่มีรายการนำเข้า</p>
        ) : (
          <ul className="log-list">
            {importLogs.map((log, i) => (
              <li key={i}>
                📥 {log.filename} — {log.count} รายการ —{" "}
                {new Date(log.created_at).toLocaleString("th-TH")}
              </li>
            ))}
          </ul>
        )}

        <div className="log-header" style={{ marginTop: 32 }}>
          <h3>
            <FontAwesomeIcon icon={faClock} /> ประวัติการส่งออก
          </h3>
          <button className="data-btn clear" onClick={clearExportLogs}>
            เคลียร์ประวัติการส่งออก
          </button>
        </div>
        {exportLogs.length === 0 ? (
          <p className="log-empty">ยังไม่มีรายการส่งออก</p>
        ) : (
          <ul className="log-list">
            {exportLogs.map((log, i) => (
              <li key={i}>
                📤 {log.filename} — {log.count} รายการ —{" "}
                {new Date(log.created_at).toLocaleString("th-TH")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
