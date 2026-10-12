import React, { useEffect, useRef, useState } from 'react';

/**
 * SmoothReveal — A wrapper component that reveals its children with a smooth
 * slide-up + fade animation when scrolled into view.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.delay - Stagger delay in ms
 * @param {string} props.direction - 'up' | 'down' | 'left' | 'right'
 * @param {number} props.distance - Offset distance in px
 * @param {number} props.duration - Animation duration in ms
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export default function SmoothReveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 900,
  className = '',
  style = {},
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      default: return `translate3d(0, ${distance}px, 0)`;
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
