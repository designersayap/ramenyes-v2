"use client";
import Link from 'next/link';
import { createUpdateHandler } from "./component-helpers";
const DEFAULT_PLACEHOLDER_IMAGE = "https://space.lunaaar.site/assets-lunar/placeholder.svg";
import styles from "./full-body.module.css";
import { createPortal } from "react-dom";
import { useEffect, useState, useContext, useRef } from 'react'; // Added useContext


const openDialog = (id) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id } }));
    
    // Runtime Fallback: If specific ID fails (e.g. timestamp from old data), try default dialogs
    if (id && id !== 'dialog-item-list' && id !== 'dialog-accordion' && id !== 'dialog-form') {
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-item-list' } }));
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-form' } }));
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-accordion' } }));
    }
  }
};

const showToast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    // In exported files, we can use a simple alert as a fallback
    // or the user can implement their own toast listener
    alert(message);
  }
};

const BuilderImage = ({ src, mobileSrc, alt, className, style, mobileRatio, href, linkType, targetDialogId, id, sectionId, suffix, isPortrait, isVisible = true, priority, aspectRatio, alwaysShowSrc }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const wrapperRef = useRef(null);

  const isVideoFile = (url) => url && typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i);
  const isYoutube = (url) => url && typeof url === 'string' && url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*$/);
  const isVimeo = (url) => url && typeof url === 'string' && url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com)\/.*$/);

  const placeholderSrc = "https://space.lunaaar.site/assets-lunar/placeholder.svg";

  useEffect(() => {
    const isVideo = isVideoFile(src) || isYoutube(src) || isVimeo(src);
    const hasSrc = src && src !== "";
    const isPlaceholder = !src || src === "" || src === placeholderSrc || (typeof src === 'string' && src.includes('assets-lunar/placeholder.svg'));

    // Hydration Safety: On the server (SSR), we render the placeholder (shouldLoad=false)
    // to match the initial client state and avoid hydration mismatches.
    const isSSR = typeof window === 'undefined';
    const needsImmediateLoad = !!(priority || alwaysShowSrc || isPlaceholder || !hasSrc || (!isSSR && !window.IntersectionObserver));
    
    if (isSSR) return;

    if (needsImmediateLoad) {
      setShouldLoad(true);
      return;
    }

    setShouldLoad(false);

    // In exported files, we always use the browser viewport (null)
    const scrollRoot = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { 
        root: scrollRoot, 
        threshold: 0.01,
        rootMargin: '200px' 
    });

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [src, priority, alwaysShowSrc]);

  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  const effectiveAlt = (!alt || alt === '#') && normalizedSectionId ? normalizedSectionId : (alt || '');
  let baseClassName = className || '';
  
  if (isPortrait === true || String(isPortrait) === 'true') {
    const portraitMap = {
        'imagePlaceholder-4-3': 'imagePlaceholder-3-4',
        'imagePlaceholder-16-9': 'imagePlaceholder-9-16',
        'imagePlaceholder-21-9': 'imagePlaceholder-9-21',
        'imagePlaceholder-5-4': 'imagePlaceholder-4-5'
    };
    Object.entries(portraitMap).forEach(([landscape, portrait]) => {
        baseClassName = baseClassName.replace(landscape, portrait);
    });
  }

  if (mobileRatio) {
     baseClassName += " mobile-aspect-" + mobileRatio;
  }
  
  const defaultStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    backgroundColor: "transparent",
    ...style
  };

  // Fix: Ensure navigation logos are not squished (restore object-fit contain)
  if (baseClassName.includes('navigation') || baseClassName.includes('logo') || baseClassName.includes('object-contain')) {
      if (!style || !style.objectFit) {
          defaultStyle.objectFit = 'contain';
      }
  }

  const getYoutubeEmbedUrl = (url) => {
      if (!url) return '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return id ? "https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id + "&controls=0" : url;
  };

  const getVimeoEmbedUrl = (url) => {
      if (!url) return '';
      const regExp = /vimeo\.com\/(\d+)/;
      const match = url.match(regExp);
      const id = match ? match[1] : null;
      return id ? "https://player.vimeo.com/video/" + id + "?autoplay=1&loop=1&muted=1&background=1" : url;
  };

  const imageSrc = (src && src !== "") ? src : placeholderSrc;
  const isLink = href || (linkType === 'dialog' && targetDialogId);
  const mediaStyle = { ...defaultStyle };
  const mediaClass = 'builder-image-media';

  let mediaContent;
  if (isYoutube(src)) {
      mediaContent = shouldLoad ? (
          <iframe
              id={!isLink ? finalId : undefined}
              src={getYoutubeEmbedUrl(src)}
              className={mediaClass}
              style={{ ...mediaStyle, border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="YouTube video"
          />
      ) : <div className={mediaClass} style={{ ...mediaStyle, backgroundColor: '#f3f4f6', minHeight: '100px' }} />;
  } else if (isVimeo(src)) {
      mediaContent = shouldLoad ? (
          <iframe
              id={!isLink ? finalId : undefined}
              src={getVimeoEmbedUrl(src)}
              className={mediaClass}
              style={{ ...mediaStyle, border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title="Vimeo video"
          />
      ) : <div className={mediaClass} style={{ ...mediaStyle, backgroundColor: '#f3f4f6', minHeight: '100px' }} />;
  } else if (isVideoFile(src)) {
      mediaContent = (
          <video
              id={!isLink ? finalId : undefined}
              className={mediaClass}
              style={mediaStyle}
              autoPlay={shouldLoad}
              loop
              muted
              playsInline
              preload="none"
          >
              {shouldLoad && (
                <>
                  {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" />}
                  <source src={src} />
                </>
              )}
              Your browser does not support the video tag.
          </video>
      );
  } else {
      mediaContent = shouldLoad ? (
        <>
            {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
            <img 
                id={!isLink ? finalId : undefined}
                src={imageSrc} 
                alt={effectiveAlt} 
                className={mediaClass} 
                style={mediaStyle} 
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : undefined}
                decoding="async"
            />
        </>
      ) : (
        <div
            id={!isLink ? finalId : undefined}
            className={mediaClass}
            style={{ 
                ...mediaStyle, 
                backgroundColor: '#f3f4f6', 
                minHeight: '100px',
                aspectRatio: aspectRatio ? aspectRatio.replace('-', '/') : undefined
            }}
        />
      );
  }

  const content = (mobileSrc && !isVideoFile(src) && !isYoutube(src) && !isVimeo(src)) ? (
     <picture style={{ display: 'contents' }}>{mediaContent}</picture>
  ) : mediaContent;

  const wrapperStyle = { 
    display: 'block', 
    width: '100%', 
    height: '100%',
    textDecoration: 'none', 
    position: 'relative',
    overflow: 'hidden',
    ...style 
  };

  if (isLink) {
    return (
      <a
         ref={wrapperRef}
         id={finalId}
         href={href || '#'} 
         className={baseClassName} 
         style={wrapperStyle}
         rel="noopener"
         onClick={(e) => {
             if (linkType === 'dialog' && typeof openDialog === 'function') {
                 e.preventDefault();
                 openDialog(targetDialogId);
             }
         }}
      >
        {content}
      </a>
    );
  }

  return <div ref={wrapperRef} className={baseClassName} style={wrapperStyle}>{content}</div>;
};
 // Added import

export default function BackgroundFullBody({ image, mobileImage, imageId, imageVisible, sectionId, uniqueId, onUpdate }) {
    const update = createUpdateHandler(onUpdate);
    const [mounted, setMounted] = useState(false);
    const { activeElementId = '__EXPORTED__' } = {};
  // Context values mocked for export library // Get context

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    // Check if the overall section or component is selected
    const isSectionActive = activeElementId === sectionId || activeElementId === uniqueId;

    const portalRoot = document.getElementById("canvas-background-root");
    if (!portalRoot) return null;
    return createPortal(
        <div className={styles.container}>
            <div className={`container-grid container-full`} style={{ height: '100%' }}>
                <BuilderImage
                    src={image}
                    mobileSrc={mobileImage}
                    isActive={isSectionActive ? true : undefined} // Pass active state if section is active, otherwise let it handle itself
                    onSrcChange={update('image')}
                    onMobileSrcChange={update('mobileImage')}
                    alt="Background Image"
                    className={styles.image}
                    isVisible={imageVisible}
                    sectionId={sectionId}
                    id={imageId}
                    onIdChange={update('imageId')}
                    suffix="bg"
                    showLinkControls={false}
                    style={{ objectPosition: 'top center' }}
                    alwaysShowSrc={true}
                    showAspectRatio={false}
                    showPortraitToggle={false}
                    showMobileRatio={false}
                    showMobileImageSrc={true}
                />
            </div>
        </div>,
        portalRoot
    );
}
