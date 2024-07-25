"use client";

import { Inter } from "next/font/google";
import "./globals.css";
// @ts-ignore
// import NoSSR from "react-no-ssr";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <NoSSR onSSR={<> </>}> */}
      <body className={inter.className}>{children}</body>
      {/* </NoSSR> */}
    </html>
  );
}
