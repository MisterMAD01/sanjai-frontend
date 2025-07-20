import React, { useEffect, useState } from "react";
import api from "../../../api";
import ActivityList from "./ActivityList";
import EditActivityModal from "./EditActivityModal";
import ApplicantsModal from "./ApplicantsModal";
import DeleteActivityModal from "./DeleteActivityModal";
import "./ManageActivityPage.css";

const ITEMS_PER_PAGE = 4;

const ManageActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialFormData = {
    id: null,
    name: "",
    date: "",
    detail: "",
    location: "",
    schedule: null, // จะเก็บเป็น File หรือ URL string
    qr: null, // เช่นเดียวกัน
    register_open: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [applicants, setApplicants] = useState([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/activities");
      setActivities(res.data.activities || []);
    } catch (error) {
      alert("โหลดกิจกรรมไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentActivities = filteredActivities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchApplicants = async (activityId) => {
    try {
      const res = await api.get(
        `/api/admin/activities/${activityId}/applicants`
      );
      setApplicants(res.data || []);
      setSelectedActivityId(activityId);
      setShowApplicantsModal(true);
    } catch (error) {
      alert("โหลดผู้สมัครไม่สำเร็จ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.date ||
      !formData.detail ||
      !formData.location
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("date", formData.date);
    formPayload.append("detail", formData.detail);
    formPayload.append("location", formData.location);
    formPayload.append("register_open", formData.register_open);

    // ถ้า schedule เป็น File (ไฟล์ใหม่) ถึง append
    if (formData.schedule && typeof formData.schedule !== "string") {
      formPayload.append("schedule", formData.schedule);
    }
    // ถ้า qr เป็น File (ไฟล์ใหม่) ถึง append
    if (formData.qr && typeof formData.qr !== "string") {
      formPayload.append("qr", formData.qr);
    }

    try {
      if (formData.id) {
        await api.put(`/api/admin/activities/${formData.id}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("อัปเดตกิจกรรมสำเร็จ");
      } else {
        await api.post("/api/admin/activities", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("สร้างกิจกรรมสำเร็จ");
      }
      setFormData(initialFormData);
      setShowEditModal(false);
      fetchActivities();
      setCurrentPage(1);
      setSearchTerm("");
    } catch (error) {
      if (error.response?.data?.message?.includes("File too large")) {
        alert("ไฟล์ที่อัปโหลดมีขนาดใหญ่เกินไป (เกิน 5MB)");
      } else {
        alert("บันทึกกิจกรรมไม่สำเร็จ");
      }
    }
  };

  const getFullUrl = (filePath) => {
    if (!filePath) return "";
    // ถ้า filePath เป็น URL เต็ม (เช่นเริ่มด้วย http) ก็คืนค่าเดิมเลย
    if (filePath.startsWith("http")) return filePath;
    // ถ้าเป็น path relative ให้ต่อกับ baseURL ของ api
    return `${process.env.REACT_APP_API.replace(
      /\/$/,
      ""
    )}/uploads/${filePath}`;
  };

  const openEditModal = (activity = null) => {
    if (activity) {
      setFormData({
        id: activity.id,
        name: activity.name,
        date: activity.date ? activity.date.substring(0, 10) : "", // <-- แก้ตรงนี้
        detail: activity.detail,
        location: activity.location,
        schedule: getFullUrl(activity.image_path_schedule), // <-- เปลี่ยนชื่อฟิลด์ตรงนี้
        qr: getFullUrl(activity.image_path_qr), // <-- เปลี่ยนชื่อฟิลด์ตรงนี้
        register_open: activity.register_open,
      });
    } else {
      setFormData(initialFormData);
    }
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setFormData(initialFormData);
    setShowEditModal(false);
  };

  const toggleRegisterOpen = async (id, currentStatus) => {
    try {
      await api.patch(`/api/admin/activities/${id}/register_open`, {
        register_open: !currentStatus,
      });
      alert("เปลี่ยนสถานะรับสมัครสำเร็จ");
      fetchActivities();
    } catch (error) {
      alert("เปลี่ยนสถานะรับสมัครไม่สำเร็จ");
    }
  };

  const openDeleteModal = (id, name) => {
    setSelectedActivityId(id);
    setSelectedActivityName(name);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedActivityId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/activities/${selectedActivityId}`);
      alert("ลบกิจกรรมสำเร็จ");
      setActivities((prev) => prev.filter((a) => a.id !== selectedActivityId));
      setShowDeleteModal(false);
      setSelectedActivityId(null);
      setSelectedActivityName("");
    } catch (error) {
      alert("ลบกิจกรรมไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="activity-page">
      <h1>จัดการกิจกรรม</h1>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <button
          className="activity-btn create"
          onClick={() => openEditModal(null)}
          style={{ marginRight: 16 }}
        >
          สร้างกิจกรรมใหม่
        </button>

        <input
          type="text"
          placeholder="ค้นหาชื่อกิจกรรม..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "6px 10px",
            fontSize: 16,
            width: "100%", // เต็มพื้นที่พ่อ container
            maxWidth: "100%", // ไม่เกิน 100%
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <h2>กิจกรรมทั้งหมด</h2>

      {loading ? (
        <p>กำลังโหลดกิจกรรม...</p>
      ) : currentActivities.length === 0 ? (
        <p>ไม่มีข้อมูลกิจกรรม</p>
      ) : (
        <ActivityList
          activities={currentActivities}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onToggleRegister={toggleRegisterOpen}
          onViewApplicants={fetchApplicants}
        />
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </div>
      )}

      {showEditModal && (
        <EditActivityModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={closeEditModal}
        />
      )}

      {showApplicantsModal && (
        <ApplicantsModal
          applicants={applicants}
          onClose={() => setShowApplicantsModal(false)}
          activityId={selectedActivityId}
        />
      )}

      {showDeleteModal && (
        <DeleteActivityModal
          selectedActivityName={selectedActivityName}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default ManageActivityPage;
