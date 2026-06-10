'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  EXPERTISE_OPTIONS, EXPERIENCE_OPTIONS, INTEREST_OPTIONS, FORMAT_OPTIONS, BOOK_OPTIONS,
} from '../../lib/questions';

const NAVY = '#0b1f33';
const BLUE = '#4a90d9';
const MAROON = '#7a2e2e';

function countSingle(rows, key, order) {
  const m = {};
  rows.forEach((r) => {
    const v = r[key];
    if (v) m[v] = (m[v] || 0) + 1;
  });
  const keys = order ? order.filter((k) => m[k]) : Object.keys(m);
  // include any value not in the predefined order
  Object.keys(m).forEach((k) => { if (!keys.includes(k)) keys.push(k); });
  return keys.map((name) => ({ name, value: m[name] }));
}

function countArray(rows, key, order) {
  const m = {};
  rows.forEach((r) => {
    (r[key] || []).forEach((v) => { if (v) m[v] = (m[v] || 0) + 1; });
  });
  const keys = order ? order.filter((k) => m[k]) : Object.keys(m);
  Object.keys(m).forEach((k) => { if (!keys.includes(k)) keys.push(k); });
  return keys.map((name) => ({ name, value: m[name] }));
}

function HBar({ data, color }) {
  if (!data.length) return <p style={{ color: '#5a6b7a', fontSize: '.88rem' }}>ยังไม่มีข้อมูล</p>;
  const h = Math.max(140, data.length * 38);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="#eef1f5" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5a6b7a' }} />
        <YAxis
          type="category" dataKey="name" width={170}
          tick={{ fontSize: 11, fill: '#1a2733' }}
        />
        <Tooltip cursor={{ fill: '#f2f5f9' }} />
        <Bar dataKey="value" radius={[0, 5, 5, 0]} fill={color || BLUE} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function toCSV(rows) {
  const cols = [
    'created_at', 'full_name', 'email', 'phone', 'organization', 'job_role',
    'expertise', 'expertise_other', 'experience_level', 'interests',
    'books_interested', 'format_pref', 'problems', 'comments', 'consent',
  ];
  const esc = (v) => {
    if (v == null) return '';
    let s = Array.isArray(v) ? v.join('; ') : String(v);
    if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const head = cols.join(',');
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n');
  return '\uFEFF' + head + '\n' + body; // BOM for Excel Thai
}

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [msg, setMsg] = useState('');

  const load = async () => {
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) { setStatus('error'); setMsg('รหัสผ่านไม่ถูกต้อง'); return; }
      if (!res.ok) { setStatus('error'); setMsg('โหลดข้อมูลไม่สำเร็จ'); return; }
      const data = await res.json();
      setRows(data.rows || []);
      setStatus('idle');
    } catch {
      setStatus('error'); setMsg('เชื่อมต่อไม่สำเร็จ');
    }
  };

  const stats = useMemo(() => {
    if (!rows) return null;
    return {
      total: rows.length,
      consented: rows.filter((r) => r.consent).length,
      books: countArray(rows, 'books_interested', BOOK_OPTIONS.map((b) => b.title)),
      expertise: countSingle(rows, 'expertise', EXPERTISE_OPTIONS),
      experience: countSingle(rows, 'experience_level', EXPERIENCE_OPTIONS),
      interests: countArray(rows, 'interests', INTEREST_OPTIONS),
      format: countArray(rows, 'format_pref', FORMAT_OPTIONS),
    };
  }, [rows]);

  const downloadCSV = () => {
    const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book-survey-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ----- password gate -----
  if (!rows) {
    return (
      <div className="gate">
        <div className="card">
          <h2>แดชบอร์ดสรุปผล</h2>
          <p>กรุณาใส่รหัสผ่านเพื่อดูข้อมูลผู้ลงทะเบียน</p>
          <input
            className="input"
            type="password"
            value={password}
            placeholder="รหัสผ่าน"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
          {msg && <div className="form-error" style={{ marginTop: 12 }}>{msg}</div>}
          <button className="btn" onClick={load} disabled={status === 'loading'}>
            {status === 'loading' ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    );
  }

  // ----- dashboard -----
  return (
    <>
      <div className="dash-top">
        <div className="inner">
          <h1>แดชบอร์ดผู้สนใจหนังสือ</h1>
          <span className="spacer" />
          <button className="btn-light" onClick={load}>↻ รีเฟรช</button>
          <button className="btn-light" onClick={downloadCSV}>⬇ ดาวน์โหลด CSV</button>
        </div>
      </div>

      <div className="dash-wrap">
        <div className="kpis">
          <div className="kpi"><div className="num">{stats.total}</div><div className="cap">ผู้ลงทะเบียนทั้งหมด</div></div>
          <div className="kpi"><div className="num">{stats.books.find((b) => b.name === BOOK_OPTIONS[0].title)?.value || 0}</div><div className="cap">สนใจเล่ม EA (PCH)</div></div>
          <div className="kpi"><div className="num">{stats.books.find((b) => b.name === BOOK_OPTIONS[1].title)?.value || 0}</div><div className="cap">สนใจ นวัตกรรม ๒๐๒๖</div></div>
          <div className="kpi"><div className="num">{stats.consented}</div><div className="cap">ยินยอม PDPA</div></div>
        </div>

        <div className="panels">
          <div className="panel full">
            <h3>หนังสือที่สนใจ</h3>
            <HBar data={stats.books} color={MAROON} />
          </div>

          <div className="panel">
            <h3>สาขาที่เชี่ยวชาญ</h3>
            <HBar data={stats.expertise} color={BLUE} />
          </div>

          <div className="panel">
            <h3>ประสบการณ์ในสายงาน</h3>
            <HBar data={stats.experience} color={NAVY} />
          </div>

          <div className="panel">
            <h3>หัวข้อที่สนใจ</h3>
            <HBar data={stats.interests} color={BLUE} />
          </div>

          <div className="panel">
            <h3>รูปแบบที่สนใจ</h3>
            <HBar data={stats.format} color={NAVY} />
          </div>

          <div className="panel full">
            <h3>รายชื่อล่าสุด ({stats.total})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>วันที่</th><th>ชื่อ-นามสกุล</th><th>หน่วยงาน</th>
                    <th>อีเมล</th><th>เบอร์โทร</th><th>หนังสือที่สนใจ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{new Date(r.created_at).toLocaleDateString('th-TH')}</td>
                      <td>{r.full_name}</td>
                      <td>{r.organization || '—'}</td>
                      <td>{r.email}</td>
                      <td>{r.phone || '—'}</td>
                      <td>{(r.books_interested || []).join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
