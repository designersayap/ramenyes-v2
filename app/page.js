"use client";

import dynamic from "next/dynamic";
import OsmBanner from "@/components/osm-banner.js";
import NavigationCenter from "@/components/navigation-center.js";
import SpacingMedium from "@/components/spacing-medium.js";
const Media169 = dynamic(() => import("@/components/media-16-9.js"), { ssr: true });
const HeaderSection = dynamic(() => import("@/components/header-section.js"), { ssr: true });
const MediaGridCol2 = dynamic(() => import("@/components/media-grid-col-2.js"), { ssr: true });
const FeatureImageLeft = dynamic(() => import("@/components/feature-image-left.js"), { ssr: true });
const TestimonyPortrait = dynamic(() => import("@/components/testimony-portrait.js"), { ssr: true });
const GalleryStrip = dynamic(() => import("@/components/gallery-strip.js"), { ssr: true });
const FooterOmnichannel = dynamic(() => import("@/components/footer-omnichannel.js"), { ssr: true });
const DialogAccordion = dynamic(() => import("@/components/dialog-accordion.js"), { ssr: true });
const FullBody = dynamic(() => import("@/components/full-body.js"), { ssr: true });
import StickyManager from "@/utils/sticky-manager";


export default function ExportedPage() {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'clip', containerType: 'inline-size', containerName: 'root-container' }}>
      <div id="canvas-background-root" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <StickyManager stickyIndices={[0,1]} stackedIndices={[]} blurIndices={[]} overlayIndices={[]}>
      <OsmBanner
        title={"Waspada Penipuan! Penyelenggara hanya menggunakan nomor WhatsApp: <a href=\"https://wa.me/622150957907\">021-50957907</a>, 081119765007, 081119765008. Diluar nomor tersebut bukan tanggung jawab Penyelenggara<br>"}
        buttonText={"Label"}
        buttonUrl={""}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={"banner-informasi--button"}
        variant={"brand"}
        sectionId={"banner-informasi"}
      />
      <NavigationCenter
        logo={"https://space.lunaaar.site/berkah-ekonomi/navigasi-logo.webp"}
        logoId={""}
        menu1Label={"Beranda"}
        menu1Url={"#banner-hadiah"}
        menu1LinkType={"url"}
        menu1TargetDialogId={""}
        menu1Id={"navigasi-beranda"}
        menu2Label={"Syarat dan Ketentuan"}
        menu2Url={"#banner-syarat-dan-ketentuan"}
        menu2LinkType={"url"}
        menu2TargetDialogId={""}
        menu2Id={"navigasi-ketentuan"}
        menu3Label={"Cara Klaim"}
        menu3Url={"#feature-cara-klaim"}
        menu3LinkType={"url"}
        menu3TargetDialogId={""}
        menu3Id={"navigasi-cara-klaim"}
        menu4Label={"Pemenang"}
        menu4Url={"#daftar-pemenang"}
        menu4LinkType={"url"}
        menu4TargetDialogId={""}
        menu4Id={"navigasi-pemenang"}
        menuColor={"default"}
        sectionId={"navigasi"}
      />
      <SpacingMedium
        sectionId={"spacing-7401"}
      />
      <Media169
        image={"https://assets.berkah-umroh.sabunkrimekonomi.id/Cutdown%2015%20detik%20-%20H.264.mp4"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={""}
        imageMobileSrc={""}
        imageAutoplay
        sectionId={"media-7964"}
        imageEnableAudio
        imageShowStroke
      />
      <HeaderSection
        title={"Total <span style=\"font-weight: normal;\">Hadiah</span> Miliaran Menantimu!"}
        subtitle={"<div><b>Batas Penukaran Hadiah Sampai 31 Januari 2027</b></div><div>Beli Sabun Krim Ekonomi bertanda khusus, kirim kode uniknya ke WhatsApp WINGS Customer Care, atau klik tombol di bawah untuk klaim.</div>"}
        buttonStyle={"primary"}
        buttonText={"Klaim Hadiah"}
        buttonUrl={"https://api.whatsapp.com/send?phone=622150957907&text=Hi%2C%20saya%20ingin%20klaim%20hadiah%20Sabun%20Krim%20Ekonomi%2C%20mohon%20bantuannya%20ya"}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={"title-total-hadiah--button"}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={"title-total-hadiah--secondary-button"}
        sectionId={"title-total-hadiah"}
        titleId={"title-total-hadiah--title"}
        subtitleId={"title-total-hadiah--subtitle"}
      />
      <SpacingMedium
        sectionId={"spacing"}
      />
      <MediaGridCol2
        images={[{"image":"https://space.lunaaar.site/berkah-ekonomi/umroh-reward-219.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","imageIsPortrait":false,"imageMobileRatio":"","imageMobileSrc":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageAutoplay":true,"visible":true,"cardId":"image-0"},{"image":"https://space.lunaaar.site/berkah-ekonomi/emas-reward-219.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","imageIsPortrait":false,"imageMobileRatio":"","imageMobileSrc":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageAutoplay":true,"visible":true,"cardId":"image-1"},{"image":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","imageIsPortrait":false,"imageMobileRatio":"","imageMobileSrc":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageAutoplay":true,"visible":false,"cardId":"image-2"},{"image":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","imageIsPortrait":false,"imageMobileRatio":"","imageMobileSrc":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageAutoplay":true,"visible":false,"cardId":"image-3"}]}
        fullWidth={false}
        hasFloatingEffect={false}
        aspectRatio={"21-9"}
        autoScroll={false}
        autoScrollEffect={"slide"}
        marqueeDuration={60}
        marqueeDirection={"rtl"}
        imageShowStroke={false}
        sectionId={"banner-hadiah"}
      />
      <Media169
        image={"https://space.lunaaar.site/berkah-ekonomi/features-syarat-ketentuan.webp"}
        imageUrl={"#"}
        imageLinkType={"dialog"}
        imageTargetDialogId={"dialog-tnc"}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={"4-5"}
        imageMobileSrc={"https://space.lunaaar.site/berkah-ekonomi/features-mobile-syarat-ketentuan.webp"}
        imageAutoplay
        sectionId={"banner-syarat-dan-ketentuan"}
        imageId={"banner-syarat-dan-ketentuan--image"}
        imageShowStroke
      />
      <FeatureImageLeft
        title={"Temukan Kode Unik di dalam Kemasan Sabun Krim Ekonomi"}
        subtitle={"Klaim Hadiahnya dengan Klik Tombol dibawah ini"}
        buttonStyle={"primary"}
        buttonText={"Klaim Hadiah"}
        buttonUrl={"https://api.whatsapp.com/send?phone=622150957907&text=Hi%2C%20saya%20ingin%20klaim%20hadiah%20Sabun%20Krim%20Ekonomi%2C%20mohon%20bantuannya%20ya"}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={"feature-cara-klaim--button"}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={"feature-cara-klaim--secondary-button"}
        image={"https://space.lunaaar.site/berkah-ekonomi/features-kode-unik.webp"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        imageAutoplay
        sectionId={"feature-cara-klaim"}
        imageId={"feature-cara-klaim--image"}
        titleId={"feature-cara-klaim--title"}
        subtitleId={"feature-cara-klaim--subtitle"}
      />
      <HeaderSection
        title={"Daftar Pemenang"}
        subtitle={"Periode April 2026"}
        buttonStyle={"primary"}
        buttonText={"Label"}
        buttonUrl={""}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={""}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={""}
        sectionId={"daftar-pemenang"}
      />
      <TestimonyPortrait
        testimonies={[{"name":"Subaeda","role":"Lumajang","description":"\"Nggak nyangka dapet emas dari Krim Ekonomi. Terima kasih!\"","image":"https://space.lunaaar.site/berkah-ekonomi/subaeda_lumajang_emas_1_20260603_084436.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarUrl":"","avatarLinkType":"url","avatarTargetDialogId":"","imageVisible":true,"avatarVisible":true,"cardId":"","visible":true},{"name":"Jaenab","role":"Bantaeng","description":"\"Terima kasih Krim Ekonomi untuk Emasnya. Saya senang sekali!\"","image":"https://space.lunaaar.site/berkah-ekonomi/pemenang-jaenab_bantaeng_emas2_1.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarUrl":"","avatarLinkType":"url","avatarTargetDialogId":"","imageVisible":true,"avatarVisible":true,"cardId":"","visible":false},{"name":"Nur Vitasari","role":"Banjarnegara","description":"\"Senang banget! Emasnya buat tambahan modal kios saya.\"","image":"https://space.lunaaar.site/berkah-ekonomi/pemenang-nur_vitasari_banjarnegara_emas_1.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarUrl":"","avatarLinkType":"url","avatarTargetDialogId":"","imageVisible":true,"avatarVisible":true,"cardId":"","visible":false},{"name":"Kuntariati","role":"Kediir","description":"\"Bahagia dapat emas, Makasih banyak ya. Smoga berkah.\"","image":"https://space.lunaaar.site/berkah-ekonomi/pemenang-kuntariati_kediri_emas_1.webp","imageUrl":"","imageLinkType":"url","imageTargetDialogId":"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarUrl":"","avatarLinkType":"url","avatarTargetDialogId":"","imageVisible":true,"avatarVisible":true,"cardId":"","visible":false},{"name":"Parino","role":"Purworejo","description":"\"Sukses terus Krim Ekonomi. Sabunnya wangi, hadiahnya asli!\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/parino_purworejo_emas_1.webp","imageVisible":true,"visible":false,"cardId":"testimony-4"},{"name":"Siti","role":"Palangkaraya","description":"\"Emasnya mau buat tabungan, terima kasih Krim Ekonomi!\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/SITI_PALANGKARAYA_EMAS.png","imageVisible":true,"visible":true,"cardId":"testimony-5"},{"name":"Mujiyati","role":"Banjarnegara","description":"<div>\"Rasanya senang sekali, krim Ekonomi lancar, sukses mantap!\"</div>","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/MUJIYATI_BANJARNEGARA_EMAS%201.png","imageVisible":true,"visible":true,"cardId":"testimony-6"},{"name":"Lasinah","role":"Lamongan","description":"\"Seneng banget bisa menang emas dari Krim Ekonomi.\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/lasinah_lamongan_lm_2_20260526_172000.webp","imageVisible":true,"visible":true,"cardId":"testimony-7"},{"name":"Aliyah","role":"Manyar","description":"\"Alhamdulillah senengnya dapet emas dari Krim Ekonomi!\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/aliyah_manyar_emas_1.webp","imageVisible":true,"visible":true,"cardId":"testimony-8"},{"name":"Bungatang","role":"Bone","description":"\"Terima kasih Krim Ekonomi, emasnya sangat berguna!\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/bungatang_bone_emas_1.webp","imageVisible":true,"visible":true,"cardId":"testimony-9"},{"name":"Dian","role":"Trenggalek","description":"\"Nggak nyangka dapet emas, Krim Ekonomi memang terbaik.\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/dian_trenggalek_emas_1.webp","imageVisible":true,"visible":true,"cardId":"testimony-10"},{"name":"Hartati","role":"Batulicin","description":"\"Sudah lama pakai Krim Ekonomi, nggak nyangka bisa menang emas!\"","avatar":"https://space.lunaaar.site/berkah-ekonomi/icon-gold.png","avatarVisible":true,"image":"https://space.lunaaar.site/berkah-ekonomi/hartati_batulicin_emas_1.webp","imageVisible":true,"visible":true,"cardId":"testimony-11"}]}
        fullWidth
        autoScroll
        autoScrollEffect={"marquee"}
        marqueeDuration={100}
        marqueeDirection={"rtl"}
        imageShowStroke={"https://space.lunaaar.site/assets-lunar/placeholder.svg"}
        sectionId={"carousel-pemenang"}
      />
      <SpacingMedium
        sectionId={"spacing"}
      />
      <Media169
        image={"https://space.lunaaar.site/berkah-ekonomi/features-product.webp"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={"4-5"}
        imageMobileSrc={"https://space.lunaaar.site/berkah-ekonomi/features-mobile-product.webp"}
        imageAutoplay
        sectionId={"banner-produk"}
      />
      <HeaderSection
        title={"&nbsp;Raih Kesempatan Menangmu!&nbsp;"}
        subtitle={"<span style=\"background-color: transparent;\">Beli Sabun Krim Ekonomi sekarang dan jadilah pemenang berikutnya!</span>"}
        buttonStyle={"primary"}
        buttonText={"Label"}
        buttonUrl={""}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={""}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={""}
        sectionId={"title-instagram-feed"}
        titleId={"title-instagram-feed--title"}
        subtitleId={"title-instagram-feed--subtitle"}
      />
      <GalleryStrip
        items={[{"title":"Bu Iin nyuci baju dan piring kotor,<div>Kita nemuin pemenang PAKET UMROH dan EMAS nih di Bogor!</div>","hashtag":"<a href=\"https://www.instagram.com/p/DX9Frb3KZG9/\">#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI</a>","image":"https://space.lunaaar.site/berkah-ekonomi/video/mei-testimony-pemenang-bogor.webm","imageId":"","cardId":"","visible":true,"url":"","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg","enableAudio":true},{"title":"Horee, Ibu Marni dari Bantaeng mendapatkan hadiah EMAS 0,5gr!","hashtag":"<a href=\"https://www.instagram.com/p/DYWoFDqK6NZ/\">#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI</a>","image":"https://space.lunaaar.site/berkah-ekonomi/video/mei-testimony-bantaeng.webm","imageId":"","cardId":"","visible":true,"url":"","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg"},{"title":"<a href=\"https://www.instagram.com/p/DXtn0-JChUu/\">Serunya Roadshow Sabun Krim Ekonomi di Bogor! 🎉</a>","hashtag":"<a href=\"https://www.instagram.com/p/DXtn0-JChUu/\">#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI</a>","image":"https://space.lunaaar.site/berkah-ekonomi/video/gebrak-pasar-bogor-r4.webm","imageId":"","cardId":"","visible":true,"url":"","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg"},{"title":"<a href=\"https://www.instagram.com/p/DYCP3KUqptW/\">Selamat untuk pemenang Paket UMROH di Purwokerto 🤩✨</a>","hashtag":"<a href=\"https://www.instagram.com/p/DYCP3KUqptW/\">#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI</a>","image":"https://space.lunaaar.site/berkah-ekonomi/video/mei-testimony-umroh-purwokerto.webm","imageId":"","cardId":"","visible":true,"url":"","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg"},{"title":"Bu Khalisat beli bebek, 🦆<div>Selamat untuk pemenang Emas di Cikampek! 🎉✨</div>","hashtag":"#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI","image":"https://assets.berkah-umroh.sabunkrimekonomi.id/PENYERAHAN HADIAH CILEGON 2 R2.webm","imageId":"","cardId":"","visible":false,"url":"https://www.instagram.com/p/DVdjoLdiciD/","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg"},{"title":"-","hashtag":"#SABUNKRIMEKONOMI #DARIMENCUCIBISAKETANAHSUCI","image":"https://assets.berkah-umroh.sabunkrimekonomi.id/TESTIMONY PEMENANG SUKABUMI R3.webm","imageId":"","cardId":"carousel-instagram-feed-insta-5","visible":false,"url":"","linkType":"url","targetDialogId":"","imageAutoplay":"https://space.lunaaar.site/assets-lunar/placeholder.svg"}]}
        autoScroll={false}
        autoScrollEffect={"slide"}
        marqueeDuration={20}
        marqueeDirection={"rtl"}
        imageOnly={false}
        isCompact={false}
        aspectRatio={"9-16"}
        imageShowStroke={false}
        sectionId={"carousel-instagram-feed"}
        fullWidth
      />
      <FooterOmnichannel
        image={"https://space.lunaaar.site/berkah-ekonomi/logo-footer.webp"}
        menuColor={"default"}
        copyrightText={"Copyright © Sabun Krim Ekonomi 2026"}
        availableAtTitle={"Tersedia di"}
        resourcesTitle={"Follow Us"}
        socialLinks={[{"platform":"facebook","url":"https://www.instagram.com/solusirumahnyaman.id/","visible":true,"id":"","label":"solusirumahnyaman.id","image":"https://space.lunaaar.site/berkah-ekonomi/footer-icon-instagram.webp"},{"platform":"twitter","url":"https://www.instagram.com/sabunkrimekonomi/","visible":true,"id":"","label":"sabunkrimekonomi","image":"https://space.lunaaar.site/berkah-ekonomi/footer-icon-instagram.webp"},{"platform":"instagram","url":"https://www.instagram.com/solusirumahnyaman.id/","visible":false,"id":""},{"platform":"tiktok","url":"","visible":false,"id":""},{"platform":"youtube","url":"","visible":false,"id":""}]}
        findUsOnLinks={[{"visible":true,"label":"WINGS Indonesia","image":"https://space.lunaaar.site/assets-template/icon-tokopedia.webp","url":"https://www.tokopedia.com/wingsofficial/etalase/ekonomi-cream-detergent?utm_source=website&utm_medium=brand&utm_campaign=othr_etalaseekonomicreamdet_111225_111226_s7495481450890169058"},{"visible":true,"label":"WINGS Official Shop","image":"https://space.lunaaar.site/assets-template/icon-shopee.webp","url":"https://shopee.co.id/universal-link/collections/11772668?deep_and_web=1&utm_campaign=s64474495_ss_id_webs_webadsnov25&utm_source=website&utm_medium=seller&utm_content=collsekonomicream&smtt=9"},{"visible":true,"label":"WINGS Flagship Store","image":"https://space.lunaaar.site/assets-template/icon-lazada.webp","url":"https://www.lazada.co.id/shop/wings-flagship-store"}]}
        resourceLinks={[{"label":"Privacy Policy","url":"https://wingscorp.com/kebijakan-privasi/","visible":true,"id":"","linkType":"url","targetDialogId":""},{"label":"Terms & Condition","url":"","visible":true,"id":"","linkType":"url","targetDialogId":""},{"label":"Contact Us","url":"","visible":false,"id":"","linkType":"url","targetDialogId":""}]}
        sectionId={"footer"}
        availableAtLinks={[{"label":"WINGS Indonesia","url":"https://www.tokopedia.com/wingsofficial/etalase/ekonomi-cream-detergent?utm_source=website&utm_medium=brand&utm_campaign=othr_etalaseekonomicreamdet_111225_111226_s7495481450890169058","visible":true,"id":"","image":"https://res.cloudinary.com/dp3tcw3wj/image/upload/v1768404237/tokopedia_npjosv.png","imageId":"","linkType":"url","targetDialogId":""},{"label":"WINGS Official Shop","url":"https://shopee.co.id/universal-link/collections/11772668?deep_and_web=1&utm_campaign=s64474495_ss_id_webs_webadsnov25&utm_source=website&utm_medium=seller&utm_content=collsekonomicream&smtt=9","visible":true,"id":"","image":"https://res.cloudinary.com/dp3tcw3wj/image/upload/v1768404353/shopee_hjlszw.png","imageId":"","linkType":"url","targetDialogId":""},{"label":"Wings Indonesia","url":"","visible":true,"id":"","image":"https://res.cloudinary.com/dp3tcw3wj/image/upload/v1768443083/lazada_hrpn5g.png","imageId":"","linkType":"url","targetDialogId":""}]}
      />
      <DialogAccordion
        title={"Syarat dan Ketentuan Program Promosi<div>Sabun Krim Serbaguna Ekonomi</div><div>\"GEBYAR BERKAH UMROH, PESTA EMAS\"</div>"}
        description={"Program Promosi Sabun Krim Ekonomi \"<span class=\"body-bold\">Gebyar Berkah Umroh, Pesta Emas</span>\" ini diselenggarakan oleh <span class=\"body-bold\">PT. Sayap Mas Utama</span> bersama-sama <span class=\"body-bold\">PT. Wings Surya</span> berkedudukan di DKI Jakarta dan Surabaya, selaku produsen sabun krim deterjen dengan merek dagang “EKONOMI” (“<span class=\"body-bold\">Penyelenggara</span>”), dan PT. Bintang Pratama yang ditunjuk sebagai agency / operator penyelenggara undian (“<span class=\"body-bold\">Agency Penyelenggara</span>”).<div><br></div><div>Program ditujukan bagi konsumen yang membeli produk Sabun Krim Serbaguna Ekonomi (“<span class=\"body-bold\">Peserta</span>”).</div><div><br></div><div>Peserta yang berpartisipasi dalam Program ini wajib membaca, memahami dan mematuhi syarat dan ketentuan yang diuraikan di bawah ini termasuk perubahannya (jika ada) yang dibuat oleh pihak Penyelenggara dari waktu ke waktu (“<span class=\"body-bold\">Syarat dan Ketentuan</span>”).</div>"}
        image={""}
        imageId={""}
        imageVisible={false}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        imageAutoplay
        items={[{"title":"Periode Program","content":"<b>1 Januari 2026 – 30 Juni 2026</b>"},{"title":"Hadiah","content":"<ol type=\"a\"><li>Selama periode Program, Peserta yang beruntung akan mendapatkan hadiah berupa 30 Paket Umroh dan 3000 Emas @ 0,5g (“Hadiah”).</li><li>Batas Penukaran Hadiah: <b>31 Juli 2026 jam 23.59 WIB</b></li></ol>"},{"title":"Cara Mendapatkan Hadiah","content":"<ol type=\"a\"><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md); background-color: rgba(0, 0, 0, 0);\">Beli Sabun Krim Serbaguna Ekonomi kemasan 136g, 175g, dan 350g bertanda khusus \"Gebyar Berkah Umroh, Pesta Emas\" di toko terdekat.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md); background-color: rgba(0, 0, 0, 0);\">Temukan tulisan \"Hadiah Emas 0,5g XXXXXXX (kode unik)\" atau \"Hadiah Umroh XXXXXXX (kode unik)\" dalam kemasan Produk.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Kirim kode unik dan registrasi melalui WhatsApp ke nomor <a href=\"https://wa.me/622150957907\">021 50 957 907</a>. Ikuti petunjuk dan masukkan data diri. Penyelenggara tidak menerima pengiriman kode unik dan registrasi melalui saluran lain selain nomor WhatsApp tersebut.</span><br></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Hadiah hanya akan diberikan kepada pemenang jika kode dinyatakan sah dan valid oleh Penyelenggara. Penyelenggara akan melakukan verifikasi Peserta dan keabsahan kode unik serta kemasan, dengan ketentuan sebagai berikut:</span><ol><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Peserta wajib menunjukkan kemasan yang berisi kode unik pada saat penyerahan hadiah. Apabila peserta tidak dapat menunjukkan kemasan yang berisi kode unik, maka hadiah tersebut akan <span class=\"body-bold\">dibatalkan</span>.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Kemasan yang ditunjukkan harus asli, tidak rusak, dan tidak dimodifikasi, dengan contoh pada gambar di bawah ini:<br><img src=\"https://space.lunaaar.site/berkah-ekonomi/update-21mei-1.webp\"><img src=\"https://space.lunaaar.site/berkah-ekonomi/update-21mei-2.webp\"><br></span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Kemasan yang tidak dapat diterima oleh Penyelenggara adalah kemasan dengan contoh pada gambar di bawah ini:<br><img src=\"https://space.lunaaar.site/berkah-ekonomi/kemasan-tidak-diterima-upd21mei.webp\"><br><br></span></li></ol></li></ol>"},{"title":"Ketentuan Umum","content":"<ol type=\"a\"><li>Program ini tidak berlaku bagi karyawan Wings Group dan anggota keluarganya.</li><li>Penukaran Hadiah hanya dapat dilakukan oleh Warga Negara Indonesia, berusia minimal 17 tahun, memiliki kartu identitas yang sah dan masih berlaku, serta berdomisili di wilayah Negara Republik Indonesia.</li><li>Peserta yang melakukan penukaran hadiah, dianggap:<ol><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">membaca, memahami, dan menyetujui Syarat dan Ketentuan Umum ini yang mengatur pelaksanaan Program.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Memahami dan menyetujui bahwa setiap informasi yang diberikan termasuk data pribadi Peserta yang dikumpulkan dalam rangka pelaksanaan Program ini (“Data Peserta”) adalah benar, tepat, akurat, dan dapat dipertanggungjawabnkan. Data Peserta akan dikumpulkan, digunakan, diproses, dan/atau diungkapkan oleh Penyelenggara untuk keperluan verifikasi, publikasi, promosi, pelaporan, evaluasi, dan/atau pelaksanaan Program, yang dilakukan oleh Penyelenggara;</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Memahami bahwa Penyelenggara berhak mengganti Hadiah dengan jenis atau spesifikasi yang berbeda namun memiliki nilai yang setara jika terjadi keadaan di luar kendali Penyelenggara.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Memahami bahwa Penyelenggara tidak akan bertanggung jawab apabila terjadi penipuan dan/atau tindak pidana lainnya yang mengatasnamakan Program ini. Untuk itu, Peserta diminta untuk berhati-hati dan waspada terhadap modus penipuan dan/atau tindak pidana lainnya yang mungkin mengatasnamakan Program ini serta selalu memastikan berhubungan dengan narahubung Penyelenggara yang ditentukan dalam Syarat dan Ketentuan ini.</span></li></ol></li></ol>"},{"title":"Ketentuan Pemenang","content":"<ol type=\"a\"><li>Pemenang harus memiliki nomor ponsel atau handphone yang bisa dihubungi untuk keperluan verifikasi Peserta dan keabsahan kode unik pada kemasan serta hal-hal lainnya yang berhubungan dengan Program ini dan tidak mengubah nomor ponsel atau handphone selama periode Program berlangsung.</li><li>Pemenang wajib melengkapi seluruh persyaratan yang dibutuhkan oleh Penyelenggara dalam jangka waktu <span class=\"body-bold\">maksimal 30 hari kerja</span> sejak Peserta diumumkan sebagai pemenang. Pemenang yang tidak melengkapi seluruh persyaratan dalam jangka waktu tersebut secara otomatis dianggap melepaskan haknya untuk menerima Hadiah sebagai pemenang dan membebaskan Penyelenggara dari segala tuntutan, klaim, dan/atau gugatan dalam bentuk apapun sehubungan dengan penyerahan Hadiah di masa mendatang.</li><li>Hadiah akan dikirimkan kepada pemenang <span class=\"body-bold\">maksimal 30 hari kerja</span> setelah seluruh syarat-syarat yang diwajibkan oleh Penyelenggara telah dilengkapi oleh Peserta dan telah selesai diverifikasi oleh Penyelenggara.</li><li>Penyelenggara berhak untuk mendiskualifikasi Peserta yang diduga atau terbukti melakukan tindakan-tindakan yang melanggar Syarat dan Ketentuan atau bertindak dengan cara apapun yang dianggap mengganggu kegiatan promosi Penyelenggara.</li><li>Khusus pemenang hadiah umroh, berlaku ketentuan tambahan sebagai berikut:<ol><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Pemenang hadiah umroh akan diberangkatkan dari Bandara Soekarno Hatta, Tangerang (“Bandara”). Seluruh biaya yang dikeluarkan pemenang untuk menuju ke Bandara dan kembali dari Bandara bukan merupakan tanggung jawab Penyelenggara.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Waktu keberangkatan umroh ditentukan oleh Penyelenggara, yang mana keberangkatan akan dilakukan di antara <span class=\"body-bold\">bulan Agustus-Desember 2026</span>.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Jika pemenang Hadiah umroh tidak dapat berangkat pada jadwal yang telah ditentukan oleh Penyelenggara, Hadiah umroh dapat dialihkan kepada pihak lain yang ditunjuk oleh pemenang dengan terlebih dahulu mendapatkan persetujuan tertulis dari Penyelenggara.</span></li><li><span style=\"font-family: var(--font-family-body); font-size: var(--typography-font-size-paragraph-md);\">Pemenang dan/atau pihak lain yang menerima pengalihan dari pemenang, wajib mengikuti seluruh agenda perjalanan yang telah ditetapkan, mengikuti seluruh persyaratan yang ditentukan, dan bersedia didokumentasikan untuk keperluan promosi Penyelenggara.</span></li></ol></li><li>Seluruh Hadiah tidak dapat diuangkan.</li></ol>"},{"title":"Lain-Lain","content":"<ol type=\"a\"><li>Waspadai penipuan yang mengatasnamakan Penyelenggara. Penyelenggara hanya menggunakan nomor <span class=\"body-bold\">WhatsApp resmi 02150957907</span>; <span class=\"body-bold\">081119765007</span> dan <span class=\"body-bold\">081119765008</span> Segala komunikasi yang tidak melalui nomor tersebut bukan merupakan tanggung jawab Penyelenggara.</li><li>Dalam menyelenggarakan Program ini:<ol><li>Penyelenggara telah memperoleh izin dari instansi yang berwenang sesuai dengan peraturan perundang-undangan yang berlaku.</li><li>Penyelenggara tidak memungut biaya apa pun. Apabila terdapat pihak yang mengatasnamakan Penyelenggara yang mengenakan biaya, imbalan, dan/atau sejenisnya kepada Peserta, maka dapat dipastikan bahwa hal itu tidak benar adanya dan merupakan penipuan.</li></ol></li><li>Syarat dan ketentuan ini diatur berdasarkan peraturan perundang-undangan yang berlaku di wilayah Republik Indonesia. Apabila di kemudian hari timbul suatu perselihan antara Peserta dan Penyelenggara sehubungan dengan Program ini maka cara penyelesaian perselisihan dilakukan melalui musyawarah untuk mufakat.</li><li>Keputusan Penyelenggara bersifat final dan tidak dapat diganggu gugat.</li><li>Informasi dan keterangan lebih lanjut, silakan hubungi atau cek:<ul><li>Layanan konsumen <a href=\"https://wa.me/622150957907\">021 50 957 907 </a>(Chat WhatsApp & telepon berbayar)</li><li>Website <a href=\"https://berkah-umroh.sabunkrimekonomi.id/\">www.berkah-umroh.sabunkrimekonomi.id</a></li><li>Instagram <a href=\"https://www.instagram.com/solusirumahnyaman.id/\">@solusirumahnyaman.id</a>&nbsp;<a href=\"https://www.instagram.com/sabunkrimekonomi/\">@sabunkrimekonomi</a></li></ul></li></ol>"},{"title":"Accordion Title","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit."},{"title":"Accordion Title","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}]}
        sectionId={"dialog-tnc"}
        item6Visible={false}
        item7Visible={false}
        item0Id={"dialog-tnc-periode-program"}
        item1Id={"dialog-tnc-hadiah"}
        item2Id={"dialog-tnc-cara-mendapatkan-hadiah"}
        item3Id={"dialog-tnc-ketentuan-umum"}
        item4Id={"dialog-tnc-ketentuan-pemenang"}
        item5Id={"dialog-tnc-lain-lain"}
      />
      <FullBody
        image={"https://space.lunaaar.site/berkah-ekonomi/bg-image.webp"}
        mobileImage={"https://space.lunaaar.site/berkah-ekonomi/bg_mobile.webp"}
        sectionId={"background-body"}
        imageId={"background-body--bg"}
      />
      </StickyManager>
      </div>
    </main>
  );
}
