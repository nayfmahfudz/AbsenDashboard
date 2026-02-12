<template>
    <div class="table w-full p-2">
        <jsonExcel class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        text-center
        font-bold
        p-2
        w-40
        rounded
      " :data="items" :fields="fetch_fields" type="csv">
            Download Absensi
        </jsonExcel>
        <br>
        <br>
        <div class="w-40 mb-4">
            <VueDatePicker :enable-time-picker="false"
                @update:model-value="fetchData" v-model="picked" />
        </div>
        <br>
        <br>
        <br>
        <table class="w-full border">
            <thead>
                <tr class="bg-gray-50 border-b">
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            no
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Nama
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Lokasi
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            X
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Y
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>

                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jam Masuk
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jam Keluar
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr :class="item.tanggal == null ? 'bg-red-100 text-center border-b text-sm text-gray-600' : 'bg-gray-100 text-center border-b text-sm text-gray-600'"
                    v-for="(item, index) in items" :key="item">
                        <td class="p-2 border-r">{{ index + 1 }}</td>
                        <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].type_absen) ? item.absenMasukList[0].type_absen : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].longtitude) ? item.absenMasukList[0].longtitude : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].latitude) ? item.absenMasukList[0].latitude : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].createdAt) ? new Date(item.absenMasukList[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',hour12: true}) : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenKeluarList && item.absenKeluarList[0] && item.absenKeluarList[0].createdAt) ? new Date(item.absenKeluarList[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',hour12: true}) : '-' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import Datepicker from 'vue3-datepicker';
import jsonExcel from "vue-json-excel3";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
    components: {
        jsonExcel,
        Datepicker,
        VueDatePicker
    },
    data() {
        return {
            picked: new Date(),
            items: [],
            fetch_fields: {
                "Nama": {
                    callback: (item) => {
                        return `${item.firstName || ''} ${item.lastName || ''}`.trim();
                    }
                },
                "Lokasi": {
                    callback: (item) => {
                        return (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].type_absen) ? item.absenMasukList[0].type_absen : '-';
                    }
                },
                "X": {
                    callback: (item) => {
                        return (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].longtitude) ? item.absenMasukList[0].longtitude : '-';
                    }
                },
                "Y": {
                    callback: (item) => {
                        return (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].latitude) ? item.absenMasukList[0].latitude : '-';
                    }
                },
                "Jam Masuk": {
                    callback: (item) => {
                        return (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].createdAt) ? new Date(item.absenMasukList[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '-';
                    }
                },
                "Jam Keluar": {
                    callback: (item) => {
                        return (item.absenKeluarList && item.absenKeluarList[0] && item.absenKeluarList[0].createdAt) ? new Date(item.absenKeluarList[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '-';
                    }
                },
            },
        }
    },
    methods: {
        async fetchData() {
            if (!this.picked) return;
            const date = this.picked;
            const offset = date.getTimezoneOffset();
            const dateStr = new Date(date.getTime() - (offset*60*1000)).toISOString().split('T')[0];
            
            try {
                const unitId = JSON.parse(localStorage.user).unitObj.id;
                const result = await axios.get(`http://103.170.197.186:8000/getabsen?tanggal=${dateStr}&unitid=${unitId}`);
                
                if (result.data.status == "Success") {
                    this.items = result.data.data;
                } else {
                    this.items = [];
                }
            } catch (error) {
                console.error(error);
                this.items = [];
            }
        },
    },
    async created() {
        await this.fetchData();
    }

}




</script>
<style>
.dp-small .dp__input {
    width: 10.5rem;
    /* w-14 */
    height: 2.75rem;
    /* h-7 */
    font-size: 0.75rem;
    /* text-xs */
    padding-left: 2.25rem;
    /* px-1 */
    padding-right: 0.25rem;
    box-sizing: border-box;
}
</style>