import './globals.css';

export const metadata = {
  title: 'ลงทะเบียนผู้สนใจหนังสือ — Watanabe OGI',
  description: 'แบบฟอร์มลงทะเบียนผู้สนใจหนังสือชุด Enterprise AI Architecture และ นวัตกรรม ๒๐๒๖ โดย Watanabe OGI',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
