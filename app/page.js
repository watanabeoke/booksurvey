'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import {
  EXPERTISE_OPTIONS,
  EXPERIENCE_OPTIONS,
  INTEREST_OPTIONS,
  FORMAT_OPTIONS,
  BOOK_OPTIONS,
} from '../lib/questions';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormPage() {
  const router = useRouter();
  const [f, setF] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    job_role: '',
    expertise: '',
    expertise_other: '',
    experience_level: '',
    interests: [],
    books_interested: [],
    format_pref: [],
    problems: '',
    comments: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const toggle = (k, val) =>
    setF((p) => {
      const arr = p[k];
      return { ...p, [k]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  const validate = () => {
    const e = {};
    if (!f.full_name.trim()) e.full_name = true;
    if (!EMAIL_RE.test(f.email.trim())) e.email = true;
    if (!f.consent) e.consent = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setFormError('');
    if (!validate()) {
      setFormError('กรุณากรอกชื่อ-นามสกุล, อีเมลให้ถูกต้อง และยินยอมการติดต่อกลับ');
      return;
    }
    setSubmitting(true);
    const payload = {
      full_name: f.full_name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim() || null,
      organization: f.organization.trim() || null,
      job_role: f.job_role.trim() || null,
      expertise: f.expertise || null,
      expertise_other: f.expertise === 'อื่นๆ' ? f.expertise_other.trim() || null : null,
      experience_level: f.experience_level || null,
      interests: f.interests,
      books_interested: f.books_interested,
      format_pref: f.format_pref,
      problems: f.problems.trim() || null,
      comments: f.comments.trim() || null,
      consent: f.consent,
    };
    const { error } = await supabase.from('responses').insert(payload);
    setSubmitting(false);
    if (error) {
      setFormError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง (' + error.message + ')');
      return;
    }
    router.push('/thank-you');
  };

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Reader Registry</p>
          <h1>ลงทะเบียนผู้สนใจหนังสือ</h1>
          <p>
            กรอกข้อมูลเพื่อรับข่าวสาร ตัวอย่างเนื้อหา และสิทธิ์สั่งจองหนังสือชุด
            Enterprise AI Architecture และ นวัตกรรม ๒๐๒๖ ก่อนใคร
          </p>
          <div className="author">Watanabe OGI · Enterprise AI Architecture Series</div>
        </div>
      </header>

      <main className="wrap">
        <div className="card">
          {/* ===== ข้อมูลผู้ลงทะเบียน ===== */}
          <div className="section-label">ข้อมูลผู้ลงทะเบียน</div>

          <div className="field">
            <label className="label">ชื่อ – นามสกุล<span className="req">*</span></label>
            <input
              className={'input' + (errors.full_name ? ' invalid' : '')}
              value={f.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
            />
          </div>

          <div className="field">
            <label className="label">อีเมล<span className="req">*</span></label>
            <input
              className={'input' + (errors.email ? ' invalid' : '')}
              type="email"
              value={f.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="field">
            <label className="label">เบอร์โทรศัพท์ <span className="hint">(ไม่บังคับ)</span></label>
            <input
              className="input"
              value={f.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="08x-xxx-xxxx"
              inputMode="tel"
            />
          </div>

          <div className="field">
            <label className="label">หน่วยงาน / องค์กร <span className="hint">(ไม่บังคับ)</span></label>
            <input
              className="input"
              value={f.organization}
              onChange={(e) => set('organization', e.target.value)}
              placeholder="ชื่อบริษัท / หน่วยงาน / สถาบัน"
            />
          </div>

          <div className="field">
            <label className="label">ตำแหน่ง / บทบาท <span className="hint">(ไม่บังคับ)</span></label>
            <input
              className="input"
              value={f.job_role}
              onChange={(e) => set('job_role', e.target.value)}
              placeholder="เช่น Enterprise Architect, อาจารย์, ผู้บริหาร"
            />
          </div>

          {/* ===== ความเชี่ยวชาญ & ความสนใจ ===== */}
          <div className="section-label">ความเชี่ยวชาญ และความสนใจ</div>

          <div className="field">
            <label className="label">สาขาที่เชี่ยวชาญ</label>
            <select className="select" value={f.expertise} onChange={(e) => set('expertise', e.target.value)}>
              <option value="">— เลือก —</option>
              {EXPERTISE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {f.expertise === 'อื่นๆ' && (
            <div className="field">
              <label className="label">ระบุสาขา</label>
              <input
                className="input"
                value={f.expertise_other}
                onChange={(e) => set('expertise_other', e.target.value)}
                placeholder="โปรดระบุ"
              />
            </div>
          )}

          <div className="field">
            <label className="label">ประสบการณ์ในสายงาน</label>
            <select
              className="select"
              value={f.experience_level}
              onChange={(e) => set('experience_level', e.target.value)}
            >
              <option value="">— เลือก —</option>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">หัวข้อที่สนใจ <span className="hint">(เลือกได้หลายข้อ)</span></label>
            <div className="chips">
              {INTEREST_OPTIONS.map((o) => (
                <label key={o} className={'chip' + (f.interests.includes(o) ? ' on' : '')}>
                  <input
                    type="checkbox"
                    checked={f.interests.includes(o)}
                    onChange={() => toggle('interests', o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          {/* ===== หนังสือที่สนใจ ===== */}
          <div className="section-label">หนังสือที่สนใจ</div>
          <div className="field">
            <div className="books">
              {BOOK_OPTIONS.map((b) => {
                const on = f.books_interested.includes(b.title);
                return (
                  <label key={b.id} className={`book ${b.theme}` + (on ? ' on' : '')}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle('books_interested', b.title)}
                    />
                    <span className="spine" />
                    <span>
                      <span className="b-title">{b.title}</span>
                      <span className="b-sub" style={{ display: 'block' }}>{b.sub}</span>
                    </span>
                    <span className="tick">{on ? '✓' : ''}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label className="label">รูปแบบที่สนใจ <span className="hint">(เลือกได้หลายข้อ)</span></label>
            <div className="chips">
              {FORMAT_OPTIONS.map((o) => (
                <label key={o} className={'chip' + (f.format_pref.includes(o) ? ' on' : '')}>
                  <input
                    type="checkbox"
                    checked={f.format_pref.includes(o)}
                    onChange={() => toggle('format_pref', o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          {/* ===== ปัญหา & ข้อเสนอแนะ ===== */}
          <div className="section-label">ปัญหา และข้อเสนอแนะ</div>

          <div className="field">
            <label className="label">ปัญหา / ความท้าทายที่พบในงาน <span className="hint">(ไม่บังคับ)</span></label>
            <textarea
              className="textarea"
              value={f.problems}
              onChange={(e) => set('problems', e.target.value)}
              placeholder="เล่าปัญหาที่อยากให้หนังสือช่วยตอบ — ใช้เป็นข้อมูลพัฒนาเนื้อหา"
            />
          </div>

          <div className="field">
            <label className="label">ข้อเสนอแนะเพิ่มเติม <span className="hint">(ไม่บังคับ)</span></label>
            <textarea
              className="textarea"
              value={f.comments}
              onChange={(e) => set('comments', e.target.value)}
              placeholder="อยากเห็นหัวข้ออะไรในเล่มต่อไป?"
            />
          </div>

          {/* ===== consent ===== */}
          <div className="consent">
            <input
              id="consent"
              type="checkbox"
              checked={f.consent}
              onChange={(e) => set('consent', e.target.checked)}
            />
            <label htmlFor="consent">
              ข้าพเจ้ายินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลข้างต้นเพื่อการติดต่อกลับและส่งข่าวสารเกี่ยวกับหนังสือ
              ตามนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)<span className="req">*</span>
            </label>
          </div>

          {formError && <div className="form-error">{formError}</div>}

          <button className="btn" onClick={submit} disabled={submitting}>
            {submitting ? 'กำลังส่ง…' : 'ส่งข้อมูลลงทะเบียน'}
          </button>
        </div>
      </main>
    </>
  );
}
