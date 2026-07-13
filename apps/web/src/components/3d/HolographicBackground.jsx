import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HolographicBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const goldParticles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: "#facc15",
        size: 0.055,
        transparent: true,
        opacity: 0.95
      })
    );

    group.add(goldParticles);

    const greenParticles = new THREE.Points(
      particlesGeometry.clone(),
      new THREE.PointsMaterial({
        color: "#22c55e",
        size: 0.035,
        transparent: true,
        opacity: 0.65
      })
    );

    greenParticles.rotation.z = 0.8;
    group.add(greenParticles);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.02, 16, 180),
      new THREE.MeshBasicMaterial({
        color: "#facc15",
        transparent: true,
        opacity: 0.7
      })
    );

    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.5, 0.015, 16, 180),
      new THREE.MeshBasicMaterial({
        color: "#22c55e",
        transparent: true,
        opacity: 0.45
      })
    );

    ring2.rotation.x = Math.PI / 2.8;
    ring2.rotation.y = 0.8;
    group.add(ring2);

    let frame;

    function animate() {
      goldParticles.rotation.y += 0.0018;
      goldParticles.rotation.x += 0.0007;

      greenParticles.rotation.y -= 0.0011;
      greenParticles.rotation.x += 0.0005;

      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

      group.rotation.y += 0.0006;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    }

    animate();

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      mount.innerHTML = "";
      renderer.dispose();
      particlesGeometry.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-100"
    />
  );
}
