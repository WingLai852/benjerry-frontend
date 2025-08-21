<template>
  <div class="overflow-x-auto border rounded-lg">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="text-left p-3">ID</th>
          <th class="text-left p-3">Klant</th>
          <th class="text-left p-3">Adres</th>
          <th class="text-left p-3">Item</th>
          <th class="text-left p-3">Prijs</th>
          <th class="text-left p-3">Status</th>
          <th class="text-left p-3">Acties</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in items" :key="o._id" class="border-t">
          <td class="p-3 max-w-[240px] truncate">{{ o._id }}</td>
          <td class="p-3">{{ o.customerName }}</td>
          <td class="p-3">{{ o.address }}</td>
          <td class="p-3">
            <div v-for="(it, i) in o.items" :key="i">
              {{ it.baseFlavor }} / {{ it.topping }} ({{ it.size }})
            </div>
          </td>
          <td class="p-3">€ {{ o.totalPrice }}</td>
          <td class="p-3">
            <span v-if="!canEdit" class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs">
              {{ o.status }}
            </span>
            <select
              v-else
              v-model="localStatus[o._id]"
              @change="emitUpdate(o._id)"
              class="rounded-lg border px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="te_verwerken">te_verwerken</option>
              <option value="verzonden">verzonden</option>
              <option value="geannuleerd">geannuleerd</option>
            </select>
          </td>
          <td class="p-3">
            <button
              v-if="canEdit"
              @click="$emit('delete-order', o._id)"
              class="rounded-lg bg-red-600 text-white px-3 py-1 text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="items.length===0" class="border-t">
          <td colspan="7" class="p-6 text-center text-gray-500">Geen bestellingen</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { reactive, watch } from "vue";
const props = defineProps({ items: Array, canEdit: Boolean });
const emit = defineEmits(["update-status", "delete-order"]);

const localStatus = reactive({});

watch(
  () => props.items,
  (val = []) => {
    Object.keys(localStatus).forEach(k => delete localStatus[k]);
    val.forEach(o => (localStatus[o._id] = o.status));
  },
  { immediate: true }
);

function emitUpdate(id) {
  emit("update-status", { id, status: localStatus[id] });
}
</script>
