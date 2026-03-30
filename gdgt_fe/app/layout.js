import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "An Toàn Giao Thông",
  description: "Cùng nhau xây dựng văn hóa giao thông an toàn",
  icons: {
    icon: '/icon.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <Header />
          <div style={{ marginTop: '64px' }}>
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
