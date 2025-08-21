<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold">Admin — Bestellingen</h1>

    <div v-if="!isAuth" class="flex gap-2">
      <input v-model="password" type="password" placeholder="Admin password"
             class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="doLogin" class="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Login</button>
    </div>
    <div v-else class="flex items-center gap-2">
      <span class="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs">Ingelogd</span>
      <button @click="logout" class="rounded-lg border px-3 py-2 hover:bg-gray-50">Logout</button>
    </div>

    <div class="flex flex-wrap gap-4 items-center">
      <label class="text-sm">
        <span class="block text-gray-600 mb-1">Status filter</span>
        <select v-model="statusFilter" @change="refresh" class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Alle</option>
          <option value="te_verwerken">te_verwerken</option>
          <option value="verzonden">verzonden</option>
          <option value="geannuleerd">geannuleerd</option>
        </select>
      </label>

      <label class="text-sm">
        <span class="block text-gray-600 mb-1">Per pagina</span>
        <select v-model.number="limit" @change="goPage(1)" class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </label>
    </div>

    <OrdersTable
      :items="orders.items"
      :can-edit="isAuth"
      @update-status="onUpdateStatus"
      @delete-order="onDelete"
    />

    <div class="flex items-center gap-3">
      <button :disabled="page<=1" @click="goPage(page-1)" class="rounded-lg border px-3 py-2 disabled:opacity-50">Vorige</button>
      <span class="text-sm text-gray-600">Pagina {{ page }} / {{ orders.totalPages || 1 }}</span>
      <button :disabled="page>=orders.totalPages" @click="goPage(page+1)" class="rounded-lg border px-3 py-2 disabled:opacity-50">Volgende</button>
    </div>
  </section>
</template>


<script setup>
import { ref, reactive, onMounted } from "vue";
import OrdersTable from "../components/OrdersTable.vue";
import { loginAdmin, getOrders, updateOrderStatus, deleteOrder } from "../services/api.js";

const password = ref("");
const isAuth = ref(!!localStorage.getItem("admin_token"));
const statusFilter = ref("");
const page = ref(1);
const limit = ref(10);
const orders = reactive({ items: [], totalPages: 1 });

async function doLogin() {
  try {
    const { token } = await loginAdmin(password.value);
    localStorage.setItem("admin_token", token);
    isAuth.value = true;
    await refresh();
  } catch {
    alert("Login mislukt");
  }
}

function logout() {
  localStorage.removeItem("admin_token");
  isAuth.value = false;
}

async function refresh() {
  try {
    const data = await getOrders({ page: page.value, limit: limit.value, status: statusFilter.value });
    orders.items = data.items;
    orders.totalPages = data.totalPages;
  } catch {
    alert("Laden mislukt");
  }
}

function goPage(p) {
  page.value = p;
  refresh();
}

async function onUpdateStatus({ id, status }) {
  if (!isAuth.value) return alert("Niet ingelogd");
  try {
    await updateOrderStatus(id, status);
    refresh();
  } catch {
    alert("Status updaten mislukt");
  }
}

async function onDelete(id) {
  if (!isAuth.value) return alert("Niet ingelogd");
  if (!confirm("Zeker weten?")) return;
  try {
    await deleteOrder(id);
    refresh();
  } catch {
    alert("Verwijderen mislukt");
  }
}

onMounted(refresh);
</script>
