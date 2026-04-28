"use client";
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./testimony-portrait.module.css";
const DEFAULT_PLACEHOLDER_IMAGE = "https://space.lunaaar.site/assets-lunar/placeholder.svg";
import { componentDefaults } from "./data";


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

// Shim for BuilderText
const BuilderText = ({ tagName = 'p', content, className, style, children, id, sectionId, suffix, isVisible = true, tooltipIfTruncated }) => {
  if (!isVisible) return null;
  const Tag = tagName;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  const effectiveSuffix = suffix || (className ? className.split(' ')[0] : tagName);
  let finalId = id || (normalizedSectionId ? normalizedSectionId + '-' + effectiveSuffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;

  const finalClassName = ("builder-text " + (className || '') + " " + (!content && !children ? 'empty-builder-text' : '')).trim();
  const title = tooltipIfTruncated ? content : undefined;

  // Pattern: If content is a simple string with no HTML, render directly to avoid React 19 dangerouslySetInnerHTML conflicts
  const isSimpleString = content && typeof content === 'string' && !/<[a-z][sS]*>/i.test(content);

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

// Shim for BuilderElement
const BuilderElement = ({ tagName = 'div', className, style, children, id, sectionId, elementProps, isVisible = true, ref }) => {
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
    marqueeDirection = componentDefaults["testimony-portrait"].marqueeDirection
}) {
    // Sanitize data: remove null/undefined entries
    const testimonies = (rawTestimonies || []).filter(item => item !== null && typeof item === 'object');

    const isAutoScroll = autoScroll === true || autoScroll === "true";
    const isFullWidth = fullWidth === true || fullWidth === "true";

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

            showAutoScrollToggle={true}
            autoScroll={isAutoScroll}
            autoScrollEffect={autoScrollEffect}
            marqueeDuration={marqueeDuration}
            marqueeDirection={marqueeDirection}
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
                                    onIdChange={(val) => updateCardId(originalIndex, val)}
                                    elementProps={`testimony-${index}`}
                                    isVisible={item.visible !== false}
                                >
                                    <div className={styles.card}>
                                        <BuilderImage
                                            src={item.image}
                                            onSrcChange={(val) => updateTestimony(originalIndex, "image", val)}
                                            className={styles.backgroundImage}
                                            id={item.imageId}
                                            sectionId={sectionId}
                                            isVisible={item.imageVisible}
                                            onIdChange={(val) => updateTestimony(originalIndex, "imageId", val)}
                                            onVisibilityChange={(val) => updateTestimony(originalIndex, "imageVisible", val)}
                                            suffix={`background-${index}`}
                                            href={item.imageUrl}
                                            onHrefChange={(val) => updateTestimony(originalIndex, "imageUrl", val)}
                                            linkType={item.imageLinkType}
                                            onLinkTypeChange={(val) => updateTestimony(originalIndex, "imageLinkType", val)}
                                            targetDialogId={item.imageTargetDialogId}
                                            onTargetDialogIdChange={(val) => updateTestimony(originalIndex, "imageTargetDialogId", val)}
                                            enableAudio={item.imageEnableAudio}
                                            onEnableAudioChange={(val) => handleUpdateTestimony(originalIndex, 'imageEnableAudio', val)}
                                            autoplay={item.imageAutoplay}
                                            onAutoplayChange={(val) => handleUpdateTestimony(originalIndex, 'imageAutoplay', val)}
                                        />

                                        <div className={styles.contentCard}>
                                            <div className={styles.avatarWrapper}>
                                                <BuilderImage
                                                    src={item.avatar}
                                                    onSrcChange={(val) => updateTestimony(originalIndex, "avatar", val)}
                                                    className={'imagePlaceholder-1-1 object-cover'}
                                                    id={item.avatarId}
                                                    style={{ borderRadius: "var(--border-radius-round)" }}
                                                    sectionId={sectionId}
                                                    isVisible={item.avatarVisible}
                                                    onIdChange={(val) => updateTestimony(originalIndex, "avatarId", val)}
                                                    onVisibilityChange={(val) => updateTestimony(originalIndex, "avatarVisible", val)}
                                                    suffix={`avatar-${index}`}
                                                    href={item.avatarUrl}
                                                    onHrefChange={(val) => updateTestimony(originalIndex, "avatarUrl", val)}
                                                    linkType={item.avatarLinkType}
                                                    onLinkTypeChange={(val) => updateTestimony(originalIndex, "avatarLinkType", val)}
                                                    targetDialogId={item.avatarTargetDialogId}
                                                    onTargetDialogIdChange={(val) => updateTestimony(originalIndex, "avatarTargetDialogId", val)}
                                                    enableAudio={item.avatarEnableAudio}
                                                    onEnableAudioChange={(val) => handleUpdateTestimony(originalIndex, 'avatarEnableAudio', val)}
                                                    autoplay={item.avatarAutoplay}
                                                    onAutoplayChange={(val) => handleUpdateTestimony(originalIndex, 'avatarAutoplay', val)}
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
