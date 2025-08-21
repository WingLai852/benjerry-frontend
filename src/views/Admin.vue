<template>
  <section>
    <h1>Admin — Bestellingen</h1>

    <div v-if="!isAuth" style="margin:12px 0; display:flex; gap:8px;">
      <input v-model="password" type="password" placeholder="Admin password" />
      <button @click="doLogin">Login</button>
    </div>
    <div v-else style="margin:12px 0;">
      Ingelogd ✔
      <button @click="logout" style="margin-left:8px;">Logout</button>
    </div>

    <div style="display:flex; gap:8px; align-items:center; margin:12px 0;">
      <label> Status
        <select v-model="statusFilter" @change="refresh">
          <option value="">Alle</option>
          <option value="te_verwerken">te_verwerken</option>
          <option value="verzonden">verzonden</option>
          <option value="geannuleerd">geannuleerd</option>
        </select>
      </label>

      <label> Per pagina
        <select v-model.number="limit" @change="goPage(1)">
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

    <div style="margin-top:12px; display:flex; gap:8px; align-items:center;">
      <button :disabled="page<=1" @click="goPage(page-1)">Vorige</button>
      <span>Pagina {{ page }} / {{ orders.totalPages || 1 }}</span>
      <button :disabled="page>=orders.totalPages" @click="goPage(page+1)">Volgende</button>
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
