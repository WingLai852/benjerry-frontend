<template>
  <div ref="wrap" class="w-full max-w-lg aspect-[4/3] rounded-2xl border bg-white overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const props = defineProps({
  // [top, mid, bottom]
  flavors:  { type: Array,  default: () => ["", "", ""] },
  topping:  { type: String, default: "" },
  size:     { type: String, default: "medium" },
});

const wrap = ref(null);
let scene, camera, renderer, controls, model, frameId;
let scoopMeshes = [], toppingMeshes = [];
let baseScale = 1; // schaal na auto-fit

const FLAVOR_COLORS = {
  vanilla: 0xfff3c4,  // crème
  chocolate: 0x7b3f00,// bruin
  strawberry: 0xff7aa2,// roze
  "": 0xe5e7eb        // grijs fallback
};
const TOPPING_COLORS = { oreo: 0x2b2b2b, caramel: 0xc97a40, sprinkles: 0xffcc00, "": 0x000000 };

function init() {
  const w = wrap.value.clientWidth || 600;
  const h = wrap.value.clientHeight || 450;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 1.2, 3.8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  wrap.value.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(3, 5, 4);
  scene.add(dir);

  // optionele vloer
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3, 64),
    new THREE.MeshStandardMaterial({ color: 0xede9fe })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // ---- GLB LOAD ----
  const loader = new GLTFLoader();
  loader.load(
    "/models/TripleScoopIceCream.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      // Auto-fit: centreer & schaal naar doelhoogte
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);

      // pivot naar (0,0,0)
      model.position.sub(center);

      const targetH = 2.2;
      baseScale = size.y > 0 ? (targetH / size.y) : 1.0;
      model.scale.setScalar(baseScale);

      // camera/controls richten
      controls.target.set(0, 0.6, 0);
      controls.update();

      // scoops & toppings verzamelen
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

      // Fallback: pak grootste 3 meshes als "scoops"
      if (scoopMeshes.length === 0) {
        const all = [];
        model.traverse(o => { if (o.isMesh) all.push(o); });
        all.sort((a,b) => (b.geometry?.attributes?.position?.count||0) - (a.geometry?.attributes?.position?.count||0));
        scoopMeshes = all.slice(0, 3);
        console.log("Scoop fallback →", scoopMeshes.map(m => ({ name: m.name, mat: m.material?.name })));
      }

      // Sorteer scoops op hoogte (Y): [top, mid, bottom]
      const tmp = new THREE.Vector3();
      scoopMeshes.sort((a, b) => b.getWorldPosition(tmp).y - a.getWorldPosition(tmp).y);

      applyFlavors();
      applyTopping();
      applySize(); // respecteer props.size
    },
    undefined,
    (err) => {
      console.error("GLB load error:", err);
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

// 👉 kleur per bol op index [top, mid, bottom]
function applyFlavors() {
  scoopMeshes.forEach((m, i) => {
    const flavor = props.flavors?.[i] ?? "";
    const col = FLAVOR_COLORS[flavor] ?? FLAVOR_COLORS[""];
    if (!m.material) return;
    if (Array.isArray(m.material)) {
      m.material.forEach(mat => mat.color?.setHex?.(col));
    } else {
      m.material = m.material.clone(); // voorkom shared material side effects
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
  model.scale.setScalar(baseScale * s); // altijd vanaf baseScale
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
