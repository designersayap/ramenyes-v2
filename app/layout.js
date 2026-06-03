import "./globals.css";
import localFont from "next/font/local";


const lato = localFont({
  src: [
    { path: "../public/fonts/Lato-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Lato-Regular.ttf", weight: "400", style: "normal" }
  ],
  variable: "--font-lato",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../public/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Poppins-Regular.ttf", weight: "400", style: "normal" }
  ],
  variable: "--font-poppins",
  display: "swap",
});
import Script from "next/script";

export const metadata = {
  title: "Krim Ekonomi gebyar-berkah-umroh",
  description: "Berkah Ekonomi - Solusi Rumah Nyaman untuk keluarga Indonesia. Menangkan hadiah Umroh dan Logam Mulia dari Sabun Ekonomi.",
  robots: { index: true, follow: true },
  keywords: "Sabun Ekonomi, Berkah Ekonomi, Undian Berhadiah, Umroh, Emas, Logam Mulia, Solusi Rumah Nyaman",
  icons: { icon: "https://space.lunaaar.site/berkah-ekonomi/navigasi-logo.ico" },
  alternates: { canonical: "https://berkah-umroh.sabunkrimekonomi.id/" },
  openGraph: {
    title: "Berkah Ekonomi - Gebyar Berkah Umroh Pesta Emas",
    description: "Menangkan hadiah Umroh dan Emas dari Sabun Ekonomi. Solusi hemat dan bersih untuk keluarga",
    images: [{ url: "https://space.lunaaar.site/berkah-ekonomi/media-footer_20260603_140602.webp" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable} ${poppins.variable}`}>
      <head>
        <title>Krim Ekonomi gebyar-berkah-umroh</title>
        <meta name="description" content="Berkah Ekonomi - Solusi Rumah Nyaman untuk keluarga Indonesia. Menangkan hadiah Umroh dan Logam Mulia dari Sabun Ekonomi." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://berkah-umroh.sabunkrimekonomi.id/" />
        <meta property="og:title" content="Berkah Ekonomi - Gebyar Berkah Umroh Pesta Emas" />
        <meta property="og:description" content="Menangkan hadiah Umroh dan Emas dari Sabun Ekonomi. Solusi hemat dan bersih untuk keluarga" />
        <meta property="og:image" content="https://space.lunaaar.site/berkah-ekonomi/media-footer_20260603_140602.webp" />

        {/* Preconnect to Font domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* LCP Preload (Up to 2 candidates detected) */}
        <link rel="preload" as="image" href="https://space.lunaaar.site/berkah-ekonomi/navigasi-logo.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="https://space.lunaaar.site/berkah-ekonomi/features-syarat-ketentuan.webp" fetchPriority="high" />
        

      </head>
      <body>
        {children}
        
        {/* Analytics Scripts */}
        
        <Script id="gtm" strategy="afterInteractive" crossOrigin="anonymous">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5F3T8GZZ');`}
        </Script>
        

        
        <Script id="microsoft-clarity" strategy="lazyOnload" crossOrigin="anonymous">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ukanc4ygp4");`}
        </Script>

        

        
      </body>
    </html>
  );
}
