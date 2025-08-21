<template>
  <div class="overflow-x-auto border rounded-lg shadow-lg bg-gradient-to-br from-blue-50 via-teal-50 to-yellow-50">
    <table class="w-full text-sm font-sans">
      <thead class="bg-gradient-to-r from-blue-200 via-teal-200 to-yellow-200 text-blue-900">
        <tr>
          <th class="text-left p-3">🍦 ID</th>
          <th class="text-left p-3">🧑 Klant</th>
          <th class="text-left p-3">🏠 Adres</th>
          <th class="text-left p-3">🍨 Item</th>
          <th class="text-left p-3">💶 Prijs</th>
          <th class="text-left p-3">📦 Status</th>
          <th class="text-left p-3">⚡ Acties</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in items" :key="o._id" class="border-t hover:bg-yellow-50 transition">
          <!-- Kort ID met volledige ID als tooltip -->
          <td class="p-3 max-w-[240px] truncate font-mono text-blue-700">
            <span :title="o._id">{{ shortId(o._id) }}</span>
          </td>

          <td class="p-3 font-semibold text-teal-800">{{ o.customerName }}</td>
          <td class="p-3 text-teal-700">{{ o.address }}</td>

          <!-- Item-kolom: toon alle bollen indien extraFlavors bestaat -->
          <td class="p-3">
            <div v-for="(it, i) in o.items" :key="i" class="flex items-center gap-2">
              <span class="inline-block">
                <template v-if="Array.isArray(it.extraFlavors) && it.extraFlavors.some(Boolean)">
                  {{ displayFlavors(it.extraFlavors) }}
                </template>
                <template v-else>
                  {{ it.baseFlavor || "—" }}
                </template>
              </span>
              <span class="text-yellow-700">/</span>
              <span class="italic">{{ it.topping || "geen" }}</span>
              <span class="ml-1 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{{ it.size || "medium" }}</span>
            </div>
          </td>

          <td class="p-3 font-bold text-yellow-800">€ {{ o.totalPrice }}</td>

          <td class="p-3">
            <!-- Alleen lezen -->
            <span
              v-if="!canEdit"
              :class="['inline-flex rounded-full px-2 py-1 text-xs font-medium', statusClass(o.status)]"
            >
              {{ o.status }}
            </span>

            <!-- Dropdown als bewerkbaar -->
            <select
              v-else
              v-model="localStatus[o._id]"
              @change="emitUpdate(o._id)"
              class="rounded-lg border px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
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
              class="rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 text-sm
                     hover:from-red-500 hover:to-red-700 active:scale-95 transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow"
            >
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="items.length===0" class="border-t">
          <td colspan="7" class="p-6 text-center text-gray-500">🍦 Geen bestellingen</td>
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

// ✅ helper: toon meerdere smaken netjes
function displayFlavors(arr = []) {
  const list = arr.filter(Boolean);
  return list.length ? list.join(" + ") : "—";
}

function emitUpdate(id) {
  emit("update-status", { id, status: localStatus[id] });
}
</script>
