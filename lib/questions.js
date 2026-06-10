// ตัวเลือกทั้งหมด ใช้ร่วมกันระหว่างหน้าฟอร์มและแดชบอร์ด
// แก้ไขรายการที่นี่ที่เดียว เปลี่ยนทั้งระบบ

export const EXPERTISE_OPTIONS = [
  'AI / Machine Learning',
  'Enterprise Architecture (EA)',
  'สาธารณสุข / Public Health',
  'Software / Data Engineering',
  'Data / Analytics',
  'บริหาร / Management',
  'วิชาการ / อาจารย์ / นักวิจัย',
  'อื่นๆ',
];

export const EXPERIENCE_OPTIONS = [
  'น้อยกว่า 1 ปี',
  '1–3 ปี',
  '3–5 ปี',
  '5–10 ปี',
  'มากกว่า 10 ปี',
];

export const INTEREST_OPTIONS = [
  'Enterprise AI / AI ระดับองค์กร',
  'Prompt / Context Engineering',
  'นวัตกรรม / Innovation',
  'Public Health / Digital Health',
  'สถาปัตยกรรมองค์กร (EA)',
  'การเขียน / หนังสือ',
];

export const FORMAT_OPTIONS = [
  'เล่มจริง (Print)',
  'eBook / PDF',
  'อบรม / Workshop',
  'บรรยาย / Talk',
];

// การ์ดเลือกหนังสือ — แต่ละเล่มใช้สีประจำปกของตัวเอง
export const BOOK_OPTIONS = [
  {
    id: 'pch',
    title: 'Prompt → Context → Harness Engineering',
    sub: 'ตำราสถาปัตยกรรม AI ระดับองค์กร · Thai / English',
    theme: 'navy',
  },
  {
    id: 'innov2026',
    title: 'นวัตกรรม ๒๐๒๖ · ความรู้ ฉบับนักเดินทาง',
    sub: "Innovation 2026 — A Traveler's Field Guide",
    theme: 'maroon',
  },
  {
    id: 'next',
    title: 'เล่มถัดไป / ผลงานชุดอื่น',
    sub: 'สนใจติดตามหนังสือเล่มต่อไปของ Watanabe OGI',
    theme: 'neutral',
  },
];
