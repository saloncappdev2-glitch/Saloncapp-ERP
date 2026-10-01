import React, { useRef, useState, useEffect, ReactNode, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableChipBarProps {
  children: ReactNode;
  className?: string;
  showScrollButtons?: boolean;
}

export const ScrollableChipBar: React.FC<ScrollableChipBarProps> = ({
  children,
  className = '',
  showScrollButtons = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Mouse drag-to-scroll tracking
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 4;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    checkScrollability();
    const t1 = setTimeout(checkScrollability, 50);
    const t2 = setTimeout(checkScrollability, 200);

    const el = containerRef.current;
    if (!el) return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };

    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    el.addEventListener('scroll', checkScrollability, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
      el.removeEventListener('scroll', checkScrollability);
    };
  }, [children, checkScrollability]);

  // Smooth scroll left / right button actions
  const scrollByAmount = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 250);
    }
  };

  // Convert vertical mouse wheel to horizontal scroll over the chip row
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      if (Math.abs(e.deltaY) > 0) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

  // Safe drag-to-scroll support that does not break button clicks
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setHasDragged(false);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;
    
    // Only register as dragging if moved more than 4px to prevent swallowing normal clicks
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
      containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    // Allow slight delay before resetting hasDragged to prevent false clicks
    setTimeout(() => setHasDragged(false), 50);
  };

  return (
    <div className={`relative flex items-center w-full group ${className}`}>
      {/* Scroll Left Button */}
      {showScrollButtons && hasOverflow && (
        <button
          type="button"
          onClick={() => scrollByAmount(-180)}
          disabled={!canScrollLeft}
          className={`shrink-0 mr-1 p-1.5 rounded-xl border transition-all z-10 ${
            canScrollLeft
              ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border-neutral-700 shadow-md active:scale-90 cursor-pointer'
              : 'opacity-30 bg-neutral-900 text-neutral-600 border-neutral-800/60 cursor-not-allowed'
          }`}
          title="Scroll Left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Chips Container with visible horizontal scrollbar & drag support */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 w-full cursor-grab active:cursor-grabbing select-none scroll-smooth ${
          hasDragged ? 'pointer-events-none' : ''
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(245, 158, 11, 0.45) rgba(255, 255, 255, 0.05)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>

      {/* Scroll Right Button */}
      {showScrollButtons && hasOverflow && (
        <button
          type="button"
          onClick={() => scrollByAmount(180)}
          disabled={!canScrollRight}
          className={`shrink-0 ml-1 p-1.5 rounded-xl border transition-all z-10 ${
            canScrollRight
              ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border-neutral-700 shadow-md active:scale-90 cursor-pointer'
              : 'opacity-30 bg-neutral-900 text-neutral-600 border-neutral-800/60 cursor-not-allowed'
          }`}
          title="Scroll Right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
