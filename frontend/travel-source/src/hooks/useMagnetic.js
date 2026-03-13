import { useRef, useEffect } from "react";

export function useMagnetic(strength = 0.5) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // We use a spring to make it feel organic, but simple translate works nicely
    let rect = { width: 0, height: 0, left: 0, top: 0 };
    let isHovering = false;

    // To prevent layout thrashing we cache rect on enter
    const onMouseEnter = (e) => {
      rect = node.getBoundingClientRect();
      isHovering = true;
      node.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
    };

    const onMouseMove = (e) => {
      if (!isHovering) return;
      // Calculate mouse position relative to center of element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Remove transition for raw 1-to-1 tracking feel
      node.style.transition = "none";
      node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const onMouseLeave = (e) => {
      isHovering = false;
      // Reset with springy transition
      node.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
      node.style.transform = `translate(0px, 0px)`;
    };

    node.addEventListener("mouseenter", onMouseEnter);
    node.addEventListener("mousemove", onMouseMove);
    node.addEventListener("mouseleave", onMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength]);

  return ref;
}
