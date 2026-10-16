// Shared scroll state. DOM hooks write it; the 3D scene reads it every frame.
// A plain mutable object on purpose: scrolling must not re-render React.
export const journey = {
  section: { hero: 0, process: 0, automation: 0, stack: 0, work: 0, contact: 0 },
  speed: 0, // camera speed, 0..1, written by CameraRig and read by the ship, streaks and post FX
  heading: 1, // 1 flying forward (scrolling down), -1 flying back (scrolling up), written by CameraRig
};
