"use client";

import { useEffect, useRef } from "react";

type CursorState = "default" | "link" | "cta";

export function CustomCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!cursor || !finePointer.matches) return;

    const target = { x: -80, y: -80 };
    const current = { x: -80, y: -80 };
    let frameId = 0;
    let visible = false;

    const render = () => {
      current.x += (target.x - current.x) * 0.72;
      current.y += (target.y - current.y) * 0.72;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frameId = window.requestAnimationFrame(render);
    };

    const setStateFromTarget = (eventTarget: EventTarget | null) => {
      const element = eventTarget instanceof Element ? eventTarget : null;
      let state: CursorState = "default";
      if (element?.closest('[data-cursor="cta"]')) state = "cta";
      else if (element?.closest('a, button, summary, [role="button"], [data-cursor="link"]')) state = "link";
      cursor.dataset.state = state;
    };

    const show = () => { visible = true; cursor.dataset.visible = "true"; };
    const hide = () => { visible = false; cursor.dataset.visible = "false"; cursor.dataset.pressed = "false"; };
    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) { current.x = event.clientX; current.y = event.clientY; show(); }
      setStateFromTarget(event.target);
    };
    const handleDown = () => { cursor.dataset.pressed = "true"; };
    const handleUp = (event: PointerEvent) => { cursor.dataset.pressed = "false"; setStateFromTarget(event.target); };
    const handleVisibility = () => { if (document.hidden) hide(); };
    const handlePointerChange = () => { if (!finePointer.matches) hide(); };

    document.documentElement.classList.add("custom-cursor-ready");
    frameId = window.requestAnimationFrame(render);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);
    document.addEventListener("visibilitychange", handleVisibility);
    finePointer.addEventListener("change", handlePointerChange);

    return () => {
      document.documentElement.classList.remove("custom-cursor-ready");
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.removeEventListener("visibilitychange", handleVisibility);
      finePointer.removeEventListener("change", handlePointerChange);
    };
  }, []);

  return (
    <span ref={cursorRef} className="custom-cursor" data-state="default" data-visible="false" data-pressed="false" aria-hidden="true">
      <span className="custom-cursor__shape"><span className="custom-cursor__dot" /><span className="custom-cursor__arrow">↗</span></span>
    </span>
  );
}
