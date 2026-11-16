(function () {
  if (typeof THREE === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'shader-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '-1',
    pointerEvents: 'none'
  });
  document.body.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Adapted from The Book of Shaders (13/2d-fbm.frag)
  const fragmentShader = `
    precision mediump float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColorBase;
    uniform vec3 uColorMid;
    uniform vec3 uColorGlow;

    float random(in vec2 _st) {
      return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(in vec2 _st) {
      vec2 i = floor(_st);
      vec2 f = fract(_st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    #define NUM_OCTAVES 5
    float fbm(in vec2 _st) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy * 3.0;
      st.x *= uResolution.x / uResolution.y;

      // Subtle mouse parallax offset
      st += (uMouse - 0.5) * 0.35;

      vec2 q = vec2(0.0);
      q.x = fbm(st + 0.05 * uTime);
      q.y = fbm(st + vec2(1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.12 * uTime);
      r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.10 * uTime);

      float f = fbm(st + r);

      vec3 color = mix(uColorBase, uColorMid, clamp((f * f) * 3.5, 0.0, 1.0));
      color = mix(color, uColorGlow, clamp(length(q) * 0.65, 0.0, 1.0));
      color = mix(color, uColorGlow, clamp(length(r.x) * 0.5, 0.0, 1.0));

      gl_FragColor = vec4((f * f * f + 0.6 * f * f + 0.5 * f) * color, 1.0);
    }
  `;

  const getThemeColors = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return isLight
      ? {
          base: new THREE.Color('#f4f7f6'),
          mid: new THREE.Color('#d1fae5'),
          glow: new THREE.Color('#6ee7b7')
        }
      : {
          base: new THREE.Color('#070b0e'),
          mid: new THREE.Color('#0d2622'),
          glow: new THREE.Color('#10b981')
        };
  };

  const initialColors = getThemeColors();
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorBase: { value: initialColors.base },
    uColorMid: { value: initialColors.mid },
    uColorGlow: { value: initialColors.glow }
  };

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  // Sync automatically with your dark/light theme toggle
  const observer = new MutationObserver(() => {
    const next = getThemeColors();
    uniforms.uColorBase.value.copy(next.base);
    uniforms.uColorMid.value.copy(next.mid);
    uniforms.uColorGlow.value.copy(next.glow);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Smooth mouse tracking
  const targetMouse = new THREE.Vector2(0.5, 0.5);
  window.addEventListener('pointermove', (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - e.clientY / window.innerHeight;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();

  function animate() {
    uniforms.uMouse.value.lerp(targetMouse, 0.05);
    if (!prefersReducedMotion) {
      uniforms.uTime.value = clock.getElapsedTime();
      requestAnimationFrame(animate);
    }
    renderer.render(scene, camera);
  }
  animate();
})();