<template>
    <div class="table w-full p-2">

        <br /><br /><br />

        <div class="w-40 mb-4">
            <VueDatePicker 
                v-model="picked" 
                :enable-time-picker="false"
                auto-apply
                model-type="yyyy-MM-dd"
                format="yyyy-MM-dd"
                @update:model-value="fetchData" 
            />
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
            currentPage: 1,
            perPage: 25,
            baseUrl: "http://103.170.197.186:8000", // centralize base
        };
    },
    computed: {
        paginatedItems() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.items.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.items.length / this.perPage);
        }
    },
    methods: {
        async fetchData(newDate) {
            try {
                const unitId = JSON.parse(localStorage.user).unitObj.id;
                const date = newDate || this.picked;
                if (!date) return;
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
        await this.fetchData();
    },
};
</script>