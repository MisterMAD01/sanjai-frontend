import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// 🔧 ตัวช่วยจัดกลุ่มข้อมูล
const groupBy = (arr = [], key) =>
  arr.reduce((acc, curr) => {
    const group = curr[key] || "ไม่ระบุ";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

// 🔧 กล่องแสดงกราฟแต่ละชุด
const ChartBox = ({ title, data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "จำนวน",
        data: Object.values(data),
        backgroundColor: "#b71c1c",
      },
    ],
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 280,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "white",
      }}
    >
      <h4 style={{ marginBottom: 10, color: "#b71c1c" }}>{title}</h4>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0, // ✅ ไม่ให้แสดงทศนิยม
              },
            },
          },
        }}
      />
    </div>
  );
};

// 🔧 ส่วนแสดงกราฟรวม
const MemberChartBar = ({ members = [] }) => {
  const byDistrict = groupBy(members, "district");
  const byGeneration = groupBy(members, "graduation_year");
  const byGender = groupBy(members, "gender");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "30px",
      }}
    >
      <ChartBox title="ตามอำเภอ" data={byDistrict} />
      <ChartBox title="ตามรุ่น" data={byGeneration} />
      <ChartBox title="ตามเพศ" data={byGender} />
    </div>
  );
};

export default MemberChartBar;
