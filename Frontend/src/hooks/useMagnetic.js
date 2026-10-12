import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for magnetic button hover effect.
 * The element subtly follows the cursor when hovered.
 * 
 * @param {number} strength - How strongly the element follows the cursor (0-1)
 */
export default function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const animationRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(animationRef.current);
    el.style.transform = 'translate(0, 0)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}
