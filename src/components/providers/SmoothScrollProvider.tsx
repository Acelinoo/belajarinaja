"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inisialisasi Lenis dengan durasi santai (slow & luxurious momentum)
    // agar pembaca dapat menikmati konten secara tenang dan tanpa hentakan kasar.
    const lenis = new Lenis({
      duration: 1.8, // Slow, relaxed scrolling duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky ease-out deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Sentuhan scroll roda lebih santai & halus
      touchMultiplier: 1.2,
      infinite: false,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
