'use client'
import "./globals.css";
import HeaderBar from "./header-bar/page";
import { CookiesProvider } from 'react-cookie';
export default function RootLayout( {children} ) {
  return (
    <CookiesProvider>
    <html lang="en">
      <body>
          <div className=" bg-white flex flex-col">
          <HeaderBar />
          <div className=" flex bg-my-image bg-cover items-center justify-center">{children}</div>
          </div>
      </body>
    </html>
    </CookiesProvider>

  );
}
