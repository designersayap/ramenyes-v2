"use client";
import { useState } from 'react';
import * as Icons from '@heroicons/react/24/outline';
import Link from 'next/link';

import { componentDefaults } from "./data";
import { createUpdateHandler } from "./component-helpers";
import styles from "./header-section.module.css";


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
  const renderIcon = (icon) => {
    if (typeof icon === 'string' && typeof Icons !== 'undefined' && Icons[icon]) {
      const IconComponent = Icons[icon];
      return <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />;
    }
    return typeof icon === 'string' ? null : icon;
  };
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

export default function HeaderSection({
    title = componentDefaults["header-section"].title,
    subtitle = componentDefaults["header-section"].subtitle,
    sectionId,
    // Button props...
    buttonText = componentDefaults["header-section"].buttonText,
    buttonUrl = componentDefaults["header-section"].buttonUrl,
    buttonVisible = componentDefaults["header-section"].buttonVisible,
    buttonLinkType = componentDefaults["header-section"].buttonLinkType || "url",
    buttonTargetDialogId = componentDefaults["header-section"].buttonTargetDialogId,
    buttonIconLeft = componentDefaults["header-section"].buttonIconLeft,
    buttonIconRight = componentDefaults["header-section"].buttonIconRight,
    secondaryButtonText = componentDefaults["header-section"].secondaryButtonText,
    secondaryButtonUrl = componentDefaults["header-section"].secondaryButtonUrl,
    secondaryButtonVisible = componentDefaults["header-section"].secondaryButtonVisible,
    secondaryButtonLinkType = componentDefaults["header-section"].secondaryButtonLinkType || "url",
    secondaryButtonTargetDialogId = componentDefaults["header-section"].secondaryButtonTargetDialogId,
    secondaryButtonIconLeft = componentDefaults["header-section"].secondaryButtonIconLeft,
    secondaryButtonIconRight = componentDefaults["header-section"].secondaryButtonIconRight,
    buttonId,
    secondaryButtonId,
    buttonStyle = "primary",
    secondaryButtonStyle = "ghost",
    onUpdate,
    titleVisible = true,
    subtitleVisible = true,
    titleId,
    subtitleId
}) {
    const update = createUpdateHandler(onUpdate);

    return (
        <section className={`${styles.section}`} id={sectionId}>
            <div className={getContainerClasses({})}>
                <div className="grid">
                    <div className={`col-mobile-4 col-tablet-8 col-desktop-8 offset-desktop-2 ${styles.content}`}>
                        {titleVisible && (
                            <BuilderText
                                tagName="h2"
                                className={`h2 ${styles.title}`}
                                style={{ marginBottom: "var(--gap-md)" }}
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
                                className={`subheader-h1 ${styles.subtitle}`}
                                style={{ marginBottom: "var(--gap-lg)" }}
                                content={subtitle}
                                onChange={update('subtitle')}
                                sectionId={sectionId}
                                id={subtitleId}
                                suffix="subtitle"
                            />
                        )}
                        <div className="buttonWrapperCenter">
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
