import { navigateView } from './cameraNavigation.js';

let activeCleanup = null;

export function installManagedCameraSwipeNavigation(state, surface) {
  activeCleanup?.();
  activeCleanup = null;
  if (!surface) return () => {};

  let start = null;
  let tracking = false;
  const timeoutIds = new Set();

  const schedule = (callback, delay) => {
    const id = window.setTimeout(() => {
      timeoutIds.delete(id);
      callback();
    }, delay);
    timeoutIds.add(id);
    return id;
  };

  const panelOpen = () => {
    const panel = document.getElementById('camera-nav-panel');
    return Boolean(panel && !panel.classList.contains('hidden'));
  };

  const onPointerDown = event => {
    if (event.button != null && event.button !== 0) return;
    if (panelOpen() || state.buildPick || state.movePick || state.assign) return;
    start = { x: event.clientX, y: event.clientY, t: performance.now(), floor: state.floor };
    tracking = true;
  };

  const onPointerMove = event => {
    if (!tracking || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 14) state.cameraGestureActive = true;
  };

  const onPointerUp = event => {
    if (!tracking || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = performance.now() - start.t;
    const target = swipeTargetForTest(start.floor, dx, dy, elapsed);
    tracking = false;
    start = null;
    if (!target) {
      schedule(() => { state.cameraGestureActive = false; }, 0);
      return;
    }
    state.cameraGestureActive = true;
    state.suppressNextCanvasClick = true;
    navigateView(state, target.floor, target.label, 'swipe-pull');
    schedule(() => {
      state.suppressNextCanvasClick = false;
      state.cameraGestureActive = false;
    }, 180);
  };

  const onPointerCancel = () => {
    tracking = false;
    start = null;
    state.cameraGestureActive = false;
  };

  const onClickCapture = event => {
    if (!state.suppressNextCanvasClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.suppressNextCanvasClick = false;
  };

  surface.addEventListener('pointerdown', onPointerDown, { passive: true });
  surface.addEventListener('pointermove', onPointerMove, { passive: true });
  surface.addEventListener('pointerup', onPointerUp, { passive: true });
  surface.addEventListener('pointercancel', onPointerCancel, { passive: true });
  surface.addEventListener('click', onClickCapture, true);

  const cleanup = () => {
    surface.removeEventListener('pointerdown', onPointerDown);
    surface.removeEventListener('pointermove', onPointerMove);
    surface.removeEventListener('pointerup', onPointerUp);
    surface.removeEventListener('pointercancel', onPointerCancel);
    surface.removeEventListener('click', onClickCapture, true);
    for (const id of timeoutIds) window.clearTimeout(id);
    timeoutIds.clear();
    tracking = false;
    start = null;
    state.cameraGestureActive = false;
    state.suppressNextCanvasClick = false;
    if (activeCleanup === cleanup) activeCleanup = null;
  };

  activeCleanup = cleanup;
  return cleanup;
}

export function swipeTargetForTest(floor, dx, dy, elapsed) {
  const distance = Math.hypot(dx, dy);
  if (distance < 52 || elapsed > 1400) return null;
  const horizontal = Math.abs(dx) > Math.abs(dy);

  if (floor === 0) {
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };
    if (!horizontal && dy < -42) return { floor: 6, label: 'Front Yard South' };
    if (horizontal && dx > 42) return { floor: 3, label: 'Garage West' };
    if (horizontal && dx < -42) return { floor: 5, label: 'Secret Lab East' };
  }
  if (floor === 4) {
    if (!horizontal && dy < -42) return { floor: 0, label: 'Main House' };
    if (horizontal && dx > 42) return { floor: 3, label: 'Garage West' };
  }
  if (floor === 3) {
    if (horizontal && dx < -42) return { floor: 0, label: 'Main House' };
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };
    if (!horizontal && dy < -42) return { floor: 7, label: 'Driveway West' };
  }
  if (floor === 5 && horizontal && dx > 42) return { floor: 0, label: 'Main House' };
  if (floor === 6) {
    if (!horizontal && dy > 42) return { floor: 0, label: 'Main House' };
    if (horizontal && dx > 42) return { floor: 7, label: 'Driveway West' };
  }
  if (floor === 7) {
    if (!horizontal && dy > 42) return { floor: 3, label: 'Garage West' };
    if (horizontal && dx < -42) return { floor: 6, label: 'Front Yard South' };
  }
  return null;
}
