/**
 * Tunable hero background 3D motion.
 * Edit here only — HeroSlider / homepage copy should not hardcode speeds.
 */
export const HERO_BG_3D = {
  /** Lerp toward mouse target each frame (0–1). Lower = more lag. */
  followLag: 0.075,
  /** Lerp back to center after leave / inertia. */
  returnLag: 0.055,
  /** Max rotateX / rotateY in degrees. */
  maxTiltX: 4.5,
  maxTiltY: 6.5,
  /** Max translate in px (after scale). */
  maxTranslateX: 30,
  maxTranslateY: 20,
  /** Uniform scale so edges stay covered under tilt/translate. */
  baseScale: 1.14,
  /** Multiplier from drag delta (px) into motion space. */
  dragGain: 0.045,
  /** Per-frame velocity decay while coasting after release. */
  throwFriction: 0.91,
  /** Stop inertia and return home below this speed. */
  throwMinSpeed: 0.04,
  /** Treat pose as settled when below this delta from target. */
  settleEpsilon: 0.015,
  /** Perspective for the transform layer (px). */
  perspective: 1100,
} as const;

const INTERACTIVE =
  'a,button,input,textarea,select,label,summary,[role="button"],[role="tab"],[role="link"],[role="search"],[role="textbox"],[role="listbox"],[role="option"],[role="menuitem"],[data-hero-3d-ignore]';

export function isHeroInteractiveTarget(target: EventTarget | null): boolean {
  if (typeof Element === "undefined" || !(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE));
}

type Pose = { rx: number; ry: number; tx: number; ty: number };
type Mode = "follow" | "drag" | "inertia" | "return";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function near(a: Pose, b: Pose, eps: number) {
  return (
    Math.abs(a.rx - b.rx) < eps &&
    Math.abs(a.ry - b.ry) < eps &&
    Math.abs(a.tx - b.tx) < eps &&
    Math.abs(a.ty - b.ty) < eps
  );
}

function lerpPose(from: Pose, to: Pose, t: number): Pose {
  return {
    rx: from.rx + (to.rx - from.rx) * t,
    ry: from.ry + (to.ry - from.ry) * t,
    tx: from.tx + (to.tx - from.tx) * t,
    ty: from.ty + (to.ty - from.ty) * t,
  };
}

function applyPose(el: HTMLElement, pose: Pose) {
  const { maxTiltX, maxTiltY, maxTranslateX, maxTranslateY, baseScale, perspective } = HERO_BG_3D;
  const rx = clamp(pose.rx, -1, 1) * maxTiltX;
  const ry = clamp(pose.ry, -1, 1) * maxTiltY;
  const tx = clamp(pose.tx, -1, 1) * maxTranslateX;
  const ty = clamp(pose.ty, -1, 1) * maxTranslateY;
  el.style.transform = `perspective(${perspective}px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${baseScale})`;
}

function clearPose(el: HTMLElement) {
  el.style.transform = "";
}

function poseFromPointer(clientX: number, clientY: number, rect: DOMRect): Pose {
  const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
  return {
    rx: clamp(-ny, -1, 1),
    ry: clamp(nx, -1, 1),
    tx: clamp(nx, -1, 1),
    ty: clamp(ny, -1, 1),
  };
}

/**
 * Attaches lag-follow + drag/throw/release to a decorative hero image layer.
 * Writes transforms via rAF only — no React state. Touch / reduced-motion = no-op.
 */
