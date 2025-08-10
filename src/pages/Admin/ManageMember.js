import React, { useState, useEffect, useContext } from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import AlertBanner from "../../components/common/AlertBanner";
import MemberFormModal from "../../components/Admin/managemembers/MemberFormModal";
import ImportExcelModal from "./ImportExcelModal";
import MemberTable from "../../components/Admin/managemembers/MemberTable";
import MemberViewModal from "../../components/Admin/managemembers/MemberViewModal";
import MemberEditModal from "../../components/Admin/managemembers/MemberEditModal";
import "react-toastify/dist/ReactToastify.css";
import "./ManageMember.css";

export default function ManageMember() {
  const { user: currentUser, loadingUser } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // ตัวกรอง dropdown
  const [filter, setFilter] = useState({
    district: "",
    graduation_year: "",
    type: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/members");
      setMembers(res.data || []);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) return <p className="loading">กำลังโหลดข้อมูลผู้ใช้...</p>;

  // หา unique ค่าของแต่ละฟิลด์สำหรับ dropdown
  const unique = (key) =>
    [
      ...new Set(
        members
          .map((m) => m[key])
          .filter((v) => v !== "" && v !== null && v !== undefined)
      ),
    ].sort();

  // กรองตาม searchTerm
  const searched = members.filter((m) => {
    const txt = `${m.full_name || ""} ${m.member_id || ""}`.toLowerCase();
    return txt.includes(searchTerm.toLowerCase());
  });

  // ตัดตัวเองออก
  const myId = (currentUser.member_id || currentUser.memberId || "").toString();
  const notSelf = searched.filter((m) => m.member_id.toString() !== myId);

  // ฟังก์ชันกรองค่า
  const matchFilter = (memberValue, filterValue) => {
    if (filterValue === "") return true;
    if (filterValue === "__NONE__") {
      return !memberValue || memberValue === "";
    }
    return memberValue === filterValue;
  };

  // กรองตาม dropdown filters
  const filtered = notSelf.filter((m) => {
    const matchDistrict = matchFilter(m.district, filter.district);
    const matchYear = matchFilter(
      m.graduation_year !== null && m.graduation_year !== undefined
        ? String(m.graduation_year)
        : "",
      filter.graduation_year
    );
    const matchType = matchFilter(m.type, filter.type);
    return matchDistrict && matchYear && matchType;
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/members/${id}`);
      setAlert({ type: "success", message: "ลบสมาชิกสำเร็จ" });
      fetchMembers();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        "ไม่สามารถลบสมาชิกได้ กรุณาลองใหม่อีกครั้ง";
      setAlert({ type: "error", message: msg });
    }
  };

  return (
    <div className="manage-member-page">
      <AlertBanner
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <h2 className="manage-member-title">จัดการสมาชิก</h2>
      <div className="manage-member-card">
        <div className="controls-row">
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาสมาชิก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="button-group">
            <button
              className="action-button add-member"
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} /> เพิ่มสมาชิก
            </button>
          </div>
        </div>
        <div className="filters-row">
          <div className="filter-item">
            <label>
              <strong>อำเภอ: </strong>
              <select
                value={filter.district}
                onChange={(e) =>
                  setFilter({ ...filter, district: e.target.value })
                }
              >
                <option value="">-- ทุกอำเภอ --</option>
                <option value="__NONE__">-- ไม่ระบุ --</option>
                {unique("district").map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-item">
            <label>
              <strong>รุ่น: </strong>
              <select
                value={filter.graduation_year}
                onChange={(e) =>
                  setFilter({ ...filter, graduation_year: e.target.value })
                }
              >
                <option value="">-- ทุกรุ่น --</option>
                <option value="__NONE__">-- ไม่ระบุ --</option>
                {unique("graduation_year")
                  .map(String)
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="filter-item">
            <label>
              <strong>ประเภท: </strong>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              >
                <option value="">-- ทุกประเภท --</option>
                <option value="__NONE__">-- ไม่ระบุ --</option>
                {unique("type").map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <MemberTable
            members={filtered}
            onView={(m) => {
              setSelectedMember(m);
              setShowViewModal(true);
            }}
            onEdit={(m) => {
              setSelectedMember(m);
              setShowEditModal(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showAddModal && (
        <MemberFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setAlert({ type: "success", message: "เพิ่มสมาชิกสำเร็จ" });
            fetchMembers();
          }}
        />
      )}
      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onSuccess={(count) => {
            setShowImportModal(false);
            setAlert({
              type: "success",
              message: `นำเข้า ${count} รายการสำเร็จ`,
            });
            fetchMembers();
          }}
        />
      )}
      {showViewModal && selectedMember && (
        <MemberViewModal
          member={selectedMember}
          onClose={() => setShowViewModal(false)}
          onEdit={(m) => {
            setShowViewModal(false);
            setSelectedMember(m);
            setShowEditModal(true);
          }}
        />
      )}

      {showEditModal && selectedMember && (
        <MemberEditModal
          member={selectedMember}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            setAlert({ type: "success", message: "แก้ไขสมาชิกสำเร็จ" });
            fetchMembers();
          }}
        />
      )}
    </div>
  );
}
