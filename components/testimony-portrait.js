"use client";
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./testimony-portrait.module.css";
const DEFAULT_PLACEHOLDER_IMAGE = "";
import { componentDefaults } from "./data";


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

const BuilderText = ({ tagName = 'p', content, className, style, children, id, sectionId, suffix, isVisible = true, tooltipIfTruncated, onUpdate, ...rest }) => {
  if (!isVisible) return null;
  const Tag = tagName;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  const effectiveSuffix = suffix || (className ? className.split(' ')[0] : tagName);
  let finalId = id || (normalizedSectionId ? normalizedSectionId + '-' + effectiveSuffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  const finalClassName = ("builder-text " + (className || '') + " " + (!content && !children ? 'empty-builder-text' : '')).trim();
  const title = tooltipIfTruncated ? content : undefined;
  const isSimpleString = content && typeof content === 'string' && !/<[a-z]|&[a-z0-9#]+;/i.test(content);
  return (
    <Tag
      id={finalId}
      className={finalClassName}
      style={style}
      dangerouslySetInnerHTML={content && !isSimpleString ? { __html: content } : undefined}
      title={title}
    >
      {isSimpleString ? content : (!content ? children : null)}
    </Tag>
  );
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

  const mediaStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block", ...style };
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

const BuilderElement = ({ tagName = 'div', className, style, children, id, sectionId, elementProps, isVisible = true, ref, onIdChange, onVisibilityChange, onLabelChange, ...rest }) => {
  if (!isVisible) return null;
  const Tag = tagName;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  const suffix = elementProps || 'element';
  let finalId = id || (normalizedSectionId ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  return <Tag ref={ref} id={finalId} className={className} style={style}>{children}</Tag>;
};

export default function TestimonyPortrait({
    testimonies: rawTestimonies = componentDefaults["testimony-portrait"].testimonies,
    sectionId,
    onUpdate,
    fullWidth,
    removePaddingLeft,
    removePaddingRight,
    autoScroll = componentDefaults["testimony-portrait"].autoScroll,
    autoScrollEffect = componentDefaults["testimony-portrait"].autoScrollEffect,
    marqueeDuration = componentDefaults["testimony-portrait"].marqueeDuration,
    marqueeDirection = componentDefaults["testimony-portrait"].marqueeDirection,
    imageShowStroke = componentDefaults["testimony-portrait"].imageShowStroke
}) {
    // Sanitize data: remove null/undefined entries
    const testimonies = (rawTestimonies || []).filter(item => item !== null && typeof item === 'object');

    const isAutoScroll = autoScroll === true || autoScroll === "true";
    const isFullWidth = fullWidth === true || fullWidth === "true";
    const isStrokeEnabled = imageShowStroke === true || imageShowStroke === "true";

    const scrollContainerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(testimonies.length);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Fix: Use a ref to hold the latest state so the callback can be stable
    // (BuilderText ignores prop changes to onChange for performance, so we must provide a stable function)
    const latestStateRef = useRef({ testimonies, onUpdate });
    latestStateRef.current = { testimonies, onUpdate };

    const updateTestimony = useCallback((index, key, value) => {
        const { testimonies: currentTestimonies, onUpdate: currentOnUpdate } = latestStateRef.current;
        if (!currentOnUpdate) return;

        const newTestimonies = [...currentTestimonies];
        newTestimonies[index] = { ...newTestimonies[index], [key]: value };
        currentOnUpdate({ testimonies: newTestimonies });
    }, []);

    const updateCardId = (index, newId) => {
        updateTestimony(index, 'cardId', newId);
    };

    const visibleCardsString = testimonies.map(t => t?.visible).join(',');

    useEffect(() => {
        const visibleTestimonies = testimonies.filter(t => t.visible !== false);
        setTotalItems(visibleTestimonies.length > 0 ? visibleTestimonies.length : (testimonies.length > 0 ? 1 : 0));
    }, [testimonies, visibleCardsString]);

    useEffect(() => {
        const calculatePages = () => {
            if (!scrollContainerRef.current) return;

            const container = scrollContainerRef.current;
            const containerWidth = container.scrollWidth;
            const viewportWidth = container.clientWidth;

            if (containerWidth && viewportWidth > 0) {
                const pages = Math.ceil(containerWidth / viewportWidth);
                setTotalPages(Number.isFinite(pages) ? Math.max(1, pages) : 1);
            } else {
                setTotalPages(1);
            }
        };

        // Delay calculation slightly to ensure DOM has updated
        const timer = setTimeout(calculatePages, 100);

        window.addEventListener('resize', calculatePages);
        return () => {
            window.removeEventListener('resize', calculatePages);
            clearTimeout(timer);
        };
    }, [testimonies.length, visibleCardsString]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const viewportWidth = container.clientWidth;
            const scrollWidth = container.scrollWidth;
            const maxScroll = scrollWidth - viewportWidth;

            // 1. Calculate Active Index (for 1-by-1 slide sequence)
            const items = Array.from(container.querySelectorAll(`.${styles.itemWrapper}`))
                .filter(item => item.offsetParent !== null);

            if (items.length > 0) {
                let closestIndex = 0;
                let minDistance = Infinity;

                items.forEach((item, index) => {
                    const distance = Math.abs(scrollLeft - item.offsetLeft);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                if (closestIndex !== activeIndex) {
                    setActiveIndex(closestIndex);
                }
            }

            // 2. Calculate Current Page (for pagination indicators)
            // Use ratio-based calculation to handle small overflows correctly
            if (maxScroll > 0 && totalPages > 1) {
                const ratio = scrollLeft / maxScroll;
                const page = Math.round(ratio * (totalPages - 1));
                if (page !== currentPage) {
                    setCurrentPage(page);
                }
            } else if (currentPage !== 0) {
                setCurrentPage(0);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex, currentPage]);

    const scrollToIndex = (index) => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const items = Array.from(container.querySelectorAll(`.${styles.itemWrapper}`))
            .filter(item => item.offsetParent !== null);

        if (!items[index]) return;

        const item = items[index];
        const scrollPosition = item.offsetLeft;

        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };

    const scrollToPage = (pageIndex) => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const viewportWidth = container.clientWidth;
        const scrollPosition = pageIndex * viewportWidth;

        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoScroll || isPaused || totalItems <= 1 || autoScrollEffect !== 'slide') return;

        const timer = setInterval(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const { scrollLeft, scrollWidth, clientWidth } = container;
            const maxScroll = scrollWidth - clientWidth;

            // If we are at the end (or very close), reset to 0
            if (scrollLeft >= maxScroll - 10) {
                scrollToIndex(0);
            } else {
                scrollToIndex(activeIndex + 1);
            }
        }, 4000);

        return () => clearInterval(timer);
    }, [activeIndex, totalItems, isPaused, autoScroll, autoScrollEffect]);

    const visibleCount = testimonies.filter(t => t.visible !== false).length;
    let filteredTestimonies = testimonies;
    if (visibleCount === 0 && testimonies.length > 0) {
        // If no visible testimonies, show the first one as a fallback (minimum 1 card)
        const validFallback = testimonies.find(t => t !== null && typeof t === 'object');
        filteredTestimonies = validFallback ? [validFallback] : [];
    }

    // For marquee, we need enough items to fill the screen for a seamless loop
    const displayItems = [];
    let repeatCount = 1;

    // Filtered testimonies with their original indices
    const mappedTestimonies = filteredTestimonies.map((item, originalIndex) => ({
        data: item,
        originalIndex: testimonies.indexOf(item) // Get index from base testimonies array
    }));

    if (isAutoScroll && autoScrollEffect === 'marquee' && mappedTestimonies.length > 0) {
        // Aim for at least 16 items total to ensure the screen is always filled (matching landscape's wide buffer)
        repeatCount = Math.max(3, Math.ceil(16 / mappedTestimonies.length));
        for (let i = 0; i < repeatCount; i++) {
            displayItems.push(...mappedTestimonies);
        }
    } else {
        displayItems.push(...mappedTestimonies);
    }

    const shouldCenter = !isAutoScroll || (totalPages <= 1 && autoScrollEffect !== 'marquee');

    return (
        <BuilderSection
            tagName="section"
            className={styles.container}
            innerContainer={!isFullWidth}
            sectionId={sectionId}
            fullWidth={isFullWidth}
            removePaddingLeft={removePaddingLeft}
            removePaddingRight={removePaddingRight}
            autoScroll={isAutoScroll}
            autoScrollEffect={autoScrollEffect}
            marqueeDuration={marqueeDuration}
            marqueeDirection={marqueeDirection}
            imageShowStroke={isStrokeEnabled}
            onShowStrokeChange={(val) => onUpdate({ imageShowStroke: val })}
        >
            <div className="grid">
                <div className="col-mobile-4 col-tablet-8 col-desktop-12">
                    <div className={styles.scrollWrapper}>
                        <div
                            ref={scrollContainerRef}
                            className={`${styles.cardsWrapper} ${isAutoScroll && autoScrollEffect === 'marquee' ? styles.marquee : ''}`}
                            style={{
                                justifyContent: shouldCenter ? 'center' : 'start',
                                '--marquee-repeat-count': repeatCount,
                                '--marquee-duration': `${marqueeDuration || 120}s`
                            }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            data-paused={isPaused}
                            data-direction={marqueeDirection}
                        >
                            {displayItems.map(({ data: item, originalIndex }, index) => item && (
                                <BuilderElement
                                    key={index}
                                    tagName="div"
                                    className={styles.itemWrapper}
                                    id={item.cardId}
                                    sectionId={sectionId}
                                    elementProps={`testimony-${index}`}
                                    isVisible={item.visible !== false}
                                >
                                    <div className={styles.card}>
                                        <BuilderImage
                                            src={item.image}
                                            className={styles.backgroundImage}
                                            id={item.imageId}
                                            sectionId={sectionId}
                                            isVisible={item.imageVisible}
                                            suffix={`background-${index}`}
                                            enableAudio={item.imageEnableAudio}
                                            autoplay={item.imageAutoplay}
                                            showStroke={isStrokeEnabled}
                                            showLinkControls={false}
                                            showLinkType={false}
                                        />

                                        <div className={styles.contentCard}>
                                            <div className={styles.avatarWrapper}>
                                                <BuilderImage
                                                    src={item.avatar}
                                                    className={'imagePlaceholder-1-1 object-cover'}
                                                    style={{ borderRadius: "var(--border-radius-round)" }}
                                                    id={item.avatarId}
                                                    sectionId={sectionId}
                                                    isVisible={item.avatarVisible}
                                                    suffix={`avatar-${index}`}
                                                    enableAudio={item.avatarEnableAudio}
                                                    autoplay={item.avatarAutoplay}
                                                    showLinkControls={false}
                                                    showLinkType={false}
                                                />
                                            </div>
                                            <BuilderText
                                                tagName="div"
                                                className={`h5 truncate-1-line ${styles.name}`}
                                                content={item.name || ""}
                                                onChange={(val) => updateTestimony(originalIndex, "name", val)}
                                                sectionId={sectionId}
                                                tooltipIfTruncated={true}
                                                suffix="name"
                                            />

                                            <BuilderText
                                                tagName="div"
                                                className={`body-regular ${styles.role}`}
                                                content={item.role || ""}
                                                onChange={(val) => updateTestimony(originalIndex, "role", val)}
                                                sectionId={sectionId}
                                                suffix="role"
                                            />

                                            <BuilderText
                                                tagName="div"
                                                className={`body-regular truncate-2-lines ${styles.description}`}
                                                content={item.description || ""}
                                                onChange={(val) => updateTestimony(originalIndex, "description", val)}
                                                sectionId={sectionId}
                                                tooltipIfTruncated={true}
                                                suffix="description"
                                            />
                                        </div>
                                    </div>
                                </BuilderElement>
                            ))}
                        </div>
                    </div>

                    {totalPages > 1 && !(isAutoScroll && autoScrollEffect === 'marquee') && (
                        <div className="scroll-indicator-pills">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <div
                                    key={index}
                                    className={currentPage === index ? "indicator-pill-active" : "indicator-pill"}
                                    onClick={() => scrollToPage(index)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </BuilderSection >
    );
}
