"use client";
import { createElement } from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import styles from "./feature-image-left.module.css";
const DEFAULT_PLACEHOLDER_IMAGE = "https://space.lunaaar.site/assets-lunar/placeholder.svg";
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

// Shim for getContainerClasses
const getContainerClasses = ({ removePaddingLeft, removePaddingRight, fullWidth }) => {
  const classes = ["container-grid"];
  if (removePaddingLeft) classes.push("pl-0");
  if (removePaddingRight) classes.push("pr-0");
  if (fullWidth) classes.push("container-full");
  return classes.join(" ");
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

// Shim for BuilderButton
const BuilderButton = ({ label, href, className, style, children, linkType, targetDialogId, id, sectionId, suffix, iconLeft, iconRight, hideLabel, isVisible = true }) => {
  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;

  // Resolve Icons (Lightweight Fallback)
  const renderIcon = (icon) => {
      if (!icon) return null;
      // In exported mode, icons are handled via props if they were passed as JSX, 
      // or we can add a simple lookup if needed.
      return icon;
  };

  const isSimpleLabel = label && typeof label === 'string' && !/<[a-z][sS]*>/i.test(label);

  const content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: 'inherit' }}>
         {renderIcon(iconLeft) && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{renderIcon(iconLeft)}</span>}
          {!hideLabel && (
             <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSimpleLabel ? label : (label && typeof label === 'string' ? <span dangerouslySetInnerHTML={{ __html: label }} /> : (label || children))}
             </div>
          )}
         {renderIcon(iconRight) && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{renderIcon(iconRight)}</span>}
      </div>
  );

  if (linkType === 'dialog' && targetDialogId) {
    return (
      <a
        id={finalId}
        href="#"
        className={className}
        style={{ ...style, cursor: 'pointer', textDecoration: 'none' }}
        rel="noopener"
        onClick={(e) => {
             e.preventDefault();
             openDialog(targetDialogId);
        }}
      >
        {content}
      </a>
    );
  }
  return (
    <a
      id={finalId}
      href={href || '#'} 
      className={className} 
      style={style}
      rel="noopener"
    >
        {content}
    </a>
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

export default function FeatureImageLeft({
    title = componentDefaults["feature-image-left"].title,
    subtitle = componentDefaults["feature-image-left"].subtitle,
    buttonText = componentDefaults["feature-image-left"].buttonText,
    buttonUrl = componentDefaults["feature-image-left"].buttonUrl,
    buttonVisible = componentDefaults["feature-image-left"].buttonVisible,
    buttonLinkType = componentDefaults["feature-image-left"].buttonLinkType || "url",
    buttonTargetDialogId = componentDefaults["feature-image-left"].buttonTargetDialogId,
    buttonIconLeft = componentDefaults["feature-image-left"].buttonIconLeft,
    buttonIconRight = componentDefaults["feature-image-left"].buttonIconRight,
    secondaryButtonText = componentDefaults["feature-image-left"].secondaryButtonText,
    secondaryButtonUrl = componentDefaults["feature-image-left"].secondaryButtonUrl,
    secondaryButtonVisible = componentDefaults["feature-image-left"].secondaryButtonVisible,
    secondaryButtonLinkType = componentDefaults["feature-image-left"].secondaryButtonLinkType || "url",
    secondaryButtonTargetDialogId = componentDefaults["feature-image-left"].secondaryButtonTargetDialogId,
    secondaryButtonIconLeft = componentDefaults["feature-image-left"].secondaryButtonIconLeft,
    secondaryButtonIconRight = componentDefaults["feature-image-left"].secondaryButtonIconRight,
    image = componentDefaults["feature-image-left"].image,
    imageId,
    imageVisible,
    imageUrl,
    imageLinkType,
    imageTargetDialogId,
    buttonStyle = "primary",
    secondaryButtonStyle = "ghost",
    buttonId,
    secondaryButtonId,
    onUpdate,
    sectionId,
    fullWidth,
    removePaddingLeft,
    removePaddingRight,
    titleVisible = true,
    subtitleVisible = true,
    titleId,
    subtitleId,
    imageRatio,
    imageEnableAudio,
    imageAutoplay = componentDefaults["feature-image-left"].imageAutoplay
}) {
    const update = createUpdateHandler(onUpdate);

    return (
        <section className={styles.container} id={sectionId}>
            <div className={getContainerClasses({ fullWidth, removePaddingLeft, removePaddingRight })}>
                <div className="grid align-center">
                    <div className={`imageWrapper ${styles.imageWrapper} col-mobile-4 col-tablet-4 col-desktop-6`} style={{ paddingRight: "var(--gap-md)", paddingLeft: "var(--gap-md)" }}>
                        <BuilderImage
                            src={image}
                            onSrcChange={update('image')}
                            className=""
                            style={{ aspectRatio: (imageRatio || '1-1').replace('-', '/') }}
                            id={imageId}
                            sectionId={sectionId}
                            isVisible={imageVisible}
                            onIdChange={update('imageId')}
                            suffix="image"
                            href={imageUrl}
                            onHrefChange={update('imageUrl')}
                            linkType={imageLinkType}
                            onLinkTypeChange={update('imageLinkType')}
                            targetDialogId={imageTargetDialogId}
                            onTargetDialogIdChange={update('imageTargetDialogId')}
                            aspectRatio={imageRatio}
                            onAspectRatioChange={update('imageRatio')}
                            enableAudio={imageEnableAudio}
                            onEnableAudioChange={update('imageEnableAudio')}
                            autoplay={imageAutoplay}
                            onAutoplayChange={update('imageAutoplay')}
                        />
                    </div>

                    <div className={`${styles.content} col-mobile-4 col-tablet-4 col-desktop-6`}>
                        {titleVisible && (
                            <BuilderText
                                tagName="h2"
                                className={`h2 ${styles.title}`}
                                style={{ marginBottom: "var(--gap-sm)" }}
                                content={title}
                                onChange={update('title')}
                                sectionId={sectionId}
                                id={titleId}
                                suffix="title"
                                onIdChange={update('titleId')}
                            />
                        )}
                        {subtitleVisible && (
                            <BuilderText
                                tagName="div"
                                className="subheader-h1"
                                style={{ color: "var(--content-neutral--body)", marginBottom: "var(--gap-md)" }}
                                content={subtitle}
                                onChange={update('subtitle')}
                                sectionId={sectionId}
                                id={subtitleId}
                                suffix="subtitle"
                                onIdChange={update('subtitleId')}
                            />
                        )}
                        <div className="buttonWrapperLeft" suppressHydrationWarning>
                            {buttonVisible && (
                                <BuilderButton
                                    label={buttonText}
                                    href={buttonUrl}
                                    isVisible={buttonVisible}
                                    sectionId={sectionId}
                                    className={`btn btn-${buttonStyle} btn-lg`}
                                    iconLeft={buttonIconLeft}
                                    iconRight={buttonIconRight}
                                    onLabelChange={update('buttonText')}
                                    onHrefChange={update('buttonUrl')}
                                    onVisibilityChange={update('buttonVisible')}
                                    onVariantChange={update('buttonStyle')}
                                    linkType={buttonLinkType}
                                    onLinkTypeChange={update('buttonLinkType')}
                                    targetDialogId={buttonTargetDialogId}
                                    onTargetDialogIdChange={update('buttonTargetDialogId')}
                                    onIconLeftChange={update('buttonIconLeft')}
                                    onIconRightChange={update('buttonIconRight')}
                                    id={buttonId}
                                    onIdChange={update('buttonId')}
                                    suffix="button"
                                />
                            )}
                            {secondaryButtonVisible && (
                                <BuilderButton
                                    label={secondaryButtonText}
                                    href={secondaryButtonUrl}
                                    isVisible={secondaryButtonVisible}
                                    sectionId={sectionId}
                                    className={`btn btn-${secondaryButtonStyle} btn-lg`}
                                    onLabelChange={update('secondaryButtonText')}
                                    onHrefChange={update('secondaryButtonUrl')}
                                    onVisibilityChange={update('secondaryButtonVisible')}
                                    onVariantChange={update('secondaryButtonStyle')}
                                    linkType={secondaryButtonLinkType}
                                    onLinkTypeChange={update('secondaryButtonLinkType')}
                                    targetDialogId={secondaryButtonTargetDialogId}
                                    onTargetDialogIdChange={update('secondaryButtonTargetDialogId')}
                                    iconLeft={secondaryButtonIconLeft}
                                    iconRight={secondaryButtonIconRight}
                                    onIconLeftChange={update('secondaryButtonIconLeft')}
                                    onIconRightChange={update('secondaryButtonIconRight')}
                                    id={secondaryButtonId}
                                    onIdChange={update('secondaryButtonId')}
                                    suffix="secondary-button"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
