<template>
  <form @submit.prevent="submitForm" class="grid gap-4 max-w-lg">
    <div>
      <label class="block text-sm font-medium mb-1">Naam</label>
      <input 
        v-model="customerName" 
        required 
        class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Voornaam Achternaam" 
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Adres</label>
      <input 
        v-model="address" 
        required 
        class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Straat 1, 1000 Brussel" 
      />
    </div>

    <fieldset class="rounded-lg border p-4">
      <legend class="text-sm font-semibold px-2">Ice parameters</legend>

      <div class="grid sm:grid-cols-3 gap-4 mt-2">
        <div>
          <label class="block text-sm font-medium mb-1">Basis smaak</label>
          <select 
            v-model="baseFlavor" 
            required 
            class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- kies --</option>
            <option>vanilla</option>
            <option>chocolate</option>
            <option>strawberry</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Topping</label>
          <select 
            v-model="topping" 
            required 
            class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- kies --</option>
            <option>oreo</option>
            <option>caramel</option>
            <option>sprinkles</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Grootte</label>
          <select 
            v-model="size" 
            class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>small</option>
            <option selected>medium</option>
            <option>large</option>
          </select>
        </div>
      </div>
    </fieldset>

    <div>
      <label class="block text-sm font-medium mb-1">Totaalprijs (€)</label>
      <input 
        type="number" 
        step="0.1" 
        min="0" 
        v-model.number="totalPrice" 
        required 
        class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>

    <button 
      type="submit" 
      class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-blue-600 font-medium hover:bg-green-700 active:scale-[.99]"
    >
      Bestellen
    </button>
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
