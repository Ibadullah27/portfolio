import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolio3D() {
  let container = document.getElementById('canvas-3d-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'canvas-3d-container';
    document.body.prepend(container);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  // One quiet geometric accent sits behind the Hero profile card.
  const heroGroup = new THREE.Group();
  const accentMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.32
  });
  const heroMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, 1), accentMaterial);
  heroGroup.add(heroMesh);
  heroGroup.position.set(window.innerWidth < 768 ? 1.15 : 2.0, -0.05, -0.6);
  heroGroup.scale.setScalar(window.innerWidth < 768 ? 0.72 : 0.9);
  scene.add(heroGroup);

  gsap.to(accentMaterial, {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  window.addEventListener('mousemove', (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 0.14;
    targetY = (event.clientY / window.innerHeight - 0.5) * 0.14;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    heroGroup.position.x = window.innerWidth < 768 ? 1.15 : 2.0;
    heroGroup.scale.setScalar(window.innerWidth < 768 ? 0.72 : 0.9);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    heroGroup.rotation.y += 0.0018;
    heroGroup.rotation.x += (targetY - mouseY) * 0.035;
    heroGroup.rotation.y += (targetX - mouseX) * 0.035;
    mouseX += (targetX - mouseX) * 0.035;
    mouseY += (targetY - mouseY) * 0.035;
    heroMesh.rotation.z = Math.sin(elapsed * 0.35) * 0.06;
    renderer.render(scene, camera);
  }
  animate();
}
