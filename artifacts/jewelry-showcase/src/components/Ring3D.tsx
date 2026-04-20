import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Ring3DProps {
  metalColor: string;
  stoneCut: string;
  scrollProgress?: number;
}

export function Ring3D({ metalColor, stoneCut, scrollProgress = 0 }: Ring3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const metalColorRef = useRef(metalColor);
  const stoneCutRef = useRef(stoneCut);
  const scrollRef = useRef(scrollProgress);

  metalColorRef.current = metalColor;
  stoneCutRef.current = stoneCut;
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0.3, 0);

    // Check WebGL support before initializing
    const testCanvas = document.createElement('canvas');
    const testCtx = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!testCtx) return;

    // Renderer — reuse the tested canvas
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: testCanvas });
    } catch {
      return;
    }
    mount.appendChild(testCanvas);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // Lighting — cinematic jewelry setup
    const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff1e6, 1.5);
    fillLight.position.set(-4, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffd700, 2.5, 15);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0x8888ff, 0.8, 10);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    const sparkle1 = new THREE.PointLight(0xffffff, 3, 8);
    sparkle1.position.set(2, 2, 3);
    scene.add(sparkle1);

    // Materials
    const createGoldMaterial = (color: string) => new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.97,
      roughness: 0.04,
      envMapIntensity: 1.8,
    });

    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f0f8ff'),
      metalness: 0,
      roughness: 0,
      transmission: 0.98,
      thickness: 0.6,
      ior: 2.42,
      clearcoat: 1,
      clearcoatRoughness: 0,
      reflectivity: 1,
      envMapIntensity: 4,
    });

    // PMREMGenerator for environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create a studio-like environment using gradient colors
    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 32, 32);
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          float y = normalize(vWorldPosition).y;
          vec3 topColor = vec3(0.2, 0.18, 0.15);
          vec3 midColor = vec3(0.08, 0.07, 0.06);
          vec3 botColor = vec3(0.04, 0.03, 0.04);
          vec3 col = y > 0.0 ? mix(midColor, topColor, y) : mix(midColor, botColor, -y);
          // Add warm highlight at top
          col += vec3(0.3, 0.2, 0.1) * max(0.0, y - 0.5);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    envScene.add(envMesh);
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // Ring Group
    const ringGroup = new THREE.Group();
    ringGroup.position.y = 0;
    scene.add(ringGroup);

    let goldMaterial = createGoldMaterial(metalColorRef.current);

    // Band
    const bandGeo = new THREE.TorusGeometry(1.2, 0.13, 48, 120);
    const band = new THREE.Mesh(bandGeo, goldMaterial);
    band.rotation.x = Math.PI / 2;
    band.castShadow = true;
    ringGroup.add(band);

    // Setting base (cathedral shoulders)
    const settingGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.5, 8, 1);
    const setting = new THREE.Mesh(settingGeo, goldMaterial);
    setting.position.y = 1.05;
    setting.castShadow = true;
    ringGroup.add(setting);

    // Shoulder details
    const shoulderLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6, 6), goldMaterial);
    shoulderLeft.position.set(-0.8, 0.6, 0);
    shoulderLeft.rotation.z = Math.PI / 6;
    ringGroup.add(shoulderLeft);

    const shoulderRight = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6, 6), goldMaterial);
    shoulderRight.position.set(0.8, 0.6, 0);
    shoulderRight.rotation.z = -Math.PI / 6;
    ringGroup.add(shoulderRight);

    // Prongs (4 prongs around center stone)
    const prongGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.8, 8);
    const prongPositions = [
      [0.35, 1.4, 0.35], [-0.35, 1.4, 0.35],
      [0.35, 1.4, -0.35], [-0.35, 1.4, -0.35],
    ];
    prongPositions.forEach(([x, y, z]) => {
      const prong = new THREE.Mesh(prongGeo, goldMaterial);
      prong.position.set(x, y, z);
      prong.rotation.x = x > 0 ? 0.3 : -0.3;
      prong.rotation.z = z > 0 ? 0.3 : -0.3;
      ringGroup.add(prong);
    });

    // Center diamond stone
    let stoneGeo: THREE.BufferGeometry;
    if (stoneCutRef.current === 'emerald') {
      stoneGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.45, 8);
    } else {
      stoneGeo = new THREE.IcosahedronGeometry(0.58, 3);
      // Scale to flatter diamond shape
      const posAttr = stoneGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.setY(i, posAttr.getY(i) * 0.65);
      }
      posAttr.needsUpdate = true;
      stoneGeo.computeVertexNormals();
    }
    const stone = new THREE.Mesh(stoneGeo, diamondMaterial);
    stone.position.y = 1.42;
    stone.castShadow = true;
    ringGroup.add(stone);

    // Side accent stones along band top
    const sideStoneGeo = new THREE.IcosahedronGeometry(0.08, 1);
    for (let i = 0; i < 8; i++) {
      const angle = ((i - 3.5) / 7) * Math.PI * 0.8;
      const x = Math.sin(angle) * 1.2;
      const z = Math.cos(angle) * 1.2;
      const sideStone = new THREE.Mesh(sideStoneGeo, diamondMaterial);
      sideStone.position.set(x, 0.13, z);
      ringGroup.add(sideStone);
    }

    // Pedestal shadow plane
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.4;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      // Metal color update
      const currentColor = metalColorRef.current;
      (goldMaterial as THREE.MeshStandardMaterial).color.set(currentColor);

      // Scroll-based tilt
      const scroll = scrollRef.current;
      ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, scroll * Math.PI * 0.3, 0.04);
      ringGroup.position.y = THREE.MathUtils.lerp(ringGroup.position.y, scroll * -1.5, 0.04);

      // Float bob
      ringGroup.position.y += Math.sin(time * 0.8) * 0.008;

      // Sparkle light movement for caustics effect
      sparkle1.position.x = Math.sin(time * 1.2) * 2;
      sparkle1.position.z = Math.cos(time * 0.8) * 3;
      sparkle1.intensity = 2.5 + Math.sin(time * 3) * 0.8;

      rimLight.position.x = Math.sin(time * 0.5) * 2;
      rimLight.intensity = 2 + Math.sin(time * 2) * 0.5;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      pmremGenerator.dispose();
      if (mount.contains(testCanvas)) {
        mount.removeChild(testCanvas);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
