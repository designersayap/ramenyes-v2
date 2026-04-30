"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import styles from "./feature-image-left.module.css";
const DEFAULT_PLACEHOLDER_IMAGE = "";
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

const getContainerClasses = ({ removePaddingLeft, removePaddingRight, fullWidth }) => {
  const classes = ["container-grid"];
  if (removePaddingLeft) classes.push("pl-0");
  if (removePaddingRight) classes.push("pr-0");
  if (fullWidth) classes.push("container-full");
  return classes.join(" ");
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

const BuilderButton = ({ label, href, className, style, children, linkType, targetDialogId, id, sectionId, suffix, iconLeft, iconRight, hideLabel, isVisible = true, onUpdate, ...rest }) => {
  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  const renderIcon = (icon) => icon;
  const isSimpleLabel = label && typeof label === 'string' && !/<[a-z]|&[a-z0-9#]+;/i.test(label);
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
      <a id={finalId} href="#" className={className} style={{ ...style, cursor: 'pointer', textDecoration: 'none' }} rel="noopener" onClick={(e) => { e.preventDefault(); openDialog(targetDialogId); }}>{content}</a>
    );
  }
  return <a id={finalId} href={href || '#'} className={className} style={style} rel="noopener">{content}</a>;
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
        >
          {shouldLoad && (
            <>
              {mobileSrc && <source src={mobileSrc && !mobileSrc.startsWith('http') ? encodeURI(mobileSrc) : mobileSrc} media="(max-width: 767px)" />}
              {src && <source src={(src && !src.startsWith('http') ? encodeURI(src) : src) + (!isAutoplay ? "#t=0.001" : "")} />}
            </>
          )}
        </video>
        {!isPlaying && (
          <button type="button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, border: 'none' }} onClick={(e) => { e.preventDefault(); if (videoRef.current) videoRef.current.play(); }}>
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
    imageAutoplay = componentDefaults["feature-image-left"].imageAutoplay,
    imageShowStroke
}) {
    const update = createUpdateHandler(onUpdate);

    return (
        <section className={styles.container} id={sectionId}>
            <div className={getContainerClasses({ fullWidth, removePaddingLeft, removePaddingRight })}>
                <div className="grid align-center">
                    <div className={`imageWrapper ${styles.imageWrapper} col-mobile-4 col-tablet-4 col-desktop-6`} style={{ paddingRight: "var(--gap-md)", paddingLeft: "var(--gap-md)" }}>
                        <BuilderImage
                            src={image}
                            className=""
                            style={{ aspectRatio: (imageRatio || '1-1').replace('-', '/') }}
                            id={imageId}
                            sectionId={sectionId}
                            isVisible={imageVisible}
                            suffix="image"
                            href={imageUrl}
                            linkType={imageLinkType}
                            targetDialogId={imageTargetDialogId}
                            aspectRatio={imageRatio}
                            enableAudio={imageEnableAudio}
                            autoplay={imageAutoplay}
                            showStroke={imageShowStroke}
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
                                    onVariantChange={update('buttonStyle')}
                                    linkType={buttonLinkType}
                                    targetDialogId={buttonTargetDialogId}
                                    onIconLeftChange={update('buttonIconLeft')}
                                    onIconRightChange={update('buttonIconRight')}
                                    id={buttonId}
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
                                    onVariantChange={update('secondaryButtonStyle')}
                                    linkType={secondaryButtonLinkType}
                                    targetDialogId={secondaryButtonTargetDialogId}
                                    iconLeft={secondaryButtonIconLeft}
                                    iconRight={secondaryButtonIconRight}
                                    onIconLeftChange={update('secondaryButtonIconLeft')}
                                    onIconRightChange={update('secondaryButtonIconRight')}
                                    id={secondaryButtonId}
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
