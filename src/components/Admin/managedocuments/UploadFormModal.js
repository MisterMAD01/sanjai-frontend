import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./UploadFormModal.css";

const UploadFormModal = ({ onClose, onSubmit, members = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState({
    district: "",
    graduation_year: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const unique = (key) => [
    ...new Set(members.map((m) => m[key]).filter(Boolean)),
  ];

  // combined search + filter
  const filtered = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.full_name.toLowerCase().includes(term) ||
      m.member_id.toString().toLowerCase().includes(term);
    const matchDistrict = filter.district
      ? m.district === filter.district
      : true;
    const matchGeneration = filter.graduation_year
      ? String(m.graduation_year) === filter.graduation_year
      : true;
    const matchType = filter.type ? m.type === filter.type : true;
    return matchesSearch && matchDistrict && matchGeneration && matchType;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(filtered.map((m) => m.member_id));
  const clearAll = () => setSelectedIds([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("recipientId", id);
      onSubmit(formData);
    });

    onClose();
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <h3>อัปโหลดเอกสาร</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ชื่อเอกสาร"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="รายละเอียดเอกสาร (ถ้ามี)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <div className="filter-row">
            <select
              value={filter.district}
              onChange={(e) =>
                setFilter({ ...filter, district: e.target.value })
              }
            >
              <option value="">-- ทุกอำเภอ --</option>
              {unique("district").map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={filter.graduation_year}
              onChange={(e) =>
                setFilter({ ...filter, graduation_year: e.target.value })
              }
            >
              <option value="">-- ทุกรุ่น --</option>
              {unique("graduation_year").map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">-- ทุกประเภท --</option>
              {unique("type").map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box under filters */}
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ เลขที่สมาชิก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="upload-search"
          />

          <div className="select-controls">
            <button type="button" onClick={selectAll}>
              เลือกทั้งหมด
            </button>
            <button type="button" onClick={clearAll}>
              ยกเลิกทั้งหมด
            </button>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              เลือกแล้ว {selectedIds.length} รายชื่อ
            </span>
          </div>

          <div className="member-table-scroll">
            <table className="member-checkbox-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ชื่อ</th>
                  <th>อำเภอ</th>
                  <th>รุ่น</th>
                  <th>ประเภท</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.member_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(m.member_id)}
                        onChange={() => toggleSelect(m.member_id)}
                      />
                    </td>
                    <td>{m.full_name}</td>
                    <td>{m.district || "-"}</td>
                    <td>{m.graduation_year || "-"}</td>
                    <td>{m.type || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-buttons">
            <button type="submit">ส่ง</button>
            <button type="button" onClick={onClose}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UploadFormModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      full_name: PropTypes.string,
      district: PropTypes.string,
      graduation_year: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      type: PropTypes.string,
    })
  ),
};

export default UploadFormModal;
