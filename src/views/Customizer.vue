<template>
  <section class="space-y-4 ben-jerry-bg p-6 rounded-xl shadow-lg">
    <h1 class="text-3xl font-extrabold text-ben-jerry-blue drop-shadow-ben-jerry">Stel je ijs samen 🍨</h1>

    <!-- Preview links, formulier rechts (stapelt op mobiel) -->
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <IcePreview
        :flavors="preview.flavors"   
        :topping="preview.topping"
        :size="preview.size"
        class="rounded-2xl border-4 border-ben-jerry-blue bg-white/80 shadow-ben-jerry"
      />

      <OrderForm
        @submitted="onSubmitted"
        @preview-update="onPreview"
        class="rounded-2xl border-4 border-ben-jerry-pink bg-white/80 shadow-ben-jerry"
      />
    </div>

    <div v-if="createdId" class="p-4 rounded-xl bg-ben-jerry-green border-2 border-ben-jerry-blue text-ben-jerry-blue font-bold text-lg flex items-center gap-2 shadow-ben-jerry">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ben-jerry-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      <span>Bestelling geplaatst! ID: {{ createdId }}</span>
    </div>
  </section>
</template>

<style scoped>
.ben-jerry-bg {
  background: linear-gradient(135deg, #b3e9ff 0%, #fff7b2 100%);
}
.text-ben-jerry-blue {
  color: #009edb;
}
.text-ben-jerry-pink {
  color: #ff5ca7;
}
.text-ben-jerry-green {
  color: #7ed957;
}
.bg-ben-jerry-green {
  background-color: #eaffd0;
}
.border-ben-jerry-blue {
  border-color: #009edb;
}
.border-ben-jerry-pink {
  border-color: #ff5ca7;
}
.shadow-ben-jerry {
  box-shadow: 0 4px 24px 0 rgba(0, 158, 219, 0.15), 0 1.5px 0 #ff5ca7;
}
.drop-shadow-ben-jerry {
  text-shadow: 2px 2px 0 #fff7b2, 4px 4px 0 #009edb;
}
</style>

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
