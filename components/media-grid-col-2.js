"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import styles from "./media-grid-col-2.module.css";
import { componentDefaults } from "./data";
import { createUpdateHandler } from "./component-helpers";


const openDialog = (id) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id } }));
    
    // Runtime Fallback: If specific ID fails, try default dialogs
    if (id && id !== 'dialog-item-list' && id !== 'dialog-accordion' && id !== 'dialog-form') {
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-item-list' } }));
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-form' } }));
        window.dispatchEvent(new CustomEvent('lunar:open-dialog', { detail: { id: 'dialog-accordion' } }));
    }
  }
};
const PlayIcon = ({ style }) => <svg style={style} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;

const BuilderSection = ({ tagName = 'div', className, innerContainer, fullWidth, style, children, id, sectionId, isVisible = true, removePaddingLeft, removePaddingRight, onUpdate, ...rest }) => {
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
        <div className={containerClass}>{children}</div>
      </Tag>
    );
  }
  return <Tag id={finalId} className={containerClass + " " + (className || '')} style={style}>{children}</Tag>;
};

const BuilderImage = ({ src, mobileSrc, alt, className, style, mobileRatio, href, linkType, targetDialogId, id, sectionId, suffix, isPortrait, isVisible = true, priority, aspectRatio, alwaysShowSrc, showStroke, autoplay, enableAudio, onUpdate, ...rest }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const isAutoplay = autoplay === true || autoplay === "true" || autoplay === undefined;
  const isAudioEnabled = enableAudio === true || enableAudio === "true";
  const [isPlaying, setIsPlaying] = useState(isAutoplay);
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);

  const isVideoFile = (url) => url && typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i);
  const isYoutube = (url) => url && typeof url === 'string' && url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*$/);
  const isVimeo = (url) => url && typeof url === 'string' && url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com)\/.*$/);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const needsImmediateLoad = !!(priority || alwaysShowSrc || !src || src === "" || (!typeof window === 'undefined' && !window.IntersectionObserver));
    if (needsImmediateLoad) { setShouldLoad(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setShouldLoad(true); observer.disconnect(); }
    }, { threshold: 0.01, rootMargin: '200px' });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [src, priority, alwaysShowSrc, href, linkType]);

  useEffect(() => {
    if (isAutoplay && shouldLoad && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isAutoplay, shouldLoad]);

  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  const effectiveAlt = alt || '';
  const isStrokeEnabled = showStroke === true || showStroke === "true";
  let baseClassName = (className || '') + ' builder-image-container' + (isStrokeEnabled ? ' has-stroke' : '');
  if (mobileRatio) baseClassName += " mobile-aspect-" + mobileRatio;

  const mediaStyle = { width: "100%", height: "100%", objectFit: ((className || '').includes('navigation') || (className || '').includes('logo') || (className || '').includes('object-contain')) ? 'contain' : 'cover', display: "block", ...style };
  const mediaClass = 'builder-image-media';

  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? "https://www.youtube.com/embed/" + id + "?autoplay=" + (isAutoplay ? 1 : 0) + "&mute=" + (isAudioEnabled ? 0 : 1) + "&loop=1&playlist=" + id + "&controls=0" : url;
  };

  const getVimeoEmbedUrl = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    const id = match ? match[1] : null;
    return id ? "https://player.vimeo.com/video/" + id + "?autoplay=" + (isAutoplay ? 1 : 0) + "&loop=1&muted=" + (isAudioEnabled ? 0 : 1) + "&background=" + (isAutoplay ? 1 : 0) : url;
  };

  let mediaContent;
  if (isYoutube(src)) {
    mediaContent = shouldLoad ? <iframe src={getYoutubeEmbedUrl(src)} className={mediaClass} style={{ ...mediaStyle, border: 'none' }} allow="autoplay; fullscreen" allowFullScreen /> : <div className={mediaClass} style={mediaStyle} />;
  } else if (isVimeo(src)) {
    mediaContent = shouldLoad ? <iframe src={getVimeoEmbedUrl(src)} className={mediaClass} style={{ ...mediaStyle, border: 'none' }} allow="autoplay; fullscreen" allowFullScreen /> : <div className={mediaClass} style={mediaStyle} />;
  } else if (isVideoFile(src)) {
    mediaContent = (
      <>
        <video 
          ref={videoRef} 
          className={mediaClass} 
          style={mediaStyle} 
          autoPlay={isAutoplay && shouldLoad} 
          loop 
          muted={!isAudioEnabled} 
          playsInline 
          preload={!isAutoplay ? "auto" : (shouldLoad ? "metadata" : "none")} 
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          }}
        >
          {shouldLoad && (
            <>
              {mobileSrc && <source src={mobileSrc && !mobileSrc.startsWith('http') ? encodeURI(mobileSrc) : mobileSrc} media="(max-width: 767px)" />}
              {src && <source src={(src && !src.startsWith('http') ? encodeURI(src) : src) + (!isAutoplay ? "#t=0.001" : "")} />}
            </>
          )}
        </video>
        {!isPlaying && (
          <button type="button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, border: 'none' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (videoRef.current) videoRef.current.play(); }}>
            <PlayIcon style={{ color: 'white', width: '32px', height: '32px' }} />
          </button>
        )}
      </>
    );
  } else {
    const imgContent = <img src={src || "https://space.lunaaar.site/assets-lunar/placeholder.svg"} alt={effectiveAlt} className={mediaClass} style={mediaStyle} loading={priority ? "eager" : "lazy"} />;
    mediaContent = shouldLoad ? (
      mobileSrc ? (
        <picture style={{ display: 'contents' }}>
          <source media="(max-width: 767px)" srcSet={mobileSrc} />
          {imgContent}
        </picture>
      ) : imgContent
    ) : <div className={mediaClass} style={mediaStyle} />;
  }

  const wrapperStyle = { display: 'block', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', ...style };
  if (href || (linkType === 'dialog' && targetDialogId)) {
    return <a ref={wrapperRef} id={finalId} href={href || '#'} className={baseClassName} style={wrapperStyle} onClick={(e) => { if (linkType === 'dialog') { e.preventDefault(); openDialog(targetDialogId); } }}>{mediaContent}</a>;
  }
  return <div ref={wrapperRef} className={baseClassName} style={wrapperStyle}>{mediaContent}</div>;
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
    marqueeDirection = componentDefaults["media-grid-col-2"].marqueeDirection,
    imageShowStroke = componentDefaults["media-grid-col-2"].imageShowStroke
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
            aspectRatio={aspectRatio}
            autoScroll={isAutoScroll}
            autoScrollEffect={autoScrollEffect}
            marqueeDuration={marqueeDuration}
            marqueeDirection={marqueeDirection}
            imageShowStroke={imageShowStroke}
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
                                className={styles.image}
                                id={item.cardId}
                                sectionId={sectionId}
                                isVisible={item.visible}
                                suffix={`image-${item.originalIndex}`}
                                href={item.imageUrl}
                                linkType={item.imageLinkType}
                                targetDialogId={item.imageTargetDialogId}
                                isPortrait={item.imageIsPortrait}
                                mobileRatio={item.imageMobileRatio}
                                showMobileRatio={false}
                                enableAudio={item.imageEnableAudio}
                                autoplay={item.imageAutoplay}
                                showStroke={imageShowStroke}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </BuilderSection>
    );
}
