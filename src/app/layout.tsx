import type { Metadata } from "next";
import ClientLayout from "./client-layout";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "PathFinders",
  description: "Vehicle tracking and management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
