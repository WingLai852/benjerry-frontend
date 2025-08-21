<template>
  <form @submit.prevent="submitForm" style="display:grid; gap:8px; max-width:420px;">
    <label>Naam <input v-model="customerName" required /></label>
    <label>Adres <input v-model="address" required /></label>

    <fieldset style="border:1px solid #ddd; padding:8px;">
      <legend>Ice parameters</legend>
      <label>
        Basis smaak
        <select v-model="baseFlavor" required>
          <option value="">-- kies --</option>
          <option>vanilla</option>
          <option>chocolate</option>
          <option>strawberry</option>
        </select>
      </label>

      <label>
        Topping
        <select v-model="topping" required>
          <option value="">-- kies --</option>
          <option>oreo</option>
          <option>caramel</option>
          <option>sprinkles</option>
        </select>
      </label>

      <label>
        Grootte
        <select v-model="size">
          <option>small</option>
          <option selected>medium</option>
          <option>large</option>
        </select>
      </label>
    </fieldset>

    <label>
      Totaalprijs (€)
      <input type="number" step="0.1" min="0" v-model.number="totalPrice" required />
    </label>

    <button type="submit">Bestellen</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["submitted"]);

const customerName = ref("");
const address = ref("");
const baseFlavor = ref("");
const topping = ref("");
const size = ref("medium");
const totalPrice = ref(8.5);

function submitForm() {
  emit("submitted", {
    customerName: customerName.value,
    address: address.value,
    items: [{ baseFlavor: baseFlavor.value, topping: topping.value, size: size.value }],
    totalPrice: totalPrice.value,
  });
}
</script>