export function attachHeroBg3D(layer: HTMLElement, surface: HTMLElement): () => void {
  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const zero: Pose = { rx: 0, ry: 0, tx: 0, ty: 0 };
  let current: Pose = { ...zero };
  let target: Pose = { ...zero };
  let velocity = { rx: 0, ry: 0, tx: 0, ty: 0 };
  let mode: Mode = "return";
  let raf = 0;
  let dragging = false;
  let dragOrigin: Pose = { ...zero };
  let pointerOrigin = { x: 0, y: 0 };
  let lastSample = { x: 0, y: 0, t: 0 };
  let pointerId: number | null = null;

  const enabled = () => finePointer.matches && !reducedMotion.matches;

  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const tick = () => {
    raf = 0;
    if (!enabled()) {
      current = { ...zero };
      target = { ...zero };
      clearPose(layer);
      return;
    }

    if (mode === "inertia") {
      current = {
        rx: current.rx + velocity.rx,
        ry: current.ry + velocity.ry,
        tx: current.tx + velocity.tx,
        ty: current.ty + velocity.ty,
      };
      current = {
        rx: clamp(current.rx, -1, 1),
        ry: clamp(current.ry, -1, 1),
        tx: clamp(current.tx, -1, 1),
        ty: clamp(current.ty, -1, 1),
      };
      const f = HERO_BG_3D.throwFriction;
      velocity = {
        rx: velocity.rx * f,
        ry: velocity.ry * f,
        tx: velocity.tx * f,
        ty: velocity.ty * f,
      };
      const speed =
        Math.abs(velocity.rx) +
        Math.abs(velocity.ry) +
        Math.abs(velocity.tx) +
        Math.abs(velocity.ty);
      if (speed < HERO_BG_3D.throwMinSpeed) {
        velocity = { rx: 0, ry: 0, tx: 0, ty: 0 };
        mode = "return";
        target = { ...zero };
      }
    } else if (mode === "drag") {
      // current already set by pointer handlers
    } else {
      const lag = mode === "return" ? HERO_BG_3D.returnLag : HERO_BG_3D.followLag;
      current = lerpPose(current, target, lag);
      if (mode === "return" && near(current, zero, HERO_BG_3D.settleEpsilon)) {
        current = { ...zero };
        clearPose(layer);
        return;
      }
      if (mode === "follow" && near(current, target, HERO_BG_3D.settleEpsilon)) {
        current = { ...target };
        applyPose(layer, current);
        return;
      }
    }

    applyPose(layer, current);
    raf = requestAnimationFrame(tick);
  };

  const ensureLoop = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!enabled() || e.pointerType !== "mouse") return;
    if (dragging) return;
    const rect = surface.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) {
      if (mode === "follow") {
        mode = "return";
        target = { ...zero };
        ensureLoop();
      }
      return;
    }
    mode = "follow";
    target = poseFromPointer(e.clientX, e.clientY, rect);
    ensureLoop();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!enabled() || e.pointerType !== "mouse" || e.button !== 0) return;
    if (isHeroInteractiveTarget(e.target)) return;
    dragging = true;
    pointerId = e.pointerId;
    mode = "drag";
    dragOrigin = { ...current };
    pointerOrigin = { x: e.clientX, y: e.clientY };
    lastSample = { x: e.clientX, y: e.clientY, t: performance.now() };
    velocity = { rx: 0, ry: 0, tx: 0, ty: 0 };
    surface.setPointerCapture?.(e.pointerId);
    ensureLoop();
  };

  const onPointerDrag = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = (e.clientX - pointerOrigin.x) * HERO_BG_3D.dragGain;
    const dy = (e.clientY - pointerOrigin.y) * HERO_BG_3D.dragGain;
    const next: Pose = {
      rx: clamp(dragOrigin.rx - dy, -1, 1),
      ry: clamp(dragOrigin.ry + dx, -1, 1),
      tx: clamp(dragOrigin.tx + dx, -1, 1),
      ty: clamp(dragOrigin.ty + dy, -1, 1),
    };
    const now = performance.now();
    const dt = Math.max(16, now - lastSample.t);
    velocity = {
      rx: ((next.rx - current.rx) / dt) * 16,
      ry: ((next.ry - current.ry) / dt) * 16,
      tx: ((next.tx - current.tx) / dt) * 16,
      ty: ((next.ty - current.ty) / dt) * 16,
    };
    lastSample = { x: e.clientX, y: e.clientY, t: now };
    current = next;
    target = next;
    ensureLoop();
  };

  const endDrag = (e: PointerEvent) => {
    if (!dragging || (pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    pointerId = null;
    try {
      surface.releasePointerCapture?.(e.pointerId);
    } catch {
      /* already released */
    }
    const speed =
      Math.abs(velocity.rx) + Math.abs(velocity.ry) + Math.abs(velocity.tx) + Math.abs(velocity.ty);
    mode = speed > HERO_BG_3D.throwMinSpeed ? "inertia" : "return";
    if (mode === "return") target = { ...zero };
    ensureLoop();
  };

  const onPointerLeaveWindow = () => {
    if (dragging) return;
    mode = "return";
    target = { ...zero };
    ensureLoop();
  };

  const onCapabilityChange = () => {
    if (!enabled()) {
      dragging = false;
      mode = "return";
      current = { ...zero };
      target = { ...zero };
      velocity = { rx: 0, ry: 0, tx: 0, ty: 0 };
      clearPose(layer);
      stopLoop();
    }
  };

  // Decorative layer: avoid hit-testing so clicks pass to content (except empty padding).
  layer.style.pointerEvents = "none";
  layer.style.willChange = "transform";
  layer.style.transformOrigin = "center center";

  surface.addEventListener("pointerdown", onPointerDown);
  surface.addEventListener("pointermove", onPointerDrag);
  surface.addEventListener("pointerup", endDrag);
  surface.addEventListener("pointercancel", endDrag);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("blur", onPointerLeaveWindow);
  finePointer.addEventListener("change", onCapabilityChange);
  reducedMotion.addEventListener("change", onCapabilityChange);

  return () => {
    stopLoop();
    clearPose(layer);
    surface.removeEventListener("pointerdown", onPointerDown);
    surface.removeEventListener("pointermove", onPointerDrag);
    surface.removeEventListener("pointerup", endDrag);
    surface.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("blur", onPointerLeaveWindow);
    finePointer.removeEventListener("change", onCapabilityChange);
    reducedMotion.removeEventListener("change", onCapabilityChange);
  };
}
