"use client";
import { useEffect, useState } from "react";
export function CustomCursor() {
  const [position, setPosition] = useState({ x: -40, y: -40 });
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;
    const move = (event: PointerEvent) => { setPosition({ x: event.clientX, y: event.clientY }); setVisible(true); };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move); window.addEventListener("pointerdown", down); window.addEventListener("pointerup", up); document.documentElement.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); document.documentElement.removeEventListener("mouseleave", leave); };
  }, []);
  return <span aria-hidden="true" className={`pointer-events-none fixed z-[100] hidden size-5 -translate-x-1/2 -translate-y-1/2 border border-[#f5c2c8] shadow-[0_0_18px_rgba(245,194,200,0.22)] transition-[transform,opacity] duration-100 md:block ${pressed ? "scale-50" : "scale-100"}`} style={{ left: position.x, top: position.y, opacity: visible ? 1 : 0 }} />;
}
