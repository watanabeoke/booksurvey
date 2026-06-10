import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="center-screen">
      <div className="thanks">
        <div className="badge">✓</div>
        <h2>ลงทะเบียนสำเร็จ</h2>
        <p>
          ขอบคุณที่สนใจผลงานครับ เราจะติดต่อกลับทางอีเมลพร้อมข่าวสาร
          ตัวอย่างเนื้อหา และสิทธิ์สั่งจองหนังสือ
        </p>
        <p style={{ marginTop: 18 }}>
          <Link href="/">← กลับไปหน้าแบบฟอร์ม</Link>
        </p>
      </div>
    </div>
  );
}
