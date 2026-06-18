"use client";
import { useRef, useCallback, useState } from 'react';
import { componentDefaults } from "./data";
import { createUpdateHandler } from "./component-helpers";
import styles from "./header-tnc.module.css";


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

export default function HeaderTnc({
    sectionId,
    onUpdate,
    hasCardStyle = componentDefaults["header-tnc"]?.hasCardStyle || false,
    items = componentDefaults["header-tnc"]?.items || []
}) {
    const update = createUpdateHandler(onUpdate);

    const latestStateRef = useRef({ items, onUpdate });
    latestStateRef.current = { items, onUpdate };

    const updateItem = useCallback((index, key, value) => {
        const { items: currentItems, onUpdate: currentOnUpdate } = latestStateRef.current;
        if (!currentOnUpdate) return;
        const newItems = [...currentItems];
        newItems[index] = { ...newItems[index], [key]: value };
        currentOnUpdate({ items: newItems });
    }, []);

    return (
        <BuilderSection 
            className={styles.section} 
            sectionId={sectionId}
            showFullWidthControl={false}
            showCardStyleToggle={true}
            hasCardStyle={hasCardStyle}
        >
            <div className={getContainerClasses({})}>
                <div className="grid">
                    <div className="col-mobile-4 col-tablet-8 col-desktop-12">
                        {items.map((item, index) => {
                            if (!item?.visible) return null;
                            return (
                                <div key={item.cardId || index} className={`${styles.itemGroup} ${hasCardStyle ? styles.cardStyle : ''}`}>
                                    {item.titleVisible && (
                                        <BuilderText
                                            tagName="h3"
                                            className={`h3 ${styles.title}`}
                                            content={item.title}
                                            onChange={(val) => updateItem(index, 'title', val)}
                                            sectionId={sectionId}
                                            id={item.titleId}
                                            suffix={`title-${index}`}
                                        />
                                    )}
                                    {item.descriptionVisible && (
                                        <BuilderText
                                            tagName="div"
                                            className={`body-regular ${styles.description}`}
                                            content={item.description}
                                            onChange={(val) => updateItem(index, 'description', val)}
                                            sectionId={sectionId}
                                            id={item.descriptionId}
                                            suffix={`desc-${index}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </BuilderSection>
    );
}
