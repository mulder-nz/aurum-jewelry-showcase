import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Ring3DProps {
  metalColor: string;
  stoneCut: string;    // "round" | "emerald" — drives gem material properties
  glbUrl: string;      // URL to .glb or .gltf file
}

// Determines if a mesh/group belongs to a stone or metal part
// Checks the mesh name AND all ancestor group names up the hierarchy
function classifyNode(object: THREE.Object3D): 'gem' | 'metal' {
  const GEM_KEYWORDS = /gem|stone|diamond|crystal|sapphire|ruby|emerald|topaz|pearl|opal|amethyst/i;
  const METAL_KEYWORDS = /metal|gold|silver|platinum|band|prong|setting|shank|shoulder|ring|base|frame|pave|pavé/i;

  // Walk up the hierarchy
  let node: THREE.Object3D | null = object;
  while (node) {
    if (GEM_KEYWORDS.test(node.name)) return 'gem';
    if (METAL_KEYWORDS.test(node.name)) return 'metal';
    node = node.parent;
  }
  return 'metal'; // default
}

// Build gem material based on cut type
function makeGemMaterial(stoneCut: string): THREE.MeshPhysicalMaterial {
  const isEmerald = stoneCut === 'emerald';
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(isEmerald ? '#c8f0e8' : '#f0f8ff'),
    metalness: 0,
    roughness: 0,
    transmission: isEmerald ? 0.90 : 0.97,
    thickness: isEmerald ? 1.2 : 0.5,
    ior: isEmerald ? 1.58 : 2.42,
    clearcoat: 1,
    clearcoatRoughness: 0,
    reflectivity: 1,
    envMapIntensity: isEmerald ? 3 : 5,
    attenuationColor: new THREE.Color(isEmerald ? '#80ffcc' : '#c8e8ff'),
    attenuationDistance: isEmerald ? 0.8 : 0.4,
  });
}

// Build gold/metal material
function makeMetalMaterial(hexColor: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hexColor),
    metalness: 0.95,
    roughness: 0.12,
    envMapIntensity: 2.5,
  });
}

export function Ring3D({ metalColor, stoneCut, glbUrl }: Ring3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Live refs — animation loop reads these without re-running the effect
  const metalColorRef = useRef(metalColor);
  const stoneCutRef = useRef(stoneCut);
  const glbUrlRef = useRef(glbUrl);
  metalColorRef.current = metalColor;
  stoneCutRef.current = stoneCut;
  glbUrlRef.current = glbUrl;

  // Refs shared between scene-init and content effects
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const gemMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const metalMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // ── Effect 1: Scene, camera, lights, renderer, controls — initialised once ──
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // WebGL availability check
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, canvas });
    } catch { return; }

    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1a1713');

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 200);
    camera.position.set(0, 0.5, 7);

    // ── Lighting: bright cinematic jewelry setup ──
    scene.add(new THREE.AmbientLight(0xfff5e0, 1.8));

    const key = new THREE.DirectionalLight(0xffffff, 8);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xfff0d0, 4);
    fill.position.set(-5, 3, -3);
    scene.add(fill);

    const front = new THREE.DirectionalLight(0xffffff, 3);
    front.position.set(0, 0, 8);
    scene.add(front);

    const rim = new THREE.PointLight(0xffd700, 5, 20);
    rim.position.set(0, 6, -5);
    scene.add(rim);

    const under = new THREE.PointLight(0x8899ff, 1.2, 15);
    under.position.set(0, -4, 3);
    scene.add(under);

    const sparkle = new THREE.PointLight(0xffffff, 6, 12);
    sparkle.position.set(3, 2, 4);
    scene.add(sparkle);

    // ── Environment map for reflections ──
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `
          varying vec3 vPos;
          void main() { vPos = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          varying vec3 vPos;
          void main() {
            float y = normalize(vPos).y;
            vec3 top = vec3(0.25, 0.22, 0.18);
            vec3 mid = vec3(0.09, 0.08, 0.07);
            vec3 bot = vec3(0.04, 0.03, 0.04);
            vec3 col = y > 0.0 ? mix(mid, top, y) : mix(mid, bot, -y);
            col += vec3(0.35, 0.22, 0.08) * max(0.0, y - 0.4);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      })
    ));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Ring group — populated by Effect 2
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    ringGroupRef.current = ringGroup;

    // Shadow plane
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.4 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -3;
    shadow.receiveShadow = true;
    scene.add(shadow);

    // ── Controls: orbit + zoom ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 1.6;

    // ── Animate ──
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;

      // Live material color updates
      if (metalMaterialRef.current) {
        metalMaterialRef.current.color.set(metalColorRef.current);
      }

      // Subtle sparkle caustics
      sparkle.position.x = Math.sin(t * 1.1) * 3;
      sparkle.position.z = Math.cos(t * 0.7) * 4;
      sparkle.intensity = 3.5 + Math.sin(t * 2.8) * 1;
      rim.position.x = Math.sin(t * 0.45) * 2;
      rim.intensity = 2.5 + Math.sin(t * 1.8) * 0.6;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      ringGroupRef.current = null;
      gemMaterialRef.current = null;
      metalMaterialRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      pmrem.dispose();
      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
  }, []);

  // ── Effect 2: Load / reload model whenever glbUrl or stoneCut changes ──
  useEffect(() => {
    const ringGroup = ringGroupRef.current;
    if (!ringGroup) return;

    // Clear previous model
    const old: THREE.Object3D[] = [];
    ringGroup.traverse(o => { if (o !== ringGroup) old.push(o); });
    ringGroup.clear();
    old.forEach(o => {
      if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose();
    });
    gemMaterialRef.current?.dispose();
    metalMaterialRef.current?.dispose();
    gemMaterialRef.current = null;
    metalMaterialRef.current = null;

    if (!glbUrl) return;

    const gemMat = makeGemMaterial(stoneCutRef.current);
    const metalMat = makeMetalMaterial(metalColorRef.current);
    gemMaterialRef.current = gemMat;
    metalMaterialRef.current = metalMat;

    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        const model = gltf.scene;

        // Auto-centre and scale to fit view
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        model.position.sub(centre);
        model.scale.setScalar(3.5 / maxDim);

        // Log layer names to console for debugging
        model.children.forEach(child => {
          console.log('[Ring3D] group:', child.name, '→', classifyNode(child));
        });

        // Classify every mesh and apply materials
        model.traverse(child => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const type = classifyNode(mesh);
          mesh.material = type === 'gem' ? gemMat : metalMat;
        });

        ringGroup.add(model);
      },
      undefined,
      (err) => console.error('[Ring3D] load error:', err)
    );
  }, [glbUrl, stoneCut]);

  // ── Effect 3: Update gem material when stoneCut changes (without reloading) ──
  useEffect(() => {
    const gem = gemMaterialRef.current;
    if (!gem) return;
    const isEmerald = stoneCut === 'emerald';
    gem.color.set(isEmerald ? '#c8f0e8' : '#f0f8ff');
    gem.transmission = isEmerald ? 0.90 : 0.97;
    gem.thickness = isEmerald ? 1.2 : 0.5;
    gem.ior = isEmerald ? 1.58 : 2.42;
    gem.envMapIntensity = isEmerald ? 3 : 5;
    gem.attenuationColor.set(isEmerald ? '#80ffcc' : '#c8e8ff');
    gem.attenuationDistance = isEmerald ? 0.8 : 0.4;
    gem.needsUpdate = true;
  }, [stoneCut]);

  return <div ref={mountRef} className="w-full h-full" />;
}
