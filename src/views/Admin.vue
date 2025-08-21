<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-bold">Admin — Bestellingen</h1>

    <!-- Error banner -->
    <div v-if="errorMsg" class="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">
      {{ errorMsg }}
    </div>

    <div v-if="!isAuth" class="flex gap-2">
      <input v-model="password" type="password" placeholder="Admin password"
             class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="doLogin" class="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Login</button>
    </div>

    <div v-else class="flex items-center gap-2">
      <span class="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs">Ingelogd</span>
      <button @click="logout" class="rounded-lg border px-3 py-2 hover:bg-gray-50">Logout</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center">
      <label class="text-sm">
        <span class="block text-gray-600 mb-1">Status filter</span>
        <select :disabled="loading || mutating" v-model="statusFilter" @change="refresh" class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Alle</option>
          <option value="te_verwerken">te_verwerken</option>
          <option value="verzonden">verzonden</option>
          <option value="geannuleerd">geannuleerd</option>
        </select>
      </label>

      <label class="text-sm">
        <span class="block text-gray-600 mb-1">Per pagina</span>
        <select :disabled="loading || mutating" v-model.number="limit" @change="goPage(1)" class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </label>
    </div>

    <!-- Lade-indicator -->
    <div v-if="loading" class="text-sm text-gray-500">Laden…</div>

    <!-- Orders tabel -->
    <OrdersTable
      :items="orders.items"
      :can-edit="isAuth && !mutating && !loading"
      @update-status="onUpdateStatus"
      @delete-order="onDelete"
    />

    <!-- Paginatie -->
    <div class="flex items-center gap-3">
      <button :disabled="page<=1 || loading || mutating" @click="goPage(page-1)" class="rounded-lg border px-3 py-2 disabled:opacity-50">Vorige</button>
      <span class="text-sm text-gray-600">Pagina {{ page }} / {{ orders.totalPages || 1 }}</span>
      <button :disabled="page>=orders.totalPages || loading || mutating" @click="goPage(page+1)" class="rounded-lg border px-3 py-2 disabled:opacity-50">Volgende</button>
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

// ✅ nieuw
const loading = ref(false);
const mutating = ref(false);
const errorMsg = ref("");

async function doLogin() {
  errorMsg.value = "";
  try {
    const { token } = await loginAdmin(password.value);
    localStorage.setItem("admin_token", token);
    isAuth.value = true;
    await refresh();
  } catch (e) {
    errorMsg.value = "Login mislukt";
  }
}

function logout() {
  localStorage.removeItem("admin_token");
  isAuth.value = false;
}

async function refresh() {
  errorMsg.value = "";
  loading.value = true;
  try {
    const data = await getOrders({ page: page.value, limit: limit.value, status: statusFilter.value });
    orders.items = data.items;
    orders.totalPages = data.totalPages;
  } catch (e) {
    errorMsg.value = e?.message || "Laden mislukt";
  } finally {
    loading.value = false;
  }
}

function goPage(p) {
  page.value = p;
  refresh();
}

async function onUpdateStatus({ id, status }) {
  if (!isAuth.value) return alert("Niet ingelogd");
  if (!confirm("Status wijzigen?")) return;

  errorMsg.value = "";
  mutating.value = true;
  try {
    await updateOrderStatus(id, status);
    await refresh();
  } catch (e) {
    errorMsg.value = e?.message || "Status updaten mislukt";
  } finally {
    mutating.value = false;
  }
}

async function onDelete(id) {
  if (!isAuth.value) return alert("Niet ingelogd");
  if (!confirm("Zeker weten verwijderen?")) return;

  errorMsg.value = "";
  mutating.value = true;
  try {
    await deleteOrder(id);
    await refresh();
  } catch (e) {
    errorMsg.value = e?.message || "Verwijderen mislukt";
  } finally {
    mutating.value = false;
  }
}

onMounted(refresh);
</script>
