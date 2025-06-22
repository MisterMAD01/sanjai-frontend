import React, { useState } from "react";
import "./UploadFormModal.css";

const UploadFormModal = ({ onClose, onSubmit, members = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // 🔸 รายละเอียด
  const [file, setFile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState({
    district: "",
    generation: "",
    type: "",
  });

  const unique = (key) => [
    ...new Set(members.map((m) => m[key]).filter(Boolean)),
  ];

  const filtered = members.filter((m) => {
    const matchDistrict = filter.district
      ? m.district === filter.district
      : true;
    const matchGeneration = filter.generation
      ? m.generation === filter.generation
      : true;
    const matchType = filter.type ? m.type === filter.type : true;
    return matchDistrict && matchGeneration && matchType;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = filtered.map((m) => m.member_id);
    setSelectedIds(allIds);
  };

  const clearAll = () => setSelectedIds([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // ✅ ส่งรายละเอียด
      formData.append("file", file);
      formData.append("memberId", id);
      onSubmit(formData);
    });

    onClose();
  };

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <h3>อัปโหลดเอกสาร</h3>
        <form onSubmit={handleSubmit}>
          {/* 🔹 ชื่อเอกสาร */}
          <input
            type="text"
            placeholder="ชื่อเอกสาร"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 🔹 รายละเอียด */}
          <textarea
            placeholder="รายละเอียดเอกสาร (ถ้ามี)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* 🔹 ไฟล์ */}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          {/* 🔹 ฟิลเตอร์ */}
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
              value={filter.generation}
              onChange={(e) =>
                setFilter({ ...filter, generation: e.target.value })
              }
            >
              <option value="">-- ทุกรุ่น --</option>
              {unique("generation").map((v) => (
                <option key={v} value={v}>
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

          {/* 🔹 ปุ่มควบคุมการเลือก */}
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

          {/* 🔹 ตารางสมาชิก */}
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
                    <td>{m.generation || "-"}</td>
                    <td>{m.type || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 ปุ่มส่ง */}
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

export default UploadFormModal;
