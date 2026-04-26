import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GrowthStack AI Assistant',
  description: 'AI-powered support chatbot for GrowthStack SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
