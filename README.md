# แบบสอบถามผู้สนใจหนังสือ — Watanabe OGI

เว็บแอป Next.js สำหรับเก็บข้อมูลผู้สนใจหนังสือ พร้อมฐานข้อมูล (Supabase) และแดชบอร์ดสรุปผล
รองรับผู้กรอกจำนวนมาก (500+ คน) ผ่านลิงก์สาธารณะลิงก์เดียว

```
หน้าฟอร์ม (สาธารณะ)   →  /          ส่งให้ผู้กรอก 500 คน
หน้าขอบคุณ            →  /thank-you
แดชบอร์ดสรุป (ใส่รหัส) →  /dashboard  สำหรับเจ้าของดูผล + ดาวน์โหลด CSV
```

---

## สิ่งที่ต้องมี
- บัญชี [Supabase](https://supabase.com) (ฟรี)
- บัญชี [Vercel](https://vercel.com) (ฟรี)
- บัญชี GitHub (สำหรับ push โค้ด)

---

## ขั้นตอนติดตั้ง (≈ 15 นาที)

### 1) สร้างฐานข้อมูล Supabase
1. สร้าง Project ใหม่ใน Supabase
2. ไปที่ **SQL Editor → New query** วางเนื้อหาไฟล์ `supabase/schema.sql` แล้วกด **Run**
3. ไปที่ **Project Settings → API** จดค่า 3 อย่างนี้:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(ค่าลับ ห้ามเปิดเผย)*

### 2) ทดสอบในเครื่อง (ถ้าต้องการ)
```bash
npm install
cp .env.local.example .env.local   # แล้วเติมค่าจริงทั้ง 4 ค่า
npm run dev                          # เปิด http://localhost:3000
```

### 3) Deploy บน Vercel
1. push โค้ดขึ้น GitHub repo
2. ใน Vercel กด **Add New → Project** เลือก repo นี้
3. ใส่ Environment Variables ทั้ง 4 ตัว (ดูจาก `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DASHBOARD_PASSWORD`  ← ตั้งรหัสผ่านแดชบอร์ดเอง
4. กด **Deploy** — จะได้ลิงก์ เช่น `https://your-app.vercel.app`

### 4) ใช้งาน
- **ส่งให้ผู้กรอก:** แชร์ลิงก์ `https://your-app.vercel.app`
- **ดูสรุปผล:** เปิด `https://your-app.vercel.app/dashboard` แล้วใส่ `DASHBOARD_PASSWORD`
- **ดาวน์โหลดข้อมูล:** ปุ่ม "ดาวน์โหลด CSV" บนแดชบอร์ด (เปิดใน Excel ได้ ภาษาไทยไม่เพี้ยน)

---

## ความปลอดภัย & PDPA
- ผู้กรอก (anon key) **เพิ่มข้อมูลได้อย่างเดียว อ่านของคนอื่นไม่ได้** (บังคับด้วย Row Level Security)
- แดชบอร์ดอ่านข้อมูลผ่าน **service_role key ฝั่ง server เท่านั้น** — ไม่หลุดไปฝั่งผู้ใช้
- มี checkbox ยินยอม PDPA บังคับก่อนส่ง และเก็บสถานะ `consent` ไว้ในฐานข้อมูล

---

## ปรับแก้คำถาม
แก้ตัวเลือกทั้งหมดได้ที่ไฟล์เดียว: `lib/questions.js`
(ถ้าเพิ่ม/ลบ "ฟิลด์" ใหม่ ต้องแก้ `app/page.js`, `supabase/schema.sql` และ `app/dashboard/page.js` ให้ตรงกัน)

---

## โครงสร้างไฟล์
```
app/
  page.js              หน้าฟอร์ม
  thank-you/page.js    หน้าขอบคุณ
  dashboard/page.js    แดชบอร์ด (KPI, กราฟ, ตาราง, CSV)
  api/responses/route.js   API อ่านข้อมูล (ตรวจรหัสผ่าน + service role)
  layout.js, globals.css   โครง + ดีไซน์
lib/
  supabaseClient.js    เชื่อม Supabase ฝั่งฟอร์ม
  questions.js         ตัวเลือกคำถามทั้งหมด
supabase/
  schema.sql           สคริปต์สร้างตาราง + RLS
```
