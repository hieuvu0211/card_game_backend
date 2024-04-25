'use client'

import "./globals.css";
import { CookiesProvider } from 'react-cookie';
import dynamic from 'next/dynamic'
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
const Bar = dynamic(() => import("./header-bar/page"), {
ssr: false,
});

export default function RootLayout( {children} ) {

  return (
    <CookiesProvider>
    <html lang="en">
      <body>
          <ProgressBar
          height="4px"
          color="#7BC9FF"
          options={{ showSpinner: false }}
          shallowRouting
          />
          <div className=" bg-white flex flex-col">
          <Bar />
          <div className=" flex bg-my-image bg-cover items-center justify-center">{children}

          </div>
          </div>
      </body>
    </html>
    </CookiesProvider>

  );
}
