import React, { useEffect, useState, useContext } from "react";
import api from "../../../api";
import { UserContext } from "../../../contexts/UserContext";
import { toast } from "react-toastify";
import ActivityList from "./ActivityList";
import PhoneModal from "./PhoneModal";
import DetailModal from "./DetailModal";
import "./MyActivityPage.css";

const MyActivityPage = () => {
  const { user, accessToken, loadingUser } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [registeredActivityIds, setRegisteredActivityIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalActivity, setModalActivity] = useState(null);

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resActivities = await api.get("/api/user/activities", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setActivities(resActivities.data || []);

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

    if (accessToken) fetchData();
  }, [accessToken]);

  const handleRegisterClick = (activityId) => {
    if (!user) return toast.error("กรุณาเข้าสู่ระบบก่อนลงทะเบียน");
    if (registeredActivityIds.includes(activityId))
      return toast.info("คุณได้สมัครกิจกรรมนี้แล้ว");

    setSelectedActivityId(activityId);
    setPhoneModalOpen(true);
  };

  const handleConfirmPhone = async () => {
    if (!phoneNumber) return toast.warning("กรุณากรอกเบอร์โทรก่อนลงทะเบียน");

    setRegistering(selectedActivityId);

    try {
      await api.post(
        `/api/user/activities/${selectedActivityId}/applicants`,
        { phone: phoneNumber },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ");
      setRegisteredActivityIds((prev) => [...prev, selectedActivityId]);

      setPhoneModalOpen(false);
      setPhoneNumber("");
      setSelectedActivityId(null);
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
      ) : (
        <ActivityList
          activities={activities}
          registeredActivityIds={registeredActivityIds}
          registering={registering}
          onRegisterClick={handleRegisterClick}
          onOpenModal={openModal}
        />
      )}

      <PhoneModal
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onConfirm={handleConfirmPhone}
      />

      <DetailModal
        open={modalOpen}
        type={modalType}
        activity={modalActivity}
        onClose={closeModal}
      />
    </div>
  );
};

export default MyActivityPage;
