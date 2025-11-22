import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Know Your Leader - Presidential Campaign Finance Tracker',
  description: 'Follow the money. Know your candidates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}