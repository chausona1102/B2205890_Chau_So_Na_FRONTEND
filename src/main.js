// Vue
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
// Router
import router from "./router";
// Bootstrap and FontAwesome
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Create and mount the app
createApp(App).use(router).mount("#app");
