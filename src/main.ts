import router from "./router";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";

// const app = createApp(App);
//
// app.use(Antd).mount("#app");
// createApp(App).use(router).mount("#app");

createApp(App).use(Antd).use(router).mount("#app");
