---
name: three-js-components
description: "Guidelines for updating 3D components, scroll-linked animations, and Three.js transformations. Use when: modifying Globe(), ScrollCamera(), Stars, journey logic, camera movements, frame loop timing, or rotation/scale animations."
applyTo: "**/src/main.jsx"
---

# Three.js Components & Scroll-Linked Animations

This file applies to all edits in `src/main.jsx` involving Three.js components.

## Key Components

### `Globe()`
Renders an animated 3D sphere with scroll-linked rotation.

**Properties:**
- `useFrame()` hook updates rotation on every frame based on scroll position
- Rotation targets defined by `journeyStops[].rotation`
- Smooth interpolation using `lerp()` between waypoints
- Scale modifications for zoom effect

**When modifying:**
- Calculate scroll position as normalized 0-1 value across journey stops
- Use `quaternion` for cumulative rotations (avoid gimbal lock)
- Test performance on low-end devices (Three.js can be GPU-heavy)
- Preserve `scale` state for zoom animations

### `ScrollCamera()`
Dynamically adjusts camera z-position and pan based on scroll.

**Properties:**
- `journeyStops[].z` defines camera distance: `[5.4, 3.6, 2.3, 4.25, 3.15, 2.05]`
- Lerps between stops based on normalized scroll position
- Smooth transitions without jarring jumps

**When modifying:**
- Adjust z-distance carefully (affects FOV perception)
- Test zoom-in/out transitions on all 6 stops
- Ensure camera doesn't clip into geometry or move too far away

### `Stars()`
Background star field with 2600 random stars at radius 80.

**Properties:**
- Fixed, non-animated; rendered once in scene
- Positioned at far distance to stay behind globe

**When modifying:**
- Keep star count low for mobile performance (current: 2600 is reasonable)
- Don't animate stars; increases unnecessary GPU load

### `JourneyScene()`
Canvas wrapper containing Globe, Stars, and lighting.

**Lighting setup:**
- `ambientLight` intensity: 0.6 (fills shadows)
- `directionalLight` intensity: 1.2 (key light)
- Position: `[-5, 4, 8]` (angled top-left)

**When modifying:**
- Test lighting on all journey stops (zoom changes shadow perception)
- Avoid adding multiple directional lights (performance cost)

## Scroll-Linked Animation Pattern

```javascript
// 1. Define waypoints
const journeyStops = [
  { z: 5.4, rotation: {x, y, z}, text: "..." },
  { z: 3.6, rotation: {...}, text: "..." },
  // ... 6 total stops
];

// 2. Calculate scroll position (0-1 range)
const scrollPosition = Math.min(scrollTop / scrollHeight, 1);

// 3. Determine active stop and lerp factor
const stopIndex = Math.floor(scrollPosition * (journeyStops.length - 1));
const lerpFactor = (scrollPosition * (journeyStops.length - 1)) % 1;

// 4. Lerp between current and next stop
const currentStop = journeyStops[stopIndex];
const nextStop = journeyStops[Math.min(stopIndex + 1, journeyStops.length - 1)];
const targetZ = lerp(currentStop.z, nextStop.z, lerpFactor);

// 5. Apply transformation in useFrame()
api.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
```

## Common Patterns

### Smooth Lerp Interpolation
```javascript
const lerp = (a, b, t) => a + (b - a) * t;
// Use in useFrame() with easing: lerp(current, target, 0.1) for smooth damping
```

### Quaternion Rotation (prevents gimbal lock)
```javascript
const quat = new THREE.Quaternion();
quat.setFromEuler(new THREE.Euler(x, y, z));
mesh.quaternion.slerp(quat, 0.05); // smooth slerp
```

### Detecting Scroll Position Changes
Listen for scroll events on the journey section container, then update normalized `scrollPosition` state to trigger camera/globe updates.

## Performance Considerations

- **GPU bottleneck**: Monitor frame rate on mobile (use React DevTools Profiler)
- **Three.js object reuse**: Don't create new THREE.Vector3 inside useFrame(); cache and reuse
- **Canvas size**: Limit resolution on mobile; use `dpr={1}` or `dpr={0.5}` on low-end devices
- **Animation framerate**: 60 FPS target; reduce complexity if dropping below 30 FPS

## Testing Checklist

Before committing scroll-linked animation changes:

- [ ] Rotation is smooth from stop 1 → 6 with no jarring jumps
- [ ] Camera zoom narrows viewport correctly (verify z-distance)
- [ ] Globe scale follows camera zoom transitions
- [ ] Lights update perceived depth as camera moves
- [ ] Performance on mobile is acceptable (>30 FPS at minimum)
- [ ] Scroll doesn't stutter or create layout shift
