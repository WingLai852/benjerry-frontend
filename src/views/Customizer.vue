<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold">Stel je ijs samen 🍨</h1>
    <OrderForm @submitted="onSubmitted" />
    <div v-if="createdId" class="p-3 rounded-lg bg-green-50 border text-green-700">
      <strong>Bestelling geplaatst!</strong> ID: {{ createdId }}
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import OrderForm from "../components/OrderForm.vue";
import { createOrder } from "../services/api.js";

const createdId = ref("");

async function onSubmitted(payload) {
  try {
    const res = await createOrder(payload);
    createdId.value = res._id;
  } catch (e) {
    alert(e.message || "Kon bestelling niet plaatsen");
  }
}
</script>
