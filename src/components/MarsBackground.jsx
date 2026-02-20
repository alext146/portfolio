import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MarsBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const marsTexture = loader.load('/assets/2k_mars.jpg');
    const normalTexture = loader.load('/assets/mars_1k_normal.jpg');
    const starsTexture = loader.load('/assets/2k_stars.jpg');
    scene.background = starsTexture;

    const geometry = new THREE.SphereGeometry(1.4, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: marsTexture,
      normalMap: normalTexture,
      roughness: 0.9,
      metalness: 0.05
    });

    const mars = new THREE.Mesh(geometry, material);
    mars.position.set(1.2, -0.2, 0);
    scene.add(mars);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(-4, 3, 6);
    scene.add(directional);

    let frameId;
    const animate = () => {
      mars.rotation.y += 0.0015;
      mars.rotation.x += 0.0004;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      marsTexture.dispose();
      normalTexture.dispose();
      starsTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="mars-background" aria-hidden="true" />;
}
