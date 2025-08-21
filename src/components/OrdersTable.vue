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
          <!-- Kort ID met volledige ID als tooltip -->
          <td class="p-3 max-w-[240px] truncate">
            <span :title="o._id">{{ shortId(o._id) }}</span>
          </td>

          <td class="p-3">{{ o.customerName }}</td>
          <td class="p-3">{{ o.address }}</td>

          <td class="p-3">
            <div v-for="(it, i) in o.items" :key="i">
              {{ it.baseFlavor }} / {{ it.topping }} ({{ it.size }})
            </div>
          </td>

          <td class="p-3">€ {{ o.totalPrice }}</td>

          <td class="p-3">
            <!-- Alleen lezen -->
            <span v-if="!canEdit" :class="['inline-flex rounded-full px-2 py-1 text-xs font-medium', statusClass(o.status)]">
              {{ o.status }}
            </span>

            <!-- Dropdown als bewerkbaar -->
            <select
              v-else
              v-model="localStatus[o._id]"
              @change="emitUpdate(o._id)"
              class="rounded-lg border px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              class="rounded-lg bg-red-500 text-white px-3 py-1 text-sm
                     hover:bg-red-700 active:scale-95 transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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

const props = defineProps({
  items: { type: Array, default: () => [] },
  canEdit: { type: Boolean, default: false },
});
const emit = defineEmits(["update-status", "delete-order"]);

const localStatus = reactive({});

// sync dropdown status met data
watch(
  () => props.items,
  (val = []) => {
    Object.keys(localStatus).forEach(k => delete localStatus[k]);
    val.forEach(o => (localStatus[o._id] = o.status));
  },
  { immediate: true }
);

// badge kleur op basis van status
function statusClass(status) {
  switch (status) {
    case "verzonden":
      return "bg-green-100 text-green-800";
    case "geannuleerd":
      return "bg-red-100 text-red-700";
    default: // te_verwerken
      return "bg-gray-100 text-gray-700";
  }
}

// korte ID weergeven
function shortId(id = "") {
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

function emitUpdate(id) {
  emit("update-status", { id, status: localStatus[id] });
}
</script>
