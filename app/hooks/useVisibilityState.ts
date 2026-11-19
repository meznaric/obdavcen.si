import { useState, useEffect, useRef } from "react";

type VisibilityState = "above" | "visible" | "below";

export default function useVisibilityState(): [
  React.RefObject<HTMLDivElement | null>,
  VisibilityState
] {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<VisibilityState>("below");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
        } else if (entry.boundingClientRect.top > entry.rootBounds!.bottom) {
          setState("below");
        } else {
          setState("above");
        }
      },
      {
        root: null, // viewport
        threshold: 0,
      }
    );

    const component = ref.current;

    if (component) {
      observer.observe(component);
    }

    return () => {
      if (component) observer.unobserve(component);
    };
  }, []);

  return [ref, state];
}
