"use client";
import { createElement } from 'react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { createUpdateHandler } from "./component-helpers";
import styles from "./osm-banner.module.css";
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

export default function OsmBanner({
    title = "Information Banner",

    buttonText = componentDefaults["osm-banner"].buttonText,
    buttonUrl = componentDefaults["osm-banner"].buttonUrl,
    buttonLinkType = componentDefaults["osm-banner"].buttonLinkType || "url",
    buttonTargetDialogId = componentDefaults["osm-banner"].buttonTargetDialogId,
    buttonIconLeft = componentDefaults["osm-banner"].buttonIconLeft,
    buttonIconRight = componentDefaults["osm-banner"].buttonIconRight,
    buttonId,
    buttonVisible = componentDefaults["osm-banner"].buttonVisible,

    isOverlay, // Added
    onUpdate,
    sectionId,
    className = "",
    isVisible = true,
    fullWidth,
    removePaddingLeft,
    removePaddingRight
}) {
    const update = createUpdateHandler(onUpdate);
    const [isClosed, setIsClosed] = useState(false);
    const [isMarquee, setIsMarquee] = useState(false);
    const [marqueeOffset, setMarqueeOffset] = useState(0);
    const [marqueeDuration, setMarqueeDuration] = useState(10); // Default duration
    const textWrapperRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (textWrapperRef.current && textRef.current) {
                const wrapper = textWrapperRef.current;
                const scrollWidth = wrapper.scrollWidth;
                const clientWidth = wrapper.clientWidth;
                if (scrollWidth > clientWidth) {
                    setIsMarquee(true);
                    setMarqueeOffset(scrollWidth - clientWidth);
                    const duration = Math.max(8, (scrollWidth - clientWidth) / 50);
                    setMarqueeDuration(duration);
                } else {
                    setIsMarquee(false);
                    setMarqueeOffset(0);
                }
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [title, buttonVisible]); // Re-check when content changes

    if (isClosed || isVisible === false) return null;

    return (
        <BuilderSection
            tagName="div"
            className={`${styles.banner} z-content-1 ${className}`}
            sectionId={sectionId}

            isOverlay={isOverlay}
            showFullWidthControl={false}
            fullWidth={true}
        >
            <div className="container-grid">
                <div className="grid align-center">
                    <div className={`col-mobile-4 col-tablet-8 col-desktop-12 ${styles.content}`}>
                        <div
                            className={`${styles.marqueeWrapper} ${isMarquee ? styles.marqueeMask : ''}`}
                            ref={textWrapperRef}
                        >
                            <div
                                ref={textRef}
                                style={{
                                    display: isMarquee ? 'inline-block' : 'block',
                                    width: isMarquee ? 'auto' : '100%',
                                    '--marquee-offset': `-${marqueeOffset}px`,
                                    '--marquee-duration': `${marqueeDuration}s`
                                }}
                            >
                                <BuilderText
                                    tagName="p"
                                    className={`body-regular ${styles.title} ${isMarquee ? styles.marquee : ''}`}
                                    content={title}
                                    onChange={update('title')}
                                    sectionId={sectionId}
                                    multiline={false}
                                    suffix="title"
                                />
                            </div>
                        </div>
                        {buttonVisible && (
                            <BuilderButton
                                label={buttonText}
                                href={buttonUrl}
                                isVisible={buttonVisible}
                                sectionId={sectionId}
                                className="btn btn-outline btn-sm"
                                onLabelChange={update('buttonText')}
                                onHrefChange={update('buttonUrl')}
                                onVisibilityChange={update('buttonVisible')}
                                linkType={buttonLinkType}
                                onLinkTypeChange={update('buttonLinkType')}
                                targetDialogId={buttonTargetDialogId}
                                onTargetDialogIdChange={update('buttonTargetDialogId')}
                                iconLeft={buttonIconLeft}
                                iconRight={buttonIconRight}
                                onIconLeftChange={update('buttonIconLeft')}
                                onIconRightChange={update('buttonIconRight')}
                                id={buttonId}
                                onIdChange={update('buttonId')}
                                suffix="button"
                            />
                        )}
                        <div className={`${styles.actions} z-content-1`}>
                            <button
                                className="btn btn-icon btn-neutral btn-sm"
                                onClick={() => setIsClosed(true)}
                                aria-label="Close banner"
                            >
                                <XMarkIcon style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </BuilderSection>
    );
}
