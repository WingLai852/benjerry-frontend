<template>
  <div ref="wrap" class="w-full max-w-lg aspect-[4/3] rounded-2xl border overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const props = defineProps({
  flavors:  { type: Array,  default: () => ["", "", ""] }, // [top, mid, bottom]
  topping:  { type: String, default: "" },
  size:     { type: String, default: "medium" },
});

const wrap = ref(null);
let scene, camera, renderer, controls, model, frameId;
let scoopMeshes = [], toppingMeshes = [];
let baseScale = 1;

const FLAVOR_COLORS = {
  vanilla: 0xfff3c4,
  chocolate: 0x7b3f00,
  strawberry: 0xff7aa2,
  "": 0xe5e7eb
};
const TOPPING_COLORS = { oreo: 0x2b2b2b, caramel: 0xc97a40, sprinkles: 0xffcc00, "": 0x000000 };

function init() {
  const w = wrap.value?.clientWidth || 600;
  const h = wrap.value?.clientHeight || 450;

  scene = new THREE.Scene();

  // Gradient achtergrond
  function makeGradient() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#dbeafe"); // lichtblauw boven
    grad.addColorStop(1, "#fef9c3"); // lichtgeel onder
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }
  scene.background = makeGradient();

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 1.2, 3.8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  wrap.value.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(3, 5, 4);
  scene.add(dir);

  // vloer
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3, 64),
    new THREE.MeshStandardMaterial({ color: 0xede9fe })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

 // ---- HDR ENV LOAD ----
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();

new RGBELoader()
  .setDataType(THREE.HalfFloatType)   // ✅ fix voor jouw hdr
  .load("/textures/studio_small_09_2k.hdr", (hdrTex) => {
    const envMap = pmrem.fromEquirectangular(hdrTex).texture;
    scene.environment = envMap;
    hdrTex.dispose();
    pmrem.dispose();
  }, undefined, (err) => {
    console.error("HDR load error:", err);
  });

  // ---- GLB LOAD ----
  const loader = new GLTFLoader();
  loader.load(
    "/models/TripleScoopIceCream.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      model.position.sub(center);

      const targetH = 2.2;
      baseScale = size.y > 0 ? (targetH / size.y) : 1.0;
      model.scale.setScalar(baseScale);

      controls.target.set(0, 0.6, 0);
      controls.update();

      scoopMeshes = [];
      toppingMeshes = [];
      model.traverse((o) => {
        if (o.isMesh) {
          const name = (o.name || "").toLowerCase();
          const mat  = (o.material?.name || "").toLowerCase();
          if (name.includes("scoop") || name.includes("ice") || mat.includes("ice")) scoopMeshes.push(o);
          if (name.includes("topping") || name.includes("sprinkle") || mat.includes("topping")) toppingMeshes.push(o);
        }
      });

      if (scoopMeshes.length === 0) {
        const all = [];
        model.traverse(o => { if (o.isMesh) all.push(o); });
        all.sort((a,b) => (b.geometry?.attributes?.position?.count||0) - (a.geometry?.attributes?.position?.count||0));
        scoopMeshes = all.slice(0, 3);
      }

      const tmp = new THREE.Vector3();
      scoopMeshes.sort((a, b) => b.getWorldPosition(tmp).y - a.getWorldPosition(tmp).y);

      applyFlavors();
      applyTopping();
      applySize();
    }
  );

  const tick = () => {
    frameId = requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  };
  tick();

  window.addEventListener("resize", onResize);
}

function onResize() {
  if (!renderer || !camera || !wrap.value) return;
  const w = wrap.value.clientWidth, h = wrap.value.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function applyFlavors() {
  scoopMeshes.forEach((m, i) => {
    const flavor = props.flavors?.[i] ?? "";
    const col = FLAVOR_COLORS[flavor] ?? FLAVOR_COLORS[""];
    if (!m.material) return;
    if (Array.isArray(m.material)) {
      m.material.forEach(mat => mat.color?.setHex?.(col));
    } else {
      m.material = m.material.clone();
      m.material.color?.setHex(col);
      m.material.roughness = 0.8;
      m.material.metalness = 0.05;
    }
  });
}

function applyTopping() {
  const col = TOPPING_COLORS[props.topping] ?? TOPPING_COLORS[""];
  const visible = !!props.topping;
  toppingMeshes.forEach((m) => {
    m.visible = visible;
    if (!m.material) return;
    if (Array.isArray(m.material)) m.material.forEach(mat => mat.color?.setHex?.(col));
    else { m.material = m.material.clone(); m.material.color?.setHex(col); }
  });
}

function applySize() {
  if (!model) return;
  const map = { small: 0.9, medium: 1.0, large: 1.15 };
  const s = map[props.size] ?? 1.0;
  model.scale.setScalar(baseScale * s);
}

onMounted(init);
watch(() => props.flavors, applyFlavors, { deep: true });
watch(() => props.topping, applyTopping);
watch(() => props.size, applySize);

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId);
  window.removeEventListener("resize", onResize);
  controls?.dispose?.();
  renderer?.dispose?.();
  renderer?.forceContextLoss?.();
  scene = camera = renderer = controls = model = null;
});
</script>
