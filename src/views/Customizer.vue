<template>
  <section
    class="space-y-4 p-6 rounded-xl shadow-lg"
    style="background: linear-gradient(135deg, #b3e9ff 0%, #fff7b2 100%)"
  >
    <h1
      class="text-3xl font-extrabold"
      style="color: #009edb; text-shadow: 2px 2px 0 #fff7b2, 4px 4px 0 #009edb"
    >
      Stel je ijs samen 🍨
    </h1>

    <!-- Preview links, formulier rechts (stapelt op mobiel) -->
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <IcePreview
        :flavors="preview.flavors"
        :topping="preview.topping"
        :size="preview.size"
        class="rounded-2xl bg-white/80"
        style="border: 4px solid #009edb; box-shadow: 0 4px 24px 0 rgba(0,158,219,0.15), 0 1.5px 0 #ff5ca7"
      />

      <OrderForm
        @submitted="onSubmitted"
        @preview-update="onPreview"
        class="rounded-2xl bg-white/80"
        style="border: 4px solid #ff5ca7; box-shadow: 0 4px 24px 0 rgba(0,158,219,0.15), 0 1.5px 0 #ff5ca7"
      />
    </div>

    <div
      v-if="createdId"
      class="p-4 rounded-xl font-bold text-lg flex items-center gap-2"
      style="background-color: #eaffd0; border: 2px solid #009edb; color: #009edb; box-shadow: 0 4px 24px 0 rgba(0,158,219,0.15), 0 1.5px 0 #ff5ca7"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="color: #ff5ca7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Bestelling geplaatst! ID: {{ createdId }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import OrderForm from "../components/OrderForm.vue";
import IcePreview from "../components/IcePreview.vue";
import { createOrder } from "../services/api.js";

const createdId = ref("");

// state die we naar de 3D preview sturen
const preview = reactive({
  flavors: ["", "", ""],  // ⬅️ [top, mid, bottom]
  topping: "",
  size: "medium",
});

// vang live updates uit OrderForm
function onPreview(p) {
  preview.flavors = p.flavors;
  preview.topping = p.topping;
  preview.size    = p.size;
}

async function onSubmitted(payload) {
  try {
    const res = await createOrder(payload);
    createdId.value = res._id;
  } catch (e) {
    alert(e.message || "Kon bestelling niet plaatsen");
  }
}
</script>