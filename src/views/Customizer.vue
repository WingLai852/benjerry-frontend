<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold">Stel je ijs samen 🍨</h1>

    <!-- Preview links, formulier rechts (stapelt op mobiel) -->
    <div class="grid md:grid-cols-2 gap-6 items-start">
      <IcePreview
        :flavors="preview.flavors"   
        :topping="preview.topping"
        :size="preview.size"
      />

      <OrderForm
        @submitted="onSubmitted"
        @preview-update="onPreview"
      />
    </div>

    <div v-if="createdId" class="p-3 rounded-lg bg-green-50 border text-green-700">
      <strong>Bestelling geplaatst!</strong> ID: {{ createdId }}
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
  // p = { flavors: [...], topping, size } (van OrderForm)
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
