import React from "react";
import "./MemberTable.css";

// ตัวช่วยจัดกลุ่มข้อมูลตาม key
const groupBy = (arr = [], key) =>
  arr.reduce((acc, curr) => {
    const group = curr[key] || "ไม่ระบุ";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

// ตารางแต่ละกลุ่ม
const TableSection = ({ title, data }) => (
  <div className="member-table-section">
    <h3>{title}</h3>
    <table className="member-table">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ประเภท</th>
          <th>จำนวน</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value], index) => (
          <tr key={key}>
            <td>{index + 1}</td>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ✅ Component หลัก
const MemberTable = ({ members = [], selectedType = "ทั้งหมด" }) => {
  const filtered =
    selectedType === "ทั้งหมด"
      ? members
      : members.filter((m) => m.type === selectedType);

  const byDistrict = groupBy(filtered, "district");
  const byGeneration = groupBy(filtered, "graduation_year");
  const byGender = groupBy(filtered, "gender");

  return (
    <div className="member-table-container">
      <TableSection title="ตามอำเภอ" data={byDistrict} />
      <TableSection title="ตามรุ่น" data={byGeneration} />
      <TableSection title="ตามเพศ" data={byGender} />
    </div>
  );
};

export default MemberTable;
