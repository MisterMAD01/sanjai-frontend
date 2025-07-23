// C:\Users\masen\OneDrive\Desktop\PROJECT END\Coding\diabetes\frontend\src\components\utils.js

// ปรับวันที่ให้เป็นเวลาไทย (UTC+7)
export const toThaiDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 7); // แปลงเป็นเขตเวลาไทย
  return date;
};

// แปลงเป็นวันที่ภาษาไทย
export const formatDateThai = (dateStr) => {
  const localDate = toThaiDate(dateStr);
  if (!localDate) return "-";
  return localDate.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// แสดงเวลาแบบ 09:00 น.
export const formatTimeThai = (timeStr) => {
  if (!timeStr) return "-";
  return `${timeStr.slice(0, 5)} น.`;
};

// ดึงวันที่ในรูปแบบ yyyy-MM-dd
export const getLocalISODate = (dateStr) => {
  const date = toThaiDate(dateStr);
  return date.toISOString().split("T")[0];
};

export function formatDateShortThai(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.

  return `${day}/${month}/${year}`;
}


// === ปี ค.ศ. ⇄ พ.ศ. ===
// แปลงปี ค.ศ. (เช่น 2025) → พ.ศ. (2568)
export function convertYearCeToBe(yearCE) {
  return yearCE + 543;
}

// แปลงปี พ.ศ. (เช่น 2568) → ค.ศ. (2025)
export function convertYearBeToCe(yearBE) {
  return yearBE - 543;
}

// === เวลา 24 ชม. ⇄ 12 ชม. ===
// แปลงเวลา 24 ชม. (14:30) → 12 ชม. (2:30 PM)
export function convertTime24To12(time24) {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

// แปลงเวลา 12 ชม. (2:30 PM) → 24 ชม. (14:30)
export function convertTime12To24(time12) {
  if (!time12) return '';
  const [time, suffix] = time12.trim().split(' ');
  let [h, m] = time.split(':').map(Number);
  if (suffix.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (suffix.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// === วันที่ ISO (YYYY-MM-DD) ⇄ ไทย (DD/MM/YYYY พร้อมปี พ.ศ.) ===
// แปลงวันที่ ค.ศ. ISO (2025-07-23) → ไทย (23/07/2568)
export function convertDateIsoToThai(dateISO) {
  if (!dateISO) return '';
  const [y, m, d] = dateISO.split('-');
  return `${d}/${m}/${convertYearCeToBe(Number(y))}`;
}

// แปลงวันที่ไทย (23/07/2568) → ISO (2025-07-23)
export function convertDateThaiToIso(dateThai) {
  if (!dateThai) return '';
  const [d, m, by] = dateThai.split('/');
  return `${convertYearBeToCe(Number(by))}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// === เดือน อังกฤษ ⇄ ไทย ===
const monthsTH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const monthsEN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// แปลงชื่อเดือนอังกฤษ → ไทย
export function convertMonthEnToTh(monthEn) {
  if (!monthEn) return '';
  const idx = monthsEN.findIndex(m => m.toLowerCase() === monthEn.toLowerCase());
  return idx >= 0 ? monthsTH[idx] : '';
}

// แปลงชื่อเดือนไทย → อังกฤษ
export function convertMonthThToEn(monthTh) {
  if (!monthTh) return '';
  const idx = monthsTH.findIndex(m => m === monthTh);
  return idx >= 0 ? monthsEN[idx] : '';
}

// === แปลง label ปี เช่น "พ.ศ. 2568" ⇄ "ค.ศ. 2025" ===
// แปลงจาก "พ.ศ. 2568" → "ค.ศ. 2025"
export function convertLabelBeToCe(labelBe) {
  if (!labelBe) return '';
  const match = labelBe.match(/พ\.ศ\. ?(\d{4})/);
  if (!match) return '';
  return `ค.ศ. ${convertYearBeToCe(Number(match[1]))}`;
}

// แปลงจาก "ค.ศ. 2025" → "พ.ศ. 2568"
export function convertLabelCeToBe(labelCe) {
  if (!labelCe) return '';
  const match = labelCe.match(/ค\.ศ\. ?(\d{4})/);
  if (!match) return '';
  return `พ.ศ. ${convertYearCeToBe(Number(match[1]))}`;
}

// === แปลง วันที่+เวลา ===
// แปลง "YYYY-MM-DD HH:mm" (ค.ศ. 24ชม.) → "DD/MM/YYYY เวลา h:mm AM/PM" (พ.ศ. 12ชม.)
export function convertDatetimeCe24ToBe12(datetimeCe) {
  if (!datetimeCe) return '';
  const [date, time] = datetimeCe.split(' ');
  if (!date || !time) return '';
  const dateThai = convertDateIsoToThai(date);
  const time12 = convertTime24To12(time);
  return `${dateThai} เวลา ${time12}`;
}

// แปลง "DD/MM/YYYY เวลา h:mm AM/PM" (พ.ศ. 12ชม.) → "YYYY-MM-DD HH:mm" (ค.ศ. 24ชม.)
export function convertDatetimeBe12ToCe24(datetimeBe) {
  if (!datetimeBe) return '';
  const parts = datetimeBe.split(' ');
  const date = parts[0];
  const time12 = parts.slice(2).join(' ');
  if (!date || !time12) return '';
  const dateIso = convertDateThaiToIso(date);
  const time24 = convertTime12To24(time12);
  return `${dateIso} ${time24}`;
}

// แปลง "YYYY-MM-DD HH:mm" (ค.ศ. 24ชม.) → "DD/MM/YYYY HH:mm" (พ.ศ. 24ชม.)
export function convertDatetimeCe24ToBe24(datetimeCe) {
  if (!datetimeCe) return '';
  const [date, time] = datetimeCe.split(' ');
  if (!date || !time) return '';
  const [y, m, d] = date.split('-');
  const yearBe = convertYearCeToBe(Number(y));
  return `${d}/${m}/${yearBe} ${time}`;
}