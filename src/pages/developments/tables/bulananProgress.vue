<template>
    <div class="table w-full p-2">
        <jsonExcel
            class="
                bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                p-4
                w-40
                rounded
            "
            :data="items"
            :fields="fetch_fields"
            type="csv"
        >
            Download
        </jsonExcel>

        <br /><br /><br />

        <div class="w-40 mb-4">
            <VueDatePicker 
                v-model="picked" 
                month-picker 
                @update:model-value="fetchData" 
            />
        </div>

        <table class="w-full border">
            <thead>
                <tr class="bg-gray-50 border-b">
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            No
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Nama
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jabatan
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Absen Masuk
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Absen Keluar
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jumlah Progress
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-gray-100 text-center border-b text-sm text-gray-600"
                    v-for="(item, index) in items"
                    :key="item.id ?? index"
                >
                    <td class="p-2 border-r">{{ index + 1 }}</td>
                    <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>
                    <td class="p-2 border-r">{{ item.jabatan }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_masuk }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_keluar }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_progress }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
// @ts-ignore
import jsonExcel from "vue-json-excel3";

export default {
    components: { jsonExcel, VueDatePicker },
    data() {
        return {
            picked: { month: new Date().getMonth(), year: new Date().getFullYear() },
            items: [],
            fetch_fields: {
                ID: "id",
                "First Name": "firstName",
                "Last Name": "lastName",
                Jabatan: "jabatan",
                "Absen Masuk": "jumlah_absen_masuk",
                "Absen Keluar": "jumlah_absen_keluar",
                "Jumlah Progress": "jumlah_progress",
            },
            baseUrl: "http://103.170.197.186:8000", // centralize base
        };
    },
    methods: {
        async fetchData() {
            try {
                if (!this.picked) return;
                const unitId = JSON.parse(localStorage.user).unitObj.id;
                
                // Format tanggal ke YYYY-MM-01 untuk API
                // picked.month dimulai dari 0 (Januari = 0)
                let year = this.picked.year;
                let month = this.picked.month + 1; 
                const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

                const url = `http://192.168.10.102:8000/rekap_bulanan`;
                const result = await axios.post(url, {
                    tanggal: dateStr,
                    unitid: unitId,
                    petugas_lapangan: 1
                });
                if (result.data && result.data.status === "Success") {
                    this.items = result.data.data || [];
                } else {
                    this.items = [];
                }
            } catch (err) {
                console.error("Fetch error:", err);
                this.items = [];
            }
        }
    },
    async created() {
        await this.fetchData();
    },
};
</script>