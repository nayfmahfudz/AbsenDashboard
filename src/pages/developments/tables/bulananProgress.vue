<template>
    <div class="table w-full p-2">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div class="flex flex-wrap items-end gap-4">
                <div class="w-40">
                    <label class="text-xs font-bold text-gray-600 block mb-1">Bulan & Tahun</label>
                    <VueDatePicker 
                        v-model="picked" 
                        month-picker 
                        auto-apply
                        @update:model-value="fetchData" 
                    />
                </div>
                <div class="w-48" v-if="isSuperAdmin">
                    <label class="text-xs font-bold text-gray-600 block mb-1">Unit</label>
                    <select 
                        v-model="selectedUnit" 
                        @change="fetchData" 
                        class="w-full h-12 px-2 border rounded bg-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option v-for="unit in units" :key="unit.id" :value="unit.id">
                            {{ unit.nama_unit || unit.name }}
                        </option>
                    </select>
                </div>
                <div class="w-64">
                    <label class="text-xs font-bold text-gray-600 block mb-1">Cari Nama</label>
                    <input 
                        type="text" 
                        v-model="search" 
                        placeholder="Cari Nama..." 
                        class="w-full h-[38px] px-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>
            <button @click="downloadPDF" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded h-[38px] flex items-center shadow">
                Download PDF
            </button>
        </div>

        <table class="w-full border" ref="table">
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
                    v-for="(item, index) in paginatedItems"
                    :key="item.id ?? index"
                >
                    <td class="p-2 border-r">{{ ((currentPage - 1) * perPage) + index + 1 }}</td>
                    <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>
                    <td class="p-2 border-r">{{ item.jabatan }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_masuk }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_keluar }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_progress }}</td>
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import headerImage from '@/assets/header.png';
import '@vuepic/vue-datepicker/dist/main.css';
// @ts-ignore
import jsonExcel from "vue-json-excel3";

export default {
    components: { jsonExcel, VueDatePicker },
    data() {
        return {
            picked: { month: new Date().getMonth(), year: new Date().getFullYear() },
            items: [],
            units: [],
            selectedUnit: null,
            isSuperAdmin: false,
            search: '',
            currentPage: 1,
            perPage: 25,
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
    computed: {
        filteredItems() {
            if (!this.search) return this.items;
            const lowerSearch = this.search.toLowerCase();
            return this.items.filter(item => {
                const fullName = ((item.firstName || '') + ' ' + (item.lastName || '')).toLowerCase();
                return fullName.includes(lowerSearch);
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
            const dateObj = newDate || this.picked;
            try {
                if (!dateObj) return;
                let unitId = this.selectedUnit;

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
                
                // Format tanggal ke YYYY-MM-01 untuk API
                // picked.month dimulai dari 0 (Januari = 0)
                let year = dateObj.year;
                let month = dateObj.month + 1; 
                const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

                const url = `${this.baseUrl}/rekap_bulanan`;
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
            this.currentPage = 1;
        },
        async downloadPDF() {
            const table = this.$refs.table;
            if (!table) {
                alert('Tabel tidak ditemukan untuk di-generate ke PDF.');
                return;
            }

            try {
                const canvas = await html2canvas(table, {
                    scale: 4,
                    useCORS: true,
                });
                const tableImgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF('p', 'pt', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 40;
                const headerHeight = 60;
                const titleHeight = 30;
                const headerBottomMargin = 10;
                
                const contentWidth = pageWidth - margin * 2;
                const contentStartY = margin + headerHeight + titleHeight + headerBottomMargin;
                const contentHeight = pageHeight - contentStartY - margin;

                const tableImgProps = pdf.getImageProperties(tableImgData);
                const pdfTableHeight = (tableImgProps.height * contentWidth) / tableImgProps.width;

                let heightLeft = pdfTableHeight;
                let position = 0;

                pdf.addImage(headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text("LAPORAN REKAP BULANAN", pageWidth / 2, margin + headerHeight + 20, { align: "center" });

                pdf.addImage(tableImgData, 'PNG', margin, contentStartY, contentWidth, pdfTableHeight);
                heightLeft -= contentHeight;

                while (heightLeft > 0) {
                    position -= contentHeight;
                    pdf.addPage();
                    pdf.addImage(headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                    pdf.text("LAPORAN REKAP BULANAN", pageWidth / 2, margin + headerHeight + 20, { align: "center" });
                    pdf.addImage(tableImgData, 'PNG', margin, position + contentStartY, contentWidth, pdfTableHeight);
                    heightLeft -= contentHeight;
                }
                
                pdf.save(`Laporan Rekap Bulanan - ${this.picked.year}-${String(this.picked.month + 1).padStart(2, '0')}.pdf`);
            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat membuat PDF: " + error.message);
            }
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
        },
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