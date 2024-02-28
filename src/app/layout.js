import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskOn",
  description: "Web to organize your tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} white`}>{children}</body>
    </html>
  );
}
