import { createRouter, createWebHistory } from "vue-router";
import Customizer from "../views/Customizer.vue";
import Admin from "../views/Admin.vue";

const routes = [
  { path: "/", name: "Customizer", component: Customizer },
  { path: "/admin", name: "Admin", component: Admin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
