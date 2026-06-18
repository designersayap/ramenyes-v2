"use client";
import * as Icons from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from "./footer-omnichannel.module.css";
import { componentDefaults } from "./data";
import { createUpdateHandler } from "./component-helpers";
import React, { useState, useEffect, useRef } from 'react';


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

const BuilderLink = ({ label, href, className, style, children, linkType, targetDialogId, id, sectionId, suffix, iconLeft, iconRight, justify, hideLabel, isVisible = true, onUpdate, ...rest }) => {
  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  const renderIcon = (icon) => {
    if (typeof icon === 'string' && typeof Icons !== 'undefined' && Icons[icon]) {
      const IconComponent = Icons[icon];
      return <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />;
    }
    return typeof icon === 'string' ? null : icon;
  };
  const isSimpleLabel = label && typeof label === 'string' && !/<[a-z]|&[a-z0-9#]+;/i.test(label);
  const content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify || 'center', width: '100%', height: '100%', gap: 'inherit' }}>
         {renderIcon(iconLeft) && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{renderIcon(iconLeft)}</span>}
          {!hideLabel && (
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: justify || 'center' }}>
                 {isSimpleLabel ? label : (label && typeof label === 'string' ? <span dangerouslySetInnerHTML={{ __html: label }} /> : (label || children))}
              </div>
          )}
         {renderIcon(iconRight) && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{renderIcon(iconRight)}</span>}
      </div>
  );
  if (linkType === 'dialog' && targetDialogId) {
    return (
      <a id={finalId} href="#" className={className} style={style} rel="noopener" onClick={(e) => { e.preventDefault(); openDialog(targetDialogId); }}>{content}</a>
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

export default function FooterOmnichannel({
    image = componentDefaults["footer-omnichannel"].image,
    imageId,
    imageVisible,
    copyrightText = componentDefaults["footer-omnichannel"].copyrightText,
    socialLinks = componentDefaults["footer-omnichannel"].socialLinks,
    availableAtTitle = componentDefaults["footer-omnichannel"].availableAtTitle,
    findUsOnLinks = componentDefaults["footer-omnichannel"].findUsOnLinks,
    resourcesTitle = componentDefaults["footer-omnichannel"].resourcesTitle,
    resourceLinks = componentDefaults["footer-omnichannel"].resourceLinks,
    onUpdate,
    sectionId,
    fullWidth,
    removePaddingLeft,
    removePaddingRight,
    imageShowStroke,
    menuColor = componentDefaults["footer-omnichannel"].menuColor
}) {
    const update = createUpdateHandler(onUpdate);
    const defaults = componentDefaults["footer-omnichannel"];

    return (
        <BuilderSection
            tagName="footer"
            sectionId={sectionId}
            className={`${styles.footer} ${menuColor === 'invert' ? styles.invert : ''}`}
            showMenuColorToggle={true}
            showFullWidthControl={false}
            menuColor={menuColor}
            fullWidth={fullWidth}
            removePaddingLeft={removePaddingLeft}
            removePaddingRight={removePaddingRight}
        >
            <div className="container-grid">
                <div className="grid">
                    {/* Left Column: Logo */}
                    <div className={`col-mobile-4 col-tablet-8 col-desktop-6`}>
                        <div className={styles.leftColumn}>
                            <div className={styles.logoWrapper}>
                                <BuilderImage
                                    src={image}
                                    className={styles.image}
                                    id={imageId}
                                    sectionId={sectionId}
                                    isVisible={imageVisible}
                                    suffix="logo"
                                    showLinkType={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Available at (Tersedia Di) */}
                    <div className={`col-mobile-4 col-tablet-4 col-desktop-3`}>
                        <div className={styles.column}>
                            <BuilderText
                                tagName="p"
                                className={`body-bold ${styles.columnTitle} truncate-1-line`}
                                content={availableAtTitle || defaults.availableAtTitle}
                                onChange={update('availableAtTitle')}
                                sectionId={sectionId}
                                suffix="available-at-title"
                            />
                            <div className={styles.linkList}>
                                {findUsOnLinks.slice(0, 3).map((link, index) => (
                                    <div key={link.id || index} className={styles.linkWrapper}>
                                        <BuilderLink
                                            id={link.id}
                                            label={link.label}
                                            href={link.url}
                                            isVisible={link.visible}
                                            sectionId={sectionId}
                                            linkType={link.linkType}
                                            targetDialogId={link.targetDialogId}
                                            justify="flex-start"
                                            iconLeft={
                                                <div style={{ width: 16, height: 16, position: 'relative', overflow: 'hidden' }}>
                                                    <BuilderImage
                                                        src={link.image}
                                                        onSrcChange={(val) => {
                                                            const newLinks = [...findUsOnLinks];
                                                            newLinks[index].image = val;
                                                            update('findUsOnLinks')(newLinks);
                                                        }}
                                                        id={link.imageId}
                                                        onIdChange={(val) => {
                                                            const newLinks = [...findUsOnLinks];
                                                            newLinks[index].imageId = val;
                                                            update('findUsOnLinks')(newLinks);
                                                        }}
                                                        sectionId={sectionId}
                                                        suffix={`available-at-icon-${index}`}
                                                        className="object-cover"
                                                        style={{ width: '100%', height: '100%' }}
                                                        showLinkControls={false}
                                                        showStrokeToggle={false}
                                                    />
                                                </div>
                                            }
                                            className={`${styles.linkFooter} body-regular`}
                                            suffix={`marketplace-${index + 1}`}
                                            fullWidth={true}
                                            tooltipIfTruncated={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Follow Us (Ikuti Kami) */}
                    <div className={`col-mobile-4 col-tablet-4 col-desktop-3`}>
                        <div className={styles.column}>
                            <BuilderText
                                tagName="p"
                                className={`body-bold ${styles.columnTitle} truncate-1-line`}
                                content={resourcesTitle || defaults.resourcesTitle}
                                onChange={update('resourcesTitle')}
                                sectionId={sectionId}
                                suffix="resources-title"
                            />
                            <div className={styles.linkList}>
                                {socialLinks.slice(0, 3).map((link, index) => (
                                    <div key={link.id || index} className={styles.linkWrapper}>
                                        <BuilderLink
                                            id={link.id}
                                            label={link.label}
                                            href={link.url}
                                            isVisible={link.visible}
                                            sectionId={sectionId}
                                            linkType={link.linkType}
                                            targetDialogId={link.targetDialogId}
                                            justify="flex-start"
                                            iconLeft={
                                                <div style={{ width: 16, height: 16, position: 'relative', overflow: 'hidden' }}>
                                                    <BuilderImage
                                                        src={link.image}
                                                        onSrcChange={(val) => {
                                                            const newLinks = [...socialLinks];
                                                            newLinks[index].image = val;
                                                            update('socialLinks')(newLinks);
                                                        }}
                                                        id={link.imageId}
                                                        onIdChange={(val) => {
                                                            const newLinks = [...socialLinks];
                                                            newLinks[index].imageId = val;
                                                            update('socialLinks')(newLinks);
                                                        }}
                                                        sectionId={sectionId}
                                                        suffix={`social-icon-${index}`}
                                                        className="object-cover"
                                                        style={{ width: '100%', height: '100%' }}
                                                        showLinkControls={false}
                                                        showStrokeToggle={false}
                                                    />
                                                </div>
                                            }
                                            className={`${styles.linkFooter} body-regular`}
                                            suffix={`social-${index + 1}`}
                                            fullWidth={true}
                                            tooltipIfTruncated={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className={styles.divider} />

                {/* Bottom Bar: Copyright & Legal Links */}
                <div className={`${styles.bottomBar} grid items-center`}>
                    <div className="col-mobile-4 col-tablet-4 col-desktop-9">
                        <div className={styles.column}>
                            <BuilderText
                                tagName="p"
                                className={`caption-regular ${styles.copyright}`}
                                content={copyrightText || defaults.copyrightText}
                                onChange={update('copyrightText')}
                                sectionId={sectionId}
                                suffix="copyright"
                            />
                        </div>
                    </div>
                    <div className="col-mobile-4 col-tablet-4 col-desktop-3">
                        <div className={styles.column}>
                            <div className={styles.legalLinks}>
                                {resourceLinks.map((link, index) => (
                                    <BuilderLink
                                        key={link.id || index}
                                        id={link.id}
                                        label={link.label}
                                        href={link.url}
                                        isVisible={link.visible}
                                        sectionId={sectionId}
                                        linkType={link.linkType}
                                        targetDialogId={link.targetDialogId}
                                        className={`${styles.legalLink} caption-regular`}
                                        suffix={`legal-${index + 1}`}
                                        justify="flex-start"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BuilderSection>
    );
}

