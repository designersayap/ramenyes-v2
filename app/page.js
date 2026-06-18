"use client";

import OsmBanner from "@/components/osm-banner.js";
import NavigationCenter from "@/components/navigation-center.js";
import ScrollGroup from "@/components/scroll-group.js";
import Media54 from "@/components/media-5-4.js";
import Media169 from "@/components/media-16-9.js";
import SpacingSmall from "@/components/spacing-small.js";
import HeaderSection from "@/components/header-section.js";
import Media219 from "@/components/media-21-9.js";
import HeaderTnc from "@/components/header-tnc.js";
import FooterOmnichannel from "@/components/footer-omnichannel.js";
import FullBody from "@/components/full-body.js";
import StickyManager from "@/utils/sticky-manager";
import Notification from "@/components/notification";


export default function ExportedPage() {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'clip', containerType: 'inline-size', containerName: 'root-container' }}>
      <div id="canvas-background-root" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <StickyManager stickyIndices={[0,1]} stackedIndices={[]} blurIndices={[]} overlayIndices={[]}>
      <OsmBanner
        title={"Waspada penipuan! Pemenang tidak dipungut biaya apa pun dan hanya akan dihubungi melalui <b>WhatsApp Resmi 08111-975-1441</b> atau <b>WINGS Customer Care +62 21 50957907</b>."}
        buttonText={"Label"}
        buttonUrl={""}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={""}
        variant={"brand"}
        sectionId={"osm-6550"}
      />
      <NavigationCenter
        logo={"https://space.lunaaar.site/assets-ramenyes/logo_ramen_yes.webp"}
        logoId={""}
        menu1Label={"Hadiah"}
        menu1Url={"#hadiah"}
        menu1LinkType={"url"}
        menu1TargetDialogId={""}
        menu1Id={""}
        menu2Label={"Panduan"}
        menu2Url={"#panduan"}
        menu2LinkType={"url"}
        menu2TargetDialogId={""}
        menu2Id={""}
        menu3Label={"Ketentuan"}
        menu3Url={"#syarat-dan-ketentuan"}
        menu3LinkType={"url"}
        menu3TargetDialogId={""}
        menu3Id={""}
        menu4Label={"Produk"}
        menu4Url={"#title-produk"}
        menu4LinkType={"url"}
        menu4TargetDialogId={""}
        menu4Id={""}
        menuColor={"default"}
        sectionId={"navigation-8754"}
      />
      <ScrollGroup
        image={""}
        mobileImage={""}
        imageIsPortrait={false}
        imageMobileRatio={""}
        scrollEffect={"parallax"}
        components={[{"id":"media-5-4","name":"Media - 5:4","uniqueId":"ea44fdf3-23a1-46fc-a86b-b82599ab01d4","sectionId":"hadiah","image":"https://space.lunaaar.site/assets-ramenyes/headline_5_4.webp","fullWidth":false,"imageShowStroke":"https://space.lunaaar.site/assets-lunar/placeholder.svg","imageIsPortrait":false, component: Media54}, {"id":"media-16-9","name":"Media - 16:9","uniqueId":"0177699e-f35e-4b5e-9f1c-e292b64c176b","sectionId":"tvc","image":"https://space.lunaaar.site/assets-ramenyes/TVC%20Ramen%20YES.webm", component: Media169}, {"id":"spacing-small","name":"Spacing - Small","uniqueId":"19f3cd00-98ef-4083-a494-ee4ea24ffce9","sectionId":"spacing-5028", component: SpacingSmall}]}
        sectionId={"header"}
        enableBlur
        disableEffects
      />
      <HeaderSection
        title={"Mudah Banget Ikutnya!"}
        subtitle={"Lorem Ipsum is simply dummy text of the printing and typesetting industry"}
        subtitleVisible={false}
        buttonStyle={"primary"}
        buttonText={"Label"}
        buttonUrl={""}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={"panduan--button"}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={"panduan--secondary-button"}
        sectionId={"panduan"}
        titleId={"panduan--title"}
        subtitleId={"panduan--subtitle"}
      />
      <Media219
        image={"https://space.lunaaar.site/assets-ramenyes/guidance.webp"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={""}
        imageMobileSrc={""}
        imageAutoplay
        sectionId={"foto-panduan"}
        imageId={"foto-panduan--image"}
      />
      <HeaderSection
        title={"Mekanisme dan Ketentuan"}
        subtitle={"Periode Promo: Juni 2026 – Desember 2026<div>Batas Penukaran Hadiah: 31 Januari 2027</div>"}
        titleVisible
        subtitleVisible={false}
        buttonStyle={"primary"}
        buttonText={"Pelajari Lebih Lanjut"}
        buttonUrl={"#"}
        buttonVisible={false}
        buttonLinkType={"dialog"}
        buttonTargetDialogId={"dialog-item-list"}
        buttonId={"syarat-dan-ketentuan--button"}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={""}
        sectionId={"syarat-dan-ketentuan"}
        titleId={"syarat-dan-ketentuan--title"}
        subtitleId={"syarat-dan-ketentuan--subtitle"}
      />
      <HeaderTnc
        hasCardStyle={false}
        items={[{"title":"Syarat dan ketentuan","description":"<div><b>Periode Promo: Juni 2026 – Desember 2026&nbsp; |&nbsp;&nbsp;<span style=\"background-color: initial;\">Batas Penukaran Hadiah: 31 Januari 2027</span></b></div><div><b><span style=\"background-color: initial;\"><br></span></b></div><ol><li>Temukan stiker hologram pada box kemasan yang bertanda khusus.</li><li>Periksa bagian dalam inner box isi 12 pcs dan gosok stiker hologram untuk mengetahui hadiah yang Anda dapatkan.</li><li>Lepaskan stiker hologram secara perlahan dari inner box dan pastikan stiker tidak rusak atau robek. Simpan stiker hologram sebagai bukti untuk proses penukaran hadiah.</li><li>Penyelenggara tidak bertanggung jawab atas kerusakan stiker hologram sebelum proses penukaran hadiah dilakukan.</li><li>Program ini tidak berlaku bagi karyawan WINGS beserta anggota keluarganya.</li><li>Ramen YES tidak pernah memungut biaya apa pun dari pemenang program yang diselenggarakan oleh Ramen YES.</li><li>Pemenang tidak dipungut biaya apapun. Waspadai penipuan yang mengatasnamakan Ramen YES. Informasi resmi hanya disampaikan melalui WhatsApp Hotline 0811-1975-1441. Segala komunikasi di luar nomor tersebut bukan merupakan tanggung jawab Ramen YES.<br></li></ol>","titleVisible":true,"descriptionVisible":true,"titleId":"","descriptionId":"","cardId":"tnc-card-0","visible":true},{"title":"Cara Penukaran Hadiah","description":"<div><ol><li><span style=\"color: var(--content-neutral--body);\">Langkah Penukaran Hadiah untuk Para Pemenang</span><ol type=\"a\"><li>Hadiah produk dan uang tunai<br>Pemenang dapat menukarkan stiker hologram di toko terdekat yang menjual produk Ramen YES dan berpartisipasi dalam program ini.</li><li>Hadiah selain produk dan uang tunai (mobil, TV, handphone, sepeda listrik, dan emas)<ul><li>Pemenang perlu mengirimkan foto stiker hologram yang memuat kode unik ke WhatsApp Hotline 0811-1975-1441.</li><li>Penyelenggara akan melakukan verifikasi terhadap keabsahan kode unik tersebut. Hadiah hanya akan diberikan apabila kode dinyatakan sah dan valid oleh penyelenggara.</li></ul></li></ol></li><li>Pemenang tidak dapat menukar hadiah dengan bentuk lain<br>Seluruh hadiah diberikan sesuai ketersediaan stok. Apabila hadiah tertentu tidak tersedia, penyelenggara berhak menggantinya dengan hadiah lain yang memiliki nilai setara tanpa pemberitahuan sebelumnya. Penyelenggara tidak berkewajiban menyediakan hadiah yang telah habis atau tidak tersedia pada saat proses penyerahan hadiah dilakukan.</li><li>Pemenang wajib memeriksa kondisi hadiah maksimal 1 x 24 jam setelah hadiah diterima<br>Setelah melewati batas waktu tersebut, penyelenggara tidak bertanggung jawab atas segala bentuk keluhan atau komplain terkait kondisi hadiah.</li><li>Dengan menukarkan hadiah, pemenang dianggap telah:<br>- Membaca, memahami, dan menyetujui seluruh syarat dan ketentuan program.<br>- Bersedia memberikan data pribadi yang diperlukan untuk keperluan administrasi program.<br>- Memberikan izin kepada penyelenggara untuk menggunakan nama, foto, dan/atau dokumentasi pemenang untuk kebutuhan publikasi dan promosi tanpa kompensasi tambahan.</li><li>Seluruh pajak hadiah akan ditanggung oleh penyelenggara.<br>Untuk informasi lebih lanjut, hubungi Hotline 0811-1975-1441 atau kunjungi www.ramenyes.co.id</li></ol></div>","titleVisible":true,"descriptionVisible":true,"visible":true,"cardId":"tnc-item-1"}]}
        sectionId={"detail"}
      />
      <HeaderSection
        title={"Varian Produk"}
        subtitle={"Nikmati pilihan rasa&nbsp;<span style=\"background-color: transparent;\">dari</span><div><b style=\"background-color: transparent;\"><span style=\"color: var(--content-brand--brand);\">Hakata Chicken Ramen</span></b><span style=\"background-color: transparent;\"> dan </span><b style=\"background-color: transparent;\"><span style=\"color: var(--content-brand--brand);\">Tokyo Chicken Yakitori</span></b><span style=\"background-color: transparent;\">.</span></div>"}
        subtitleVisible
        buttonStyle={"primary"}
        buttonText={"Beli Sekarang"}
        buttonUrl={"#https://s.shopee.co.id/gNOKda0aV"}
        buttonVisible={false}
        buttonLinkType={"url"}
        buttonTargetDialogId={""}
        buttonId={"title-produk--button"}
        secondaryButtonText={"Label"}
        secondaryButtonUrl={""}
        secondaryButtonVisible={false}
        secondaryButtonLinkType={"url"}
        secondaryButtonTargetDialogId={""}
        secondaryButtonId={"title-produk--secondary-button"}
        sectionId={"title-produk"}
        titleId={"title-produk--title"}
        subtitleId={"title-produk--subtitle"}
      />
      <Media219
        image={"https://space.lunaaar.site/assets-ramenyes/list_product.webp"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={""}
        imageMobileSrc={""}
        imageAutoplay
        sectionId={"list-produk"}
        imageId={"list-produk--image"}
      />
      <Media219
        image={"https://space.lunaaar.site/assets-ramenyes/product.webp"}
        imageUrl={""}
        imageLinkType={"url"}
        imageTargetDialogId={""}
        fullWidth={false}
        imageIsPortrait={false}
        imageMobileRatio={""}
        imageMobileSrc={""}
        imageAutoplay
        sectionId={"foto-produk"}
        imageId={"foto-produk--image"}
      />
      <FooterOmnichannel
        image={"https://space.lunaaar.site/assets-ramenyes/logo_footer.webp"}
        menuColor={"default"}
        copyrightText={"<span style=\"color: var(--content-neutral--body);\">Copyright © Ramen YES 2026</span>"}
        availableAtTitle={"Temui Kami di Sini"}
        resourcesTitle={"<br>"}
        socialLinks={[{"label":"@RamenYesOfficial","url":"https://www.youtube.com/@RamenYesOfficial","visible":true,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/youtube.webp","imageId":"","linkType":"url","targetDialogId":""},{"label":"@RamenYess","url":"https://www.facebook.com/people/Ramen-Yess/","visible":true,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/facebook.webp","imageId":"","linkType":"url","targetDialogId":""},{"label":"sedaapramenyes@gmail.com","url":"","visible":false,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/email.webp","imageId":"","linkType":"url","targetDialogId":""}]}
        findUsOnLinks={[{"label":"@ramenyes","url":"https://www.instagram.com/ramenyes/","visible":true,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/instagram.webp","imageId":"","linkType":"url","targetDialogId":""},{"label":"@ramenyesofficial","url":"https://www.tiktok.com/@ramenyesofficial","visible":true,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/tiktok.webp","imageId":"","linkType":"url","targetDialogId":""},{"label":"@RamenYesID&nbsp;","url":"https://x.com/ramenyesid","visible":true,"id":"","image":"https://space.lunaaar.site/assets-ramenyes/x.webp","imageId":"","linkType":"url","targetDialogId":""}]}
        resourceLinks={[{"label":"<br>","url":"","visible":false,"id":"","linkType":"url","targetDialogId":""},{"label":"<br>","url":"","visible":false,"id":"","linkType":"url","targetDialogId":""}]}
        sectionId={"footer-9097"}
      />
      <FullBody
        image={"https://space.lunaaar.site/assets-ramenyes/bg_desktop.webp"}
        mobileImage={"https://space.lunaaar.site/assets-ramenyes/bg_full_mobile.webp"}
        sectionId={"background-4812"}
      />
      </StickyManager>
      </div>
      <Notification />
    </main>
  );
}
