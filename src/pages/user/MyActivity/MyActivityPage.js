import React, { useEffect, useState, useContext } from "react";
import api from "../../../api";
import { UserContext } from "../../../contexts/UserContext";
import { toast } from "react-toastify";
import "./MyActivityPage.css";

const MyActivityPage = () => {
  const { user, accessToken, loadingUser } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [registeredActivityIds, setRegisteredActivityIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "schedule" or "qr"
  const [modalActivity, setModalActivity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ดึงกิจกรรมที่เปิดรับสมัคร
        const resActivities = await api.get("/api/user/activities", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setActivities(resActivities.data || []);

        // ดึงกิจกรรมที่ user สมัครแล้ว
        const resRegistered = await api.get(
          "/api/user/activities/applications",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const registeredIds = (resRegistered.data || []).map(
          (item) => item.activity_id
        );
        setRegisteredActivityIds(registeredIds);
      } catch (error) {
        toast.error("โหลดข้อมูลกิจกรรมไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const handleRegister = async (activityId) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนลงทะเบียน");
      return;
    }
    if (registeredActivityIds.includes(activityId)) {
      toast.info("คุณได้สมัครกิจกรรมนี้แล้ว");
      return;
    }

    setRegistering(activityId);

    try {
      const phone = prompt("กรุณากรอกเบอร์โทรที่ติดต่อได้");

      if (!phone) {
        toast.warning("กรุณากรอกเบอร์โทรก่อนลงทะเบียน");
        setRegistering(null);
        return;
      }

      await api.post(
        `/api/user/activities/${activityId}/applicants`,
        { phone },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ");

      setRegisteredActivityIds((prev) => [...prev, activityId]);
    } catch (error) {
      toast.error(error.response?.data?.message || "ลงทะเบียนไม่สำเร็จ");
    } finally {
      setRegistering(null);
    }
  };

  const openModal = (type, activity) => {
    setModalType(type);
    setModalActivity(activity);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalActivity(null);
  };

  if (loadingUser) return <p>กำลังโหลดข้อมูลผู้ใช้...</p>;

  return (
    <div className="my-activity-page">
      <h1>กิจกรรมที่เปิดรับสมัคร</h1>
      {loading ? (
        <p>กำลังโหลดกิจกรรม...</p>
      ) : activities.length === 0 ? (
        <p>ไม่มีกิจกรรมเปิดรับสมัครในขณะนี้</p>
      ) : (
        <ul>
          {activities.map((activity) => {
            const isRegistered = registeredActivityIds.includes(activity.id);

            return (
              <li key={activity.id} className="activity-item">
                <div className="activity-info">
                  <h3>{activity.name}</h3>
                  <p>
                    วันที่จัด:{" "}
                    {(() => {
                      const dateObj = new Date(activity.date);
                      const day = String(dateObj.getDate()).padStart(2, "0");
                      const month = String(dateObj.getMonth() + 1).padStart(
                        2,
                        "0"
                      ); // เดือนเริ่มจาก 0
                      const year = dateObj.getFullYear(); // ได้ปีค.ศ.

                      return `${day}/${month}/${year}`;
                    })()}
                  </p>

                  <p>สถานที่: {activity.location}</p>
                  <p>{activity.detail}</p>

                  <div className="button-group">
                    <button
                      disabled={registering === activity.id || isRegistered}
                      onClick={() => handleRegister(activity.id)}
                    >
                      {isRegistered
                        ? "สมัครแล้ว"
                        : registering === activity.id
                        ? "กำลังลงทะเบียน..."
                        : "สมัครกิจกรรม"}
                    </button>

                    <button onClick={() => openModal("schedule", activity)}>
                      กำหนดการ
                    </button>

                    {isRegistered && (
                      <button onClick={() => openModal("qr", activity)}>
                        QR code เข้าไลน์กลุ่ม
                      </button>
                    )}
                  </div>
                </div>

                {activity.image_path && (
                  <img
                    src={`${process.env.REACT_APP_API.replace(
                      "/api",
                      ""
                    )}/uploads/${activity.image_path}`}
                    alt={activity.name}
                    className="activity-image"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>

            {modalType === "schedule" && modalActivity && (
              <div>
                <h2>กำหนดการกิจกรรม: {modalActivity.name}</h2>
                {modalActivity.image_path_schedule ? (
                  (() => {
                    const fileUrl = `${process.env.REACT_APP_API.replace(
                      "/api",
                      ""
                    )}/uploads/${modalActivity.image_path_schedule}`;
                    const ext = modalActivity.image_path_schedule
                      .split(".")
                      .pop()
                      .toLowerCase();

                    if (
                      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)
                    ) {
                      return (
                        <img
                          src={fileUrl}
                          alt="กำหนดการ"
                          style={{ maxWidth: "100%" }}
                        />
                      );
                    } else if (ext === "pdf") {
                      return (
                        <embed
                          src={fileUrl}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                        />
                      );
                    } else {
                      return <p>ไม่รองรับไฟล์ประเภทนี้</p>;
                    }
                  })()
                ) : (
                  <p>ไม่มีข้อมูลกำหนดการ</p>
                )}
              </div>
            )}

            {modalType === "qr" && modalActivity && (
              <div>
                <h2>QR code เข้าไลน์กลุ่ม: {modalActivity.name}</h2>
                {modalActivity.image_path_qr ? (
                  <img
                    src={`${process.env.REACT_APP_API.replace(
                      "/api",
                      ""
                    )}/uploads/${modalActivity.image_path_qr}`}
                    alt="QR Code"
                    style={{ maxWidth: "100%" }}
                  />
                ) : (
                  <p>ไม่มี QR code สำหรับกิจกรรมนี้</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActivityPage;
