import { Inter } from "next/font/google";
import "./globals.css";
import "bulma/css/bulma.min.css"
import Header from "@/components/header";
import Footer from "@/components/footer";
import Head from 'next/head';
import Providers from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trang thông tin giáo dục",
  description: "",
  icons: {
    icon: '/icon.jpg', // /public path
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >

      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />

      <body className={inter.className}>
        <Providers>
          <Header />
          <div style={{ marginTop: '50px' }}>
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
