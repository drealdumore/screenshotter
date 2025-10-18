"use client";

import { useEffect, useRef, Suspense } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<{
    raf: (time: number) => void;
    destroy: () => void;
  } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;

    const initLenis = async () => {
      if (typeof window === "undefined") return;

      const { default: LenisClass } = await import("lenis");

      if (!mounted) return;

      lenisRef.current = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame((time) => raf(time));
    };

    initLenis();

    return () => {
      mounted = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <body>
      <Suspense fallback={null}>{children}</Suspense>
    </body>
  );
}
