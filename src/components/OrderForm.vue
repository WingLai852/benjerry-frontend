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

      <!-- Drie smaken: top / midden / onder -->
      <div class="grid sm:grid-cols-3 gap-4 mt-2">
        <div>
          <label class="block text-sm font-medium mb-1">Onderste bol</label>
          <select v-model="flTop" class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- kies --</option>
            <option>vanilla</option>
            <option>chocolate</option>
            <option>strawberry</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bovenste bol</label>
          <select v-model="flMid" class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- kies --</option>
            <option>vanilla</option>
            <option>chocolate</option>
            <option>strawberry</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Midden bol</label>
          <select v-model="flBot" class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- kies --</option>
            <option>vanilla</option>
            <option>chocolate</option>
            <option>strawberry</option>
          </select>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium mb-1">Topping</label>
          <select
            v-model="topping"
            class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- geen --</option>
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
      class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-white font-bold transition-colors duration-200"
      style="background: linear-gradient(90deg, #00B3E6 0%, #7ED957 100%); box-shadow: 0 2px 8px rgba(0,179,230,0.15);"
    >
      🍦 Bestellen
    </button>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

// Let op: nu ook 'preview-update' emitten
const emit = defineEmits(["submitted", "preview-update"]);

const customerName = ref("");
const address = ref("");

// Drie smaken (top, midden, onder)
const flTop = ref("");
const flMid = ref("");
const flBot = ref("");

const topping = ref("");
const size = ref("medium");
const totalPrice = ref(8.5);

// Live updates naar de preview sturen
function pushPreview() {
  emit("preview-update", {
    flavors: [flTop.value, flMid.value, flBot.value], // [top, mid, bottom]
    topping: topping.value,
    size: size.value,
  });
}
onMounted(pushPreview);
watch([flTop, flMid, flBot, topping, size], pushPreview);

// Submit blijft compatibel met je backend (die 1 baseFlavor verwacht)
// We kiezen de bovenste niet-lege smaak als 'baseFlavor'
function submitForm() {
  const primaryFlavor = flTop.value || flMid.value || flBot.value || "";
  emit("submitted", {
    customerName: customerName.value,
    address: address.value,
    items: [{ baseFlavor: primaryFlavor, topping: topping.value, size: size.value }],
    totalPrice: totalPrice.value,
    // Wil je alle bollen opslaan? Voeg dit veld toe in je model/schema:
    // extraFlavors: [flTop.value, flMid.value, flBot.value]
  });
}
</script>
