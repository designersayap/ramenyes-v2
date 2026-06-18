"use client";

import { useRef, useContext, useState, useEffect, useId } from "react";
import { Cog6ToothIcon, PaintBrushIcon } from "@heroicons/react/24/solid";

import { createPortal } from "react-dom";


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
const BuilderControlsPopover = () => null;

export default function ScrollGroup({
    sectionId,
    components = [],
    image,
    mobileImage,
    imageMobileRatio,
    scrollEffect = "parallax", // 'parallax' | 'sticky'
    enableBlur = false, // Toggle for blur effect
    disableEffects = false, // New prop to disable internal effects (for Staging/Export)
    onUpdate,
    updateComponent, // passed from Canvas to render children
    showScrollEffectOnStaging = false, // New prop
    showSrcOnStaging = false, // New prop
    componentLibrary // Passed from parent (Builder) to break circular dependency
}) {
    const { activeElementId = '__EXPORTED__', setActiveElementId = () => {}, activePopoverId = null, setActivePopoverId = () => {}, localData, isStaging = true } = {};
  // Context values mocked for export library
    const { canvasWidth = '100%' } = {};
  // Context values mocked for export library
    const fallbackId = useId();

    // Detect mobile simulation (<= 768px matches the CSS media query)
    // Only enabled in builder (not in staging/export)
    const isMobileSimulation = !disableEffects && (() => {
        if (!canvasWidth || canvasWidth === '100%') return false;
        const width = parseInt(canvasWidth, 10);
        return !isNaN(width) && width <= 768;
    })();
    // Fallback ID to ensure CSS selectors work even if sectionId is missing (e.g. in Export)
    const elementId = sectionId || `scroll-group-${fallbackId.replace(/:/g, '')}`;

    // Fix: Use client-only state for isActive to prevent hydration mismatches
    const [isClientActive, setIsClientActive] = useState(false);
    useEffect(() => {
        setIsClientActive(activeElementId === elementId);
    }, [activeElementId, elementId]);

    const isActive = isClientActive;
    const myPopoverBase = `popover-${elementId}`;
    const showSettings = activePopoverId && activePopoverId.startsWith(myPopoverBase);
    const isStyleOpen = activePopoverId === `${myPopoverBase}-style`;

    const sectionRef = useRef(null);

    // Desktop/Mobile Image Source Logic
    const isSticky = scrollEffect === 'sticky';
    const isStacked = scrollEffect === 'stacked';

    // Determine which image to show inline (for Builder simulation primarily)
    // If simulating mobile, show mobile image directly.
    // Otherwise show desktop image (and let CSS media query handle mobile if on real device)
    // Fix: Force desktop image during SSR to avoid hydration mismatch
    const currentImage = (typeof window !== 'undefined' && isMobileSimulation && mobileImage) ? mobileImage : image;

    // Styles for Parallax (Fixed Background)
    const parallaxStyle = {
        backgroundImage: currentImage ? `url("${currentImage}")` : 'none',
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column"
    };

    // Styles for Sticky (Sticky Top Background)
    // Structure: Container (grid) -> Background (sticky top, z-1) + Content (relative, z1) in same cell
    const stickyContainerStyle = {
        position: "relative",
        width: '100%',
        isolation: 'isolate',
        display: 'grid',
        gridTemplateAreas: '"stack"'
    };

    const stickyBackgroundStyle = {
        gridArea: 'stack',
        position: "sticky",
        top: 0,
        height: "100vh",
        width: "100%",
        backgroundImage: currentImage ? `url("${currentImage}")` : 'none',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        zIndex: -1, // Behind content
        alignSelf: 'start'
    };

    // Styles for Stacked (Sticky Component, Next Section Slides Over)
    const stackedStyle = {
        position: "relative", // Changed from sticky to relative since wrapper handles stickiness
        width: "100%",
        minHeight: "100vh", // Build height to ensure effect is visible
        backgroundImage: currentImage ? `url("${currentImage}")` : 'none',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    };

    const contentStyle = {
        gridArea: 'stack',
        position: "relative",
        zIndex: 1
    };

    // Stacked Effect Logic (Blur + White Blend)
    const blurContainerRef = useRef(null);
    const whiteOverlayRef = useRef(null);

    useEffect(() => {
        // If effects are disabled (Staging/Export), do nothing
        if (disableEffects) return;

        if (!isStacked || !sectionRef.current) {
            // Reset if disabled
            if (whiteOverlayRef.current) whiteOverlayRef.current.style.opacity = 0;
            if (blurContainerRef.current) blurContainerRef.current.style.filter = 'none';

            // Reset next elements (blur + background)
            if (sectionRef.current) {
                const wrapper = sectionRef.current.parentElement;
                let sibling = wrapper ? wrapper.nextElementSibling : sectionRef.current.nextElementSibling;
                let count = 0;

                while (sibling && count < 20) {
                    if (sibling.style) {
                        sibling.style.filter = '';
                        sibling.style.backgroundColor = '';
                    }
                    sibling = sibling.nextElementSibling;
                    count++;
                }
            }
            return;
        }

        const handleScroll = () => {
            if (!sectionRef.current) return;

            // In Builder/Export, the component is likely wrapped in a div (componentWrapper or sticky wrapper).
            // So we need to check the parent's sibling to find the next section.
            const wrapper = sectionRef.current.parentElement;
            const nextElement = wrapper ? wrapper.nextElementSibling : sectionRef.current.nextElementSibling;

            if (!nextElement) return;

            const rect = nextElement.getBoundingClientRect();
            const winH = window.innerHeight;

            // Effect range:
            // Start: Top of next element is at bottom of screen (winH)
            // End: Top of next element is at 50% of screen (winH * 0.5)
            const startPoint = winH;
            const endPoint = winH * 0.5;
            const current = rect.top;

            let progress = 0;
            if (current < startPoint) {
                progress = (startPoint - current) / (startPoint - endPoint);
            }
            // Clamp 0 to 1
            progress = Math.max(0, Math.min(1, progress));

            // 1. Apply Internal Effects (Overlay & Blur)
            if (whiteOverlayRef.current) {
                whiteOverlayRef.current.style.opacity = enableBlur ? progress : 0;
            }
            if (blurContainerRef.current) {
                blurContainerRef.current.style.filter = enableBlur ? `blur(${progress * 10}px)` : 'none';
            }

            // 2. Apply Blur Reveal to Next Component
            if (nextElement && nextElement.style) {
                if (enableBlur) {
                    const inverseBlur = (1 - progress) * 10;
                    nextElement.style.filter = `blur(${inverseBlur}px)`;
                } else {
                    nextElement.style.filter = '';
                }
            }

            // 3. Background Transparency: For ALL subsequent siblings to ensure visual continuity
            // If blur is disabled, we force white immediately.
            // If blur is enabled, we stay transparent while overlapping (progress < 1) and turn white when "locked" (progress >= 1)
            let sibling = nextElement;
            const targetBg = 'var(--background-neutral--default, #ffffff)';

            let count = 0;
            const MAX_SIBLINGS = 20;

            while (sibling && count < MAX_SIBLINGS) {
                if (sibling.style) {
                    sibling.style.setProperty('background-color', targetBg, 'important');
                }
                sibling = sibling.nextElementSibling;
                count++;
            }
        };

        const scrollTarget = document.getElementById('canvas-scroll-container') || window;
        scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

        handleScroll(); // Initial check

        return () => {
            scrollTarget.removeEventListener('scroll', handleScroll);

            // Cleanup next elements (blur + background)
            if (sectionRef.current) {
                const wrapper = sectionRef.current.parentElement;
                let sibling = wrapper ? wrapper.nextElementSibling : sectionRef.current.nextElementSibling;
                let count = 0;
                while (sibling && count < 20) {
                    if (sibling.style) {
                        sibling.style.filter = '';
                        sibling.style.backgroundColor = '';
                    }
                    sibling = sibling.nextElementSibling;
                    count++;
                }
            }
        };

    }, [isStacked, enableBlur, disableEffects]);

    const handleStyleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isStyleOpen && sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            setPopoverPosition({ top: rect.top, left: rect.left + rect.width / 2 });
        }
        setActivePopoverId(prev => prev === `${myPopoverBase}-style` ? null : `${myPopoverBase}-style`);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        setActiveElementId(elementId);
    };

    const renderChildren = () => (
        <div className="rv-parallaxContent" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {components.map((item) => {
                // Prioritize the component instance if passed (Export/UAT), otherwise lookup (Builder)
                const Component = item.component || (componentLibrary ? Object.values(componentLibrary).flat().find(c => c.id === item.id)?.component : null);

                if (!Component) return null;

                // Staging Merge Logic:
                const effectiveId = item.uniqueId || item.id; // Fallback to id if uniqueId missing
                const lookupId = item.sectionId || item.uniqueId;
                const stagingOverride = localData ? (localData[lookupId] || localData[effectiveId]) : {};

                // Robustly determine base props: handle both nested props (Builder default) and flat props (legacy/staging edge cases)
                const baseProps = item.props ? item.props : item;

                // Filter out metadata from baseProps if falling back to item (to avoid passing 'component', 'uniqueId' etc as props)
                const cleanBaseProps = item.props ? baseProps : (() => {
                    const { component, uniqueId, sectionId, id, ...rest } = baseProps;
                    return rest;
                })();

                const mergedProps = { ...cleanBaseProps, ...stagingOverride };

                return (
                    <div key={item.uniqueId} className="rv-componentWrapper">
                        <Component
                            {...mergedProps}
                            sectionId={item.sectionId}
                            onUpdate={(newProps) => updateComponent && updateComponent(item.uniqueId, newProps)}
                            componentLibrary={componentLibrary}
                        />
                    </div>
                )
            })}
        </div>
    );

    const renderPopover = () => (
        isActive && (
            <BuilderControlsPopover
                isOpen={showSettings}
                onClose={() => setActivePopoverId(null)}
                position={popoverPosition}
                mode="style"

                // Scroll Settings
                showScrollEffect={!isStaging || showScrollEffectOnStaging}
                scrollEffect={scrollEffect}
                onScrollEffectChange={(val) => onUpdate({ scrollEffect: val })}

                // Image Settings
                showImageSrc={!isStaging || showSrcOnStaging}
                imageSrc={image}
                onImageSrcChange={(val) => onUpdate({ image: val })}

                showMobileRatio={false}
                mobileRatio={imageMobileRatio}
                onMobileRatioChange={(val) => onUpdate({ imageMobileRatio: val })}

                showMobileImageSrc={!isStaging || showSrcOnStaging}
                mobileImageSrc={mobileImage}
                onMobileImageSrcChange={(val) => onUpdate({ mobileImage: val })}

                showLinkType={false}
                showVariant={false}
                showUrl={false}

                // Blur Setting (Stacked Only)
                showBlurToggle={scrollEffect === 'stacked' && (!isStaging || showScrollEffectOnStaging)}
                enableBlur={enableBlur}
                onEnableBlurChange={(val) => onUpdate({ enableBlur: val })}
                showFullWidthToggle={false}
                popoverTitle="Scroll Settings"
            />
        )
    );

    // Mobile Image Logic
    const wrapperStart = isMobileSimulation ? '' : '@media (max-width: 768px) {';
    const wrapperEnd = isMobileSimulation ? '' : '}';

    const mobileImageCss = mobileImage ? `
        ${wrapperStart}
            div[id="${elementId}"] {
                background-image: url("${mobileImage}") !important;
            }
        ${wrapperEnd}
    ` : '';

    const stickyMobileImageCss = mobileImage ? `
        ${wrapperStart}
            div[id="${elementId}-bg"] {
                background-image: url("${mobileImage}") !important;
            }
        ${wrapperEnd}
    ` : '';

    // Inline the mobile style tag — avoid defining a component inside component body
    const mobileStyleTag = mobileImage ? (
        <style dangerouslySetInnerHTML={{ __html: isSticky ? stickyMobileImageCss : mobileImageCss }} />
    ) : null;

    if (isSticky) {
        return (
            <div
                ref={sectionRef}
                id={elementId}
                onClick={handleClick}
                className={`rv-parallaxGroup${isActive ? " rv-activeWrapper" : ""}`}
                style={stickyContainerStyle}
                suppressHydrationWarning={true}
            >
                <div id={`${elementId}-bg`} style={stickyBackgroundStyle} />
                <div style={contentStyle}>
                    {renderChildren()}
                </div>

                {mobileStyleTag}
            </div>
        );
    }

    if (isStacked) {
        return (
            <div
                ref={sectionRef}
                id={elementId}
                onClick={handleClick}
                className={`rv-parallaxGroup${isActive ? " rv-activeWrapper" : ""}`}
                style={stackedStyle}
                suppressHydrationWarning={true}
            >
                {/* White Overlay for blending */}
                <div
                    ref={whiteOverlayRef}
                    className="rv-scrollGroupOverlay"
                    style={{ opacity: 0 }}
                />

                {/* Content Container to be Blurred */}
                <div
                    ref={blurContainerRef}
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {renderChildren()}
                </div>

                {mobileStyleTag}
            </div>
        );
    }

    // Default Parallax
    return (
        <div
            ref={sectionRef}
            id={elementId}
            onClick={handleClick}
            className={`rv-parallaxGroup${isActive ? " rv-activeWrapper" : ""}`}
            style={parallaxStyle}
            suppressHydrationWarning={true}
        >

            {renderChildren()}

            {mobileStyleTag}
        </div>
    );
}
