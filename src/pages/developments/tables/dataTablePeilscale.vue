<template>
    <div class="table w-full p-2">

        <div class="flex flex-wrap items-end gap-4 mb-6">
            <div class="w-40">
                <label class="text-xs font-bold text-gray-600 block mb-1">Tanggal</label>
                <VueDatePicker 
                    v-model="picked" 
                    :enable-time-picker="false"
                    auto-apply
                    model-type="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    @update:model-value="fetchData" 
                />
            </div>
            <div class="w-48" v-if="isSuperAdmin">
                <label class="text-xs font-bold text-gray-600 block mb-1">Unit</label>
                <select 
                    v-model="selectedUnit" 
                    @change="fetchData" 
                    class="w-full h-[38px] px-2 border rounded bg-white text-sm focus:outline-none focus:border-blue-500"
                >
                    <option v-for="unit in units" :key="unit.id" :value="unit.id">
                        {{ unit.nama_unit || unit.name }}
                    </option>
                </select>
            </div>
            <div class="w-64">
                <label class="text-xs font-bold text-gray-600 block mb-1">Cari</label>
                <input 
                    type="text" 
                    v-model="search" 
                    placeholder="Cari Nomenklatur, Nama, NIK..." 
                    class="w-full h-[38px] px-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
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
                            Nomenklatur
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jam
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            TMA
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Debit
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Foto
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Koordinat
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
                <tr
                    class="bg-gray-100 text-center border-b text-sm text-gray-600"
                    v-for="(item, index) in paginatedItems"
                    :key="item.id ?? index"
                >
                    <td class="p-2 border-r">{{ ((currentPage - 1) * perPage) + index + 1 }}</td>
                    <td class="p-2 border-r">{{ item.userData?.firstName }} {{ item.userData?.lastName }}</td>
                    <td class="p-2 border-r">{{ item.nomenklatur }}</td>
                    <td class="p-2 border-r">{{ item.jam }}</td>
                    <td class="p-2 border-r">{{ item.TMA }}</td>
                    <td class="p-2 border-r">{{ item.debit }}</td>

                    <td class="p-2 border-r">
                        <img
                            v-if="item.upload"
                            :src="getImageUrl(item.upload)"
                            alt="-"
                            class="mx-auto h-10 w-10 object-cover rounded"
                        />
                        <span v-else class="text-sm text-gray-500">No image</span>
                    </td>
                    <td class="p-2 border-r">{{ item.latitude }}, {{ item.longitude }}</td>
                </tr>
            </tbody>
        </table>
        <div class="flex justify-center items-center mt-4" v-if="totalPages > 1">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 disabled:opacity-50">
                Sebelumnya
            </button>
            <span class="text-gray-700">Halaman {{ currentPage }} dari {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md ml-2 disabled:opacity-50">
                Berikutnya
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { VueDatePicker } from '@vuepic/vue-datepicker';

export default {
    components: { VueDatePicker },
    data() {
        return {
            picked: new Date().toLocaleDateString('en-CA'),
            items: [],
            units: [],
            selectedUnit: null,
            isSuperAdmin: false,
            search: '',
            currentPage: 1,
            perPage: 25,
            baseUrl: "http://103.170.197.186:8000", // centralize base
        };
    },
    computed: {
        filteredItems() {
            if (!this.search) return this.items;
            const s = this.search.toLowerCase();
            return this.items.filter(item => {
                const nomenklatur = (item.nomenklatur || '').toLowerCase();
                const firstName = (item.userData?.firstName || '').toLowerCase();
                const lastName = (item.userData?.lastName || '').toLowerCase();
                const fullName = `${firstName} ${lastName}`;
                const email = (item.userData?.email || '').toLowerCase();
                const jabatan = (item.userData?.jabatan_op?.nama_tenaga || '').toLowerCase();
                const nik = (item.userData?.nik || '').toLowerCase();

                return nomenklatur.includes(s) || fullName.includes(s) || email.includes(s) || jabatan.includes(s) || nik.includes(s);
            });
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredItems.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.perPage);
        }
    },
    methods: {
        async fetchUnits() {
            try {
               const result = await axios.get(`${this.baseUrl}/units`);
                    this.units = result.data || [];
            } catch (err) {
                console.error("Fetch units error:", err);
            }
        },
        async fetchData(newDate) {
            try {
                let unitId = this.selectedUnit;
                
                // Jika belum ada unit terpilih, gunakan unit dari localStorage
                if (!unitId) {
                    try {
                        const user = JSON.parse(localStorage.user);
                        if (user && user.unitObj) {
                            unitId = user.unitObj.id;
                            this.selectedUnit = unitId;
                        }
                    } catch (e) {
                        console.error("Error parsing user data", e);
                    }
                }

                // Handle newDate jika berasal dari event listener (bukan string)
                const date = (typeof newDate === 'string' ? newDate : null) || this.picked;
                
                if (!date || !unitId) return;
                
                const url = `http://103.170.197.186:8000/tma?tanggal=${date}&unitid=${unitId}&petugas_lapangan=1`;
                const result = await axios.get(url);
                if (result.data && result.data.status === "Success") {
                    this.items = result.data.data || [];
                } else {
                    this.items = [];
                }
                this.currentPage = 1;
            } catch (err) {
                console.error("Fetch error:", err);
                this.items = [];
            }
        },
        getImageUrl(path) {
            if (!path) return null;
            return `${this.baseUrl}/${path}`;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        }
    },
    async created() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            this.isSuperAdmin =  user["super_administrator"] === 1? true : false;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }

        if (this.isSuperAdmin) {
            await this.fetchUnits();
        }
        await this.fetchData();
    },
};
</script>