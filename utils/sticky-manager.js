"use client";
import React, { useRef, useState, useEffect, Children } from 'react';

/**
 * StickyManager
 * 
 * Manages sticky positioning and stacking for children components.
 * Ensures that stacked sections stay behind following sections as they slide over.
 */
export default function StickyManager({ children, stickyIndices = [], stackedIndices = [], blurIndices = [], overlayIndices = [] }) {
    const [offsets, setOffsets] = useState({});
    const refs = useRef({});

    useEffect(() => {
        if (stickyIndices.length === 0) return;

        const updateOffsets = () => {
            let currentOffset = 0;
            const newOffsets = {};
            const winH = typeof window !== 'undefined' ? window.innerHeight : 1000;

            stickyIndices.forEach(index => {
                const el = refs.current[index];
                if (el) {
                    const isStacked = stackedIndices.includes(index);

                    if (isStacked) {
                        const height = el.offsetHeight;
                        newOffsets[index] = Math.min(currentOffset, winH - height);
                    } else {
                        newOffsets[index] = currentOffset;
                    }

                    if (!isStacked && !overlayIndices.includes(index)) {
                        currentOffset += el.offsetHeight;
                    }
                }
            });

            setOffsets(prev => {
                const isSame = Object.keys(newOffsets).every(k => newOffsets[k] === prev[k]);
                return isSame ? prev : newOffsets;
            });
        };

        const resizeObserver = new ResizeObserver(() => {
            updateOffsets();
        });

        stickyIndices.forEach(index => {
            const el = refs.current[index];
            if (el) resizeObserver.observe(el);
        });

        window.addEventListener('resize', updateOffsets);
        updateOffsets();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateOffsets);
        };
    }, [stickyIndices, stackedIndices, overlayIndices]);

    // Stacked Blur Effect
    useEffect(() => {
        if (stackedIndices.length === 0) return;

        const elementCache = {};

        const handleScroll = () => {
            stackedIndices.forEach(index => {
                const container = refs.current[index];
                if (!container) return;

                if (!elementCache[index]) {
                    elementCache[index] = {
                        overlay: container.querySelector('.stacked-white-overlay'),
                        content: container.querySelector('.stacked-content-blur'),
                        next: container.nextElementSibling,
                        lastProgress: -1
                    };
                }

                const cache = elementCache[index];
                const { overlay, content, next: nextElement } = cache;
                const isBlurred = blurIndices.includes(index);

                if (!nextElement) return;

                if (!isBlurred) {
                    if (cache.lastProgress === 0) return;
                    if (overlay && overlay.style.opacity !== '0') overlay.style.opacity = '0';
                    if (content && content.style.filter !== 'none') content.style.filter = 'none';
                    cache.lastProgress = 0;
                    return;
                }

                const rect = nextElement.getBoundingClientRect();
                const winH = window.innerHeight;
                const startPoint = winH;
                const endPoint = winH * 0.5;
                const current = rect.top;

                let progress = 0;
                if (current < startPoint) {
                    progress = (startPoint - current) / (startPoint - endPoint);
                }
                progress = Math.max(0, Math.min(1, progress));

                if (Math.abs(progress - cache.lastProgress) < 0.005) return;
                cache.lastProgress = progress;

                if (overlay) overlay.style.opacity = progress.toFixed(3);
                if (content) content.style.filter = `blur(${progress * 10}px)`;
            });
        };

        let rafId = null;
        const throttledScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                handleScroll();
                rafId = null;
            });
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('resize', throttledScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('resize', throttledScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [JSON.stringify(stackedIndices), JSON.stringify(blurIndices)]);

    // Fix Hydration Mismatch for Overlay Margin
    useEffect(() => {
        overlayIndices.forEach(index => {
            const el = refs.current[index];
            if (el) {
                el.style.marginBottom = `-${el.offsetHeight}px`;
            }
        });
    }, [overlayIndices, children]);

    let forceWhite = false;

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            {Children.map(children, (child, index) => {
                if (!child) return null;

                const isSticky = stickyIndices.includes(index);
                const isStacked = stackedIndices.includes(index);
                const isBlurred = blurIndices.includes(index);
                const isOverlay = overlayIndices.includes(index);
                const topOffset = offsets[index] || 0;

                // Z-Index Logic:
                // 1. Navigation/Sticky (non-stacked): Highest priority (1000)
                // 2. Normal Sections: Should be on top of stacked sections (index + 10)
                // 3. Stacked Sections: Should be behind following sections (index)
                
                let zIndex = 10 + index;
                if (isSticky && !isStacked && !isOverlay) {
                    zIndex = 1000; // Navigation stays on top
                } else if (isStacked) {
                    zIndex = 1 + index; // Stacked stays behind its followers
                }

                let backgroundColor = 'transparent';
                if (forceWhite && !isStacked) {
                    backgroundColor = 'var(--background-neutral--default, #ffffff)';
                }

                if (isStacked) {
                    // If Blur is Enabled, we DON'T force white from the manager. 
                    // We let the ScrollGroup handle the dynamic transparent->white transition.
                    // If Blur is Disabled, we force white immediately for all following sections.
                    forceWhite = !isBlurred;
                }

                return (
                    <div
                        ref={el => refs.current[index] = el}
                        key={index}
                        style={{
                            position: isSticky ? 'sticky' : 'relative',
                            top: isSticky ? topOffset : undefined,
                            zIndex: zIndex,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: backgroundColor
                        }}
                    >
                        {isStacked ? (
                            <>
                                <div
                                    className="stacked-white-overlay"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'var(--background-neutral--default, #ffffff)',
                                        zIndex: 2,
                                        pointerEvents: 'none',
                                        opacity: 0,
                                    }}
                                />
                                <div
                                    className="stacked-content-blur"
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    {child}
                                </div>
                            </>
                        ) : (
                            child
                        )}
                    </div>
                );
            })}
        </div>
    );
}
