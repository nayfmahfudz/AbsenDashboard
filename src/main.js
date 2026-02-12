import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/app.css'
import router from '@/router'
import VueCookies from 'vue3-cookies'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {VueCsvImportPlugin} from "vue-csv-import";
import JsonExcel from "vue-json-excel3";

import "@/assets/css/bootstrap.min.css";
import "@/assets/css/main.css";
import "@/assets/css/animate.min.css";
import "@/assets/css/fontawesome-all.min.css";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


const app = createApp(App)
app.use(VueCookies, {
    expireTimes: "7d",
});
app.use(VueSweetalert2);
app.use(VueCsvImportPlugin);
app.use(router);
app.component('VueDatePicker', VueDatePicker);
app.component("downloadExcel", JsonExcel);
app.mount('#app')
