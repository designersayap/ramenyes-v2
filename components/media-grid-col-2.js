"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import styles from "./media-grid-col-2.module.css";
import { componentDefaults } from "./data";
import { createUpdateHandler } from "./component-helpers";


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

// Shim for BuilderSection
const BuilderSection = ({ tagName = 'div', className, innerContainer, fullWidth, style, children, id, sectionId, isVisible = true, removePaddingLeft, removePaddingRight }) => {
  if (!isVisible) return null;
  const Tag = tagName;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || normalizedSectionId;
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  
  const containerClasses = ["container-grid"];
  if (removePaddingLeft === true || removePaddingLeft === "true") containerClasses.push("pl-0");
  if (removePaddingRight === true || removePaddingRight === "true") containerClasses.push("pr-0");
  if (fullWidth === true || fullWidth === "true") containerClasses.push("container-full");
  const containerClass = containerClasses.join(" ");
  
  if (innerContainer) {
    return (
      <Tag id={finalId} className={className} style={style}>
        <div className={containerClass}>
          {children}
        </div>
      </Tag>
    );
  }

  return <Tag id={finalId} className={containerClass + " " + (className || '')} style={style}>{children}</Tag>;
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

export default function MediaGridCol2({
    images: rawImages = componentDefaults["media-grid-col-2"].images,
    onUpdate,
    sectionId,
    fullWidth,
    hasFloatingEffect = componentDefaults["media-grid-col-2"].hasFloatingEffect,
    aspectRatio = componentDefaults["media-grid-col-2"].aspectRatio,
    autoScroll = componentDefaults["media-grid-col-2"].autoScroll,
    autoScrollEffect = componentDefaults["media-grid-col-2"].autoScrollEffect,
    marqueeDuration = componentDefaults["media-grid-col-2"].marqueeDuration,
    marqueeDirection = componentDefaults["media-grid-col-2"].marqueeDirection
}) {
    // Sanitize data
    const images = (rawImages || []).filter(item => item !== null && typeof item === 'object');

    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleUpdateImage = (index, key, value) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], [key]: value };
        onUpdate({ images: newImages });
    };

    // Filter only visible images for the layout
    const visibleImages = images.map((img, i) => ({ ...img, originalIndex: i }))
        .filter(img => img && img.visible !== false);

    const isAutoScroll = autoScroll === true || autoScroll === "true";
    const isMarquee = isAutoScroll && autoScrollEffect === "marquee";
    const [isPaused, setIsPaused] = useState(false);

    // For marquee, we need enough items to fill the screen for a seamless loop
    const displayItems = [];
    let repeatCount = 1;

    if (isMarquee && visibleImages.length > 0) {
        // Aim for enough items to ensure no gaps during animation
        repeatCount = Math.max(3, Math.ceil(12 / visibleImages.length));
        for (let i = 0; i < repeatCount; i++) {
            displayItems.push(...visibleImages);
        }
    } else {
        displayItems.push(...visibleImages);
    }

    return (
        <BuilderSection
            tagName="section"
            className={styles.container}
            innerContainer={true}
            sectionId={sectionId}
            fullWidth={fullWidth}

            showFullWidthControl={false}
            showFloatingToggle={true}
            hasFloatingEffect={hasFloatingEffect}
            showAspectRatioToggle={true}
            aspectRatio={aspectRatio}
            autoScroll={isAutoScroll}
            autoScrollEffect={autoScrollEffect}
            marqueeDuration={marqueeDuration}
            marqueeDirection={marqueeDirection}
        >
            <div
                ref={containerRef}
                className={`${styles.mediaGrid} ${isVisible ? styles.animated : ""} ${isMarquee ? styles.marquee : ""}`}
                onMouseEnter={() => isMarquee && setIsPaused(true)}
                onMouseLeave={() => isMarquee && setIsPaused(false)}
                data-paused={isPaused}
                data-direction={marqueeDirection}
                style={{
                    '--marquee-repeat-count': repeatCount,
                    '--marquee-duration': `${marqueeDuration || 60}s`
                }}
            >
                {displayItems.map((item, index) => (
                    <div
                        key={`${item.cardId || index}-${index}`}
                        className={`${styles.itemWrapper} ${isVisible ? (hasFloatingEffect ? (index % 2 === 0 ? "animate-bounce-and-float" : "animate-bounce-and-float-alt") : "animate-bounce-in-down") : ""}`}
                        style={{ 
                            animationDelay: (isVisible && !isMarquee) ? `${index * 0.15}s` : "0s"
                        }}
                    >
                        <div 
                            className={styles.imageWrapper} 
                            style={{ aspectRatio: aspectRatio ? aspectRatio.replace('-', ' / ') : 'auto' }}
                        >
                            <BuilderImage
                                src={item.image}
                                onSrcChange={(val) => handleUpdateImage(item.originalIndex, 'image', val)}
                                className={styles.image}
                                id={item.cardId}
                                sectionId={sectionId}
                                isVisible={item.visible}
                                onIdChange={(val) => handleUpdateImage(item.originalIndex, 'cardId', val)}
                                suffix={`image-${item.originalIndex}`}
                                href={item.imageUrl}
                                onHrefChange={(val) => handleUpdateImage(item.originalIndex, 'imageUrl', val)}
                                linkType={item.imageLinkType}
                                onLinkTypeChange={(val) => handleUpdateImage(item.originalIndex, 'imageLinkType', val)}
                                targetDialogId={item.imageTargetDialogId}
                                onTargetDialogIdChange={(val) => handleUpdateImage(item.originalIndex, 'imageTargetDialogId', val)}
                                isPortrait={item.imageIsPortrait}
                                onIsPortraitChange={(val) => handleUpdateImage(item.originalIndex, 'imageIsPortrait', val)}
                                showPortraitToggle={false}
                                mobileRatio={item.imageMobileRatio}
                                onMobileRatioChange={(val) => handleUpdateImage(item.originalIndex, 'imageMobileRatio', val)}
                                showMobileRatio={false}
                                mobileSrc={item.imageMobileSrc}
                                onMobileSrcChange={(val) => handleUpdateImage(item.originalIndex, 'imageMobileSrc', val)}
                                enableAudio={item.imageEnableAudio}
                                onEnableAudioChange={(val) => handleUpdateImage(item.originalIndex, 'imageEnableAudio', val)}
                                autoplay={item.imageAutoplay}
                                onAutoplayChange={(val) => handleUpdateImage(item.originalIndex, 'imageAutoplay', val)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </BuilderSection>
    );
}
