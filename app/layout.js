import "./globals.css";
import localFont from "next/font/local";


const poppins = localFont({
  src: [
    { path: "../public/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Poppins-Regular.ttf", weight: "400", style: "normal" }
  ],
  variable: "--font-poppins",
  display: "swap",
});


export const metadata = {
  title: "Ramenyes",
  description: "A premium web experience built with Lunar.",
  robots: { index: true, follow: true },

  icons: { icon: "#" },

  openGraph: {



  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <title>Soklin Liquid Ramenyes</title>
        <meta name="description" content="A premium web experience built with Lunar." />
        <meta name="robots" content="index,follow" />





        {/* Preconnect to Font domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* LCP Preload (Up to 2 candidates detected) */}
        <link rel="preload" as="image" href="https://space.lunaaar.site/assets-ramenyes/logo_ramen_yes.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="https://space.lunaaar.site/assets-ramenyes/headline_5_4.webp" fetchPriority="high" />


      </head>
      <body>
        {children}

        {/* Analytics Scripts */}







      </body>
    </html>
  );
}
