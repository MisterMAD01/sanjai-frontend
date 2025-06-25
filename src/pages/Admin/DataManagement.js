// src/components/DataManagement.js
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLogs, setImportLogs] = useState([]);
  const [exportLogs, setExportLogs] = useState([]);
  const [summary, setSummary] = useState({ members: 0, users: 0 });

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

  const downloadFile = async () => {
    try {
      const params = new URLSearchParams({
        type: "members",
        ...filters,
      }).toString();
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
      const filename = `members_and_users_export_${date}.xlsx`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      const ts = new Date().toISOString();
      const newLog = {
        filename,
        count: summary.members + summary.users,
        performed_by: "คุณ",
        created_at: ts,
      };
      setExportLogs((prev) => [newLog, ...prev]);
      toast.success("ส่งออกสำเร็จ");

      await api.post("/api/data/log-export", {
        filename,
        count: newLog.count,
        performed_by: newLog.performed_by,
      });
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("เกิดข้อผิดพลาดในการส่งออก");
    }
  };

  const handleImportSuccess = (type, count) => {
    const ts = new Date().toISOString();
    const newLog = {
      filename: `import_${type}_${ts.slice(0, 10)}.xlsx`,
      count,
      performed_by: "คุณ",
      created_at: ts,
    };
    setImportLogs((prev) => [newLog, ...prev]);
    setShowImportModal(false);
    toast.success(`นำเข้าสำเร็จ (${count} รายการ)`);
  };

  return (
    <div className="data-management-page">
      <h2 className="data-management-title">จัดการข้อมูล</h2>

      <div className="summary-header">
        <div>
          <h3 className="summary-title">จำนวนข้อมูลทั้งหมด</h3>
          <div className="summary-cards">
            <div className="card">
              <div className="card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="card-content">
                <div className="card-title">สมาชิกทั้งหมด</div>
                <div className="card-value">{summary.members}</div>
              </div>
            </div>
            <div className="card">
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

      <button className="data-btn export" onClick={downloadFile}>
        <FontAwesomeIcon icon={faFileExport} /> ส่งออกข้อมูล
      </button>

      <div className="log-section">
        <div className="log-header">
          <h3>
            <FontAwesomeIcon icon={faClock} /> ประวัติการนำเข้า
          </h3>
        </div>
        {importLogs.length === 0 ? (
          <p className="log-empty">ยังไม่มีรายการนำเข้า</p>
        ) : (
          <ul className="log-list">
            {importLogs.map((log, i) => (
              <li key={i}>
                📥 นำเข้าโดย <strong>{log.performed_by}</strong> — {log.count}{" "}
                รายการ — {new Date(log.created_at).toLocaleString("th-TH")}
              </li>
            ))}
          </ul>
        )}

        <div className="log-header" style={{ marginTop: 32 }}>
          <h3>
            <FontAwesomeIcon icon={faClock} /> ประวัติการส่งออก
          </h3>
        </div>
        {exportLogs.length === 0 ? (
          <p className="log-empty">ยังไม่มีรายการส่งออก</p>
        ) : (
          <ul className="log-list">
            {exportLogs.map((log, i) => (
              <li key={i}>
                📤 ส่งออกโดย <strong>{log.performed_by}</strong> — {log.count}{" "}
                รายการ — {new Date(log.created_at).toLocaleString("th-TH")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
