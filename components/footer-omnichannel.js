"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from "./footer-omnichannel.module.css";
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

// Shim for BuilderLink
const BuilderLink = ({ label, href, className, style, children, linkType, targetDialogId, id, sectionId, suffix, iconLeft, iconRight, justify, hideLabel, isVisible = true }) => {
  if (!isVisible) return null;
  const normalizedSectionId = (sectionId && typeof sectionId === 'string') ? sectionId.replace(/-+$/, '') : '';
  let finalId = id || (normalizedSectionId && suffix ? normalizedSectionId + '-' + suffix : undefined);
  finalId = finalId ? finalId.replace(/-+/g, '-') : undefined;
  
  const isSimpleLabel = label && typeof label === 'string' && !/<[a-z][sS]*>/i.test(label);

  const content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify || 'center', width: '100%', height: '100%', gap: 'inherit' }}>
         {iconLeft && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{iconLeft}</span>}
          {!hideLabel && (
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: justify || 'center' }}>
                 {isSimpleLabel ? label : (label && typeof label === 'string' ? <span dangerouslySetInnerHTML={{ __html: label }} /> : (label || children))}
              </div>
          )}
         {iconRight && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{iconRight}</span>}
      </div>
  );

  if (linkType === 'dialog' && targetDialogId) {
    return (
      <a
        id={finalId}
        href="#"
        className={className}
        style={style}
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

const SocialIcons = {
    facebook: (
        <div className={`${styles.socialIcon} icon-social-mask icon-social-facebook`} />
    ),
    twitter: (
        <div className={`${styles.socialIcon} icon-social-mask icon-social-x`} />
    ),
    instagram: (
        <div className={`${styles.socialIcon} icon-social-mask icon-social-instagram`} />
    ),
    tiktok: (
        <div className={`${styles.socialIcon} icon-social-mask icon-social-tiktok`} />
    ),
    youtube: (
        <div className={`${styles.socialIcon} icon-social-mask icon-social-youtube`} />
    ),
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
    removePaddingRight
}) {
    const update = createUpdateHandler(onUpdate);
    const defaults = componentDefaults["footer-omnichannel"];

    return (
        <footer className={styles.footer} id={sectionId}>
            <div className={getContainerClasses({ fullWidth, removePaddingLeft, removePaddingRight })}>
                <div className={`grid items-center-desktop`}>
                    {/* Left Column: Logo */}
                    <div className={`col-mobile-4 col-tablet-8 col-desktop-6`}>
                        <div className={styles.leftColumn}>
                            <div className={styles.logoWrapper}>
                                <BuilderImage
                                    src={image}
                                    onSrcChange={update('image')}
                                    className={`${styles.image} object-contain`}
                                    id={imageId}
                                    sectionId={sectionId}
                                    isVisible={imageVisible}
                                    onIdChange={update('imageId')}
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
                                            onLabelChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].label = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
                                            onHrefChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].url = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
                                            linkType={link.linkType}
                                            onLinkTypeChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].linkType = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
                                            targetDialogId={link.targetDialogId}
                                            onTargetDialogIdChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].targetDialogId = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
                                            onIdChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].id = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
                                            onVisibilityChange={(val) => {
                                                const newLinks = [...findUsOnLinks];
                                                newLinks[index].visible = val;
                                                update('findUsOnLinks')(newLinks);
                                            }}
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
                                                        className="object-contain"
                                                        style={{ width: '100%', height: '100%' }}
                                                        showLinkControls={false}
                                                    />
                                                </div>
                                            }
                                            className={`${styles.linkFooter} body-regular`}
                                            suffix={`link-${index + 1}`}
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
                                            onLabelChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].label = val;
                                                update('socialLinks')(newLinks);
                                            }}
                                            onHrefChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].url = val;
                                                update('socialLinks')(newLinks);
                                            }}
                                            linkType={link.linkType}
                                            onLinkTypeChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].linkType = val;
                                                update('socialLinks')(newLinks);
                                            }}
                                            targetDialogId={link.targetDialogId}
                                            onTargetDialogIdChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].targetDialogId = val;
                                                update('socialLinks')(newLinks);
                                            }}
                                            onIdChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].id = val;
                                                update('socialLinks')(newLinks);
                                            }}
                                            onVisibilityChange={(val) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[index].visible = val;
                                                update('socialLinks')(newLinks);
                                            }}
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
                                                        className="object-contain"
                                                        style={{ width: '100%', height: '100%' }}
                                                        showLinkControls={false}
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
                                        onLabelChange={(val) => {
                                            const newLinks = [...resourceLinks];
                                            newLinks[index].label = val;
                                            update('resourceLinks')(newLinks);
                                        }}
                                        onHrefChange={(val) => {
                                            const newLinks = [...resourceLinks];
                                            newLinks[index].url = val;
                                            update('resourceLinks')(newLinks);
                                        }}
                                        linkType={link.linkType}
                                        onLinkTypeChange={(val) => {
                                            const newLinks = [...resourceLinks];
                                            newLinks[index].linkType = val;
                                            update('resourceLinks')(newLinks);
                                        }}
                                        targetDialogId={link.targetDialogId}
                                        onTargetDialogIdChange={(val) => {
                                            const newLinks = [...resourceLinks];
                                            newLinks[index].targetDialogId = val;
                                            update('resourceLinks')(newLinks);
                                        }}
                                        onVisibilityChange={(val) => {
                                            const newLinks = [...resourceLinks];
                                            newLinks[index].visible = val;
                                            update('resourceLinks')(newLinks);
                                        }}
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
        </footer>
    );
}

