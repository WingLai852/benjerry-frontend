<template>
  <section>
    <h1>Stel je ijs samen 🍨</h1>
    <OrderForm @submitted="onSubmitted" />
    <div v-if="createdId" style="margin-top:12px;">
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
