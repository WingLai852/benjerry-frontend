import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css"; // << belangrijk


createApp(App).use(router).mount("#app");
