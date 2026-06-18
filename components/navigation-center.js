"use client";
import * as Icons from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from "./navigation.module.css";
const DEFAULT_PLACEHOLDER_IMAGE = "";
import { createUpdateHandler } from "./component-helpers";
import { componentDefaults } from "./data";
import { Bars3Icon } from '@heroicons/react/24/solid';


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

export default function NavigationCenter({
    sectionId,
    logo = componentDefaults["navigation-center"].logo,
    logoId,
    logoVisible,

    menu1Label = componentDefaults["navigation-center"].menu1Label,
    menu1Url = componentDefaults["navigation-center"].menu1Url,
    menu1Visible = true,
    menu1LinkType = componentDefaults["navigation-center"].menu1LinkType,
    menu1TargetDialogId = componentDefaults["navigation-center"].menu1TargetDialogId,
    menu1Id,

    menu2Label = componentDefaults["navigation-center"].menu2Label,
    menu2Url = componentDefaults["navigation-center"].menu2Url,
    menu2Visible = true,
    menu2LinkType = componentDefaults["navigation-center"].menu2LinkType,
    menu2TargetDialogId = componentDefaults["navigation-center"].menu2TargetDialogId,
    menu2Id,

    menu3Label = componentDefaults["navigation-center"].menu3Label,
    menu3Url = componentDefaults["navigation-center"].menu3Url,
    menu3Visible = true,
    menu3LinkType = componentDefaults["navigation-center"].menu3LinkType,
    menu3TargetDialogId = componentDefaults["navigation-center"].menu3TargetDialogId,
    menu3Id,

    menu4Label = componentDefaults["navigation-center"].menu4Label,
    menu4Url = componentDefaults["navigation-center"].menu4Url,
    menu4Visible = true,
    menu4LinkType = componentDefaults["navigation-center"].menu4LinkType,
    menu4TargetDialogId = componentDefaults["navigation-center"].menu4TargetDialogId,
    menu4Id,
    isOverlay, // Added prop
    menuColor, // Added prop
    logoShowStroke,
    onUpdate
}) {
    const update = createUpdateHandler(onUpdate);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [portalContainer, setPortalContainer] = useState(null);

    // Check for empty, null, or matching the specific placeholder ID structure
    const isPlaceholder = !logo || (typeof logo === 'string' && logo.includes('assets-lunar/placeholder.svg'));
    const logoStyle = {
        objectFit: isPlaceholder ? 'cover' : 'contain'
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPortalContainer(document.body);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Check window scroll first (Staging/Export)
            let scrollTop = window.scrollY;

            const canvasContainer = document.getElementById('canvas-scroll-container');
            if (canvasContainer) {
                scrollTop = canvasContainer.scrollTop;
            }

            if (scrollTop > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Attach to window (for Staging/Export)
        window.addEventListener('scroll', handleScroll);

        // Attach to builder canvas (for Page Builder)
        // Use a retry mechanism to ensure we find the container even if it mounts slightly later
        const attachScrollListener = (retries = 0) => {
            const canvasContainer = document.getElementById('canvas-scroll-container');
            if (canvasContainer) {
                canvasContainer.addEventListener('scroll', handleScroll);
                // Trigger once to set initial state
                handleScroll();
            } else if (retries < 10) {
                setTimeout(() => attachScrollListener(retries + 1), 200);
            }
        };

        attachScrollListener();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            const canvasContainer = document.getElementById('canvas-scroll-container');
            if (canvasContainer) {
                canvasContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const menuItems = [
        {
            label: menu1Label,
            url: menu1Url,
            visible: menu1Visible,
            linkType: menu1LinkType,
            targetDialogId: menu1TargetDialogId,
            id: menu1Id,
            handlers: {
                onLabelChange: update('menu1Label'),
                onUrlChange: update('menu1Url'),
                onLinkTypeChange: update('menu1LinkType'),
                onTargetDialogIdChange: update('menu1TargetDialogId'),
                onIdChange: update('menu1Id')
            },
            suffix: 'menu-1',
            mobileSuffix: 'mobile-menu-1'
        },
        {
            label: menu2Label,
            url: menu2Url,
            visible: menu2Visible,
            linkType: menu2LinkType,
            targetDialogId: menu2TargetDialogId,
            id: menu2Id,
            handlers: {
                onLabelChange: update('menu2Label'),
                onUrlChange: update('menu2Url'),
                onLinkTypeChange: update('menu2LinkType'),
                onTargetDialogIdChange: update('menu2TargetDialogId'),
                onIdChange: update('menu2Id')
            },
            suffix: 'menu-2',
            mobileSuffix: 'mobile-menu-2'
        },
        {
            label: menu3Label,
            url: menu3Url,
            visible: menu3Visible,
            linkType: menu3LinkType,
            targetDialogId: menu3TargetDialogId,
            id: menu3Id,
            handlers: {
                onLabelChange: update('menu3Label'),
                onUrlChange: update('menu3Url'),
                onLinkTypeChange: update('menu3LinkType'),
                onTargetDialogIdChange: update('menu3TargetDialogId'),
                onIdChange: update('menu3Id')
            },
            suffix: 'menu-3',
            mobileSuffix: 'mobile-menu-3'
        },
        {
            label: menu4Label,
            url: menu4Url,
            visible: menu4Visible,
            linkType: menu4LinkType,
            targetDialogId: menu4TargetDialogId,
            id: menu4Id,
            handlers: {
                onLabelChange: update('menu4Label'),
                onUrlChange: update('menu4Url'),
                onLinkTypeChange: update('menu4LinkType'),
                onTargetDialogIdChange: update('menu4TargetDialogId'),
                onIdChange: update('menu4Id')
            },
            suffix: 'menu-4',
            mobileSuffix: 'mobile-menu-4'
        }
    ];

    return (
        <BuilderSection
            tagName="nav"
            className={`${styles.navigationWrapper} z-content-1 ${isScrolled ? styles.scrolled : ''} ${isOverlay ? styles.overlay : ''} ${menuColor === 'invert' ? styles.invert : ''}`}
            sectionId={sectionId}
            isOverlay={isOverlay}
            menuColor={menuColor}
            showMenuColorToggle={true}
            fullWidth={true}
            showFullWidthControl={false}
        >
            <div className="container-grid">
                <div className="grid align-center">
                    {menuItems.slice(0, 2).map((item, index) => (
                        <div
                            key={`desktop-${item.suffix}`}
                            className={`col-desktop-2 ${index === 0 ? 'offset-desktop-1 offset-tablet-1' : ''} ${styles.desktopNav} ${styles.menuItemWrapper}`}
                        >
                            <div className={styles.truncatedText}>
                                <BuilderLink
                                    label={item.label}
                                    href={item.url}
                                    sectionId={sectionId}
                                    id={item.id}
                                    className={`${styles.linkNav} body-bold`}
                                    suffix={item.suffix}
                                    fullWidth={true}
                                    isVisible={item.visible}
                                    linkType={item.linkType}
                                    targetDialogId={item.targetDialogId}
                                    tooltipIfTruncated={true}
                                />
                            </div>
                        </div>
                    ))}

                    <div className={`col-desktop-2 col-tablet-2 ${styles.desktopNav} ${styles.logoWrapper}`}>
                        <div className={styles.logoContainer}>
                            <BuilderImage
                                src={logo}
                                id={logoId}
                                sectionId={sectionId}
                                isVisible={logoVisible}
                                suffix="logo"
                                className={styles.logoImage}
                                style={logoStyle}
                                showLinkControls={false}
                                alwaysShowSrc={false}
                                showAspectRatio={false}
                                showMobileRatio={false}
                            />
                        </div>
                    </div>

                    {menuItems.slice(2, 4).map((item) => (
                        <div
                            key={`desktop-${item.suffix}`}
                            className={`col-desktop-2 ${styles.desktopNav} ${styles.menuItemWrapper}`}
                        >
                            <div className={styles.truncatedText}>
                                <BuilderLink
                                    label={item.label}
                                    href={item.url}
                                    sectionId={sectionId}
                                    id={item.id}
                                    className={`${styles.linkNav} body-bold`}
                                    suffix={item.suffix}
                                    fullWidth={true}
                                    isVisible={item.visible}
                                    linkType={item.linkType}
                                    targetDialogId={item.targetDialogId}
                                    tooltipIfTruncated={true}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Mobile Layout */}
                    {(() => {
                        const hasVisibleMenu = menuItems.some(item => item.visible);

                        return (
                            <>
                                <div className={`${hasVisibleMenu ? 'col-mobile-2 col-tablet-4' : 'col-mobile-4 col-tablet-8'} ${styles.mobileNav} ${styles.mobileLogoWrapper} ${!hasVisibleMenu ? styles.mobileLogoCenter : ''}`}>
                                    <div className={styles.logoContainer}>
                                        <BuilderImage
                                            src={logo}
                                            id={logoId}
                                            isVisible={logoVisible}
                                            readOnly={true}
                                            className={styles.logoImage}
                                            style={logoStyle}
                                        />
                                    </div>
                                </div>

                                {hasVisibleMenu && (
                                    <div className={`col-mobile-2 col-tablet-4 ${styles.mobileNav} ${styles.mobileBurgerWrapper}`}>
                                        <button
                                            className={styles.burgerButton}
                                            onClick={() => setIsMobileMenuOpen(true)}
                                        >
                                            <Bars3Icon style={{ width: 24, height: 24 }} />
                                        </button>
                                    </div>
                                )}
                            </>
                        );
                    })()}

                </div >
            </div>

            {/* Mobile Menu Dialog - Rendered via Portal */}
            {
                portalContainer && createPortal(
                    <>
                        <div className="overlay z-system-modal-fullscreen" onClick={() => setIsMobileMenuOpen(false)} style={{ display: isMobileMenuOpen ? 'flex' : 'none', pointerEvents: 'auto' }} />
                        <div className={`${styles.dialogWrapper} z-system-modal-fullscreen ${isMobileMenuOpen ? styles.open : ''}`}>
                            <div className="container-grid">
                                <div className="grid">
                                    <div className={`${styles.mobileDialog} col-12 col-mobile-4 col-tablet-4 col-desktop-6 offset-desktop-3 offset-tablet-2`}>
                                        {menuItems.map((item) => (
                                            <div key={`mobile-${item.mobileSuffix}`} className={styles.mobileMenuLink}>
                                                <BuilderLink
                                                    label={item.label}
                                                    href={item.url}
                                                    sectionId={sectionId}
                                                    id={undefined}
                                                    suffix={item.mobileSuffix}
                                                    className={`${styles.mobileLinkText} ${styles.linkNav} body-bold`}
                                                    fullWidth={true}
                                                    isVisible={item.visible}
                                                    linkType={item.linkType}
                                                    targetDialogId={item.targetDialogId}
                                                    tooltipIfTruncated={true}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>,
                    portalContainer
                )
            }
        </BuilderSection>
    );
}
