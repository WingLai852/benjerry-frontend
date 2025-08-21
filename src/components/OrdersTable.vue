<template>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
    <thead>
      <tr>
        <th>ID</th><th>Klant</th><th>Adres</th><th>Item</th><th>Prijs</th><th>Status</th><th>Acties</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="o in items" :key="o._id">
        <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;">{{ o._id }}</td>
        <td>{{ o.customerName }}</td>
        <td>{{ o.address }}</td>
        <td>
          <div v-for="(it, i) in o.items" :key="i">
            {{ it.baseFlavor }} / {{ it.topping }} ({{ it.size }})
          </div>
        </td>
        <td>€ {{ o.totalPrice }}</td>
        <td>
          <span v-if="!canEdit">{{ o.status }}</span>
          <select v-else v-model="localStatus[o._id]" @change="emitUpdate(o._id)">
            <option value="te_verwerken">te_verwerken</option>
            <option value="verzonden">verzonden</option>
            <option value="geannuleerd">geannuleerd</option>
          </select>
        </td>
        <td>
          <button v-if="canEdit" @click="$emit('delete-order', o._id)">Delete</button>
        </td>
      </tr>
      <tr v-if="items.length===0">
        <td colspan="7" style="text-align:center;">Geen bestellingen</td>
      </tr>
    </tbody>
  </table>
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
