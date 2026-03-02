
<template>
    <div class="table w-full p-2">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div class="flex flex-wrap items-end gap-4">
                <div class="w-64" v-if="isSuperAdmin">
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
                            Unit
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jabatan
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

                <tr class="bg-gray-100 text-center border-b text-sm text-gray-600"
                    v-for="(item, index) in paginatedItems" :key="item.id ?? index">
                    <td class="p-2 border-r">{{ ((currentPage - 1) * perPage) + index + 1 }}</td>
                    <td class="p-2 border-r">{{ item.firstName + ' ' + item.lastName }}</td>
                    <td class="p-2 border-r">{{ item.unitObj.nama_unit }}</td>
                    <td class="p-2 border-r">{{ item.jabatan }}</td>
                </tr>
            </tbody>
        </table>
        <div class="flex justify-center items-center mt-4" v-if="totalPages > 1">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 disabled:opacity-50">
                Sebelumnya
            </button>
            <span class="text-gray-700">Halaman {{ currentPage }} dari {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md ml-2 disabled:opacity-50">
                Berikutnya
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import headerImage from '@/assets/header.png';
export default {
    data() {
        return {
            items: [],
            units: [],
            selectedUnit: null,
            isSuperAdmin: false,
            search: '',
            currentPage: 1,
            perPage: 25,
            baseUrl: "http://103.170.197.186:8000", // centralize base
            fetch_fields: {
                "No": "no",
                "Nama": {
                    callback: (item) => {
                        return `${item.firstName || ''} ${item.lastName || ''}`.trim();
                    }
                },
                "Unit": "unitObj.nama_unit",
                "Jabatan": "jabatan",
            }
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
        async fetchData() {
            try {
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
                if (!unitId) return;

                const result = await axios.get(`${this.baseUrl}/users/unit/${unitId}`);
                this.items = result.data;
            } catch (error) {
                console.error("Fetch data error:", error);
            }
        },
        async downloadPDF() {
            const table = this.$refs.table;
            if (!table) {
                alert('Tabel tidak ditemukan untuk di-generate ke PDF.');
                return;
            }

            try {
                const canvas = await html2canvas(table, {
                    scale: 2,
                    useCORS: true,
                });
                const tableImgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF('p', 'pt', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 40;
                const headerHeight = 60;
                const headerBottomMargin = 20;

                const contentWidth = pageWidth - margin * 2;
                const contentStartY = margin + headerHeight + headerBottomMargin;
                const contentHeight = pageHeight - contentStartY - margin;

                const tableImgProps = pdf.getImageProperties(tableImgData);
                const pdfTableHeight = (tableImgProps.height * contentWidth) / tableImgProps.width;

                let heightLeft = pdfTableHeight;
                let position = 0;

                pdf.addImage(headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                pdf.addImage(tableImgData, 'PNG', margin, contentStartY, contentWidth, pdfTableHeight);
                heightLeft -= contentHeight;

                while (heightLeft > 0) {
                    position -= contentHeight;
                    pdf.addPage();
                    pdf.addImage(headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                    pdf.addImage(tableImgData, 'PNG', margin, position + contentStartY, contentWidth, pdfTableHeight);
                    heightLeft -= contentHeight;
                }

                pdf.save(`Daftar Pengguna.pdf`);
            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat membuat PDF.");
            }
        },
        exportToCSV() {
            const items = this.itemsForExport;
            if (!items || items.length === 0) {
                return;
            }

            const delimiter = ';';
            const fields = this.fetch_fields;
            const headers = Object.keys(fields);

            const csvRows = [headers.join(delimiter)];

            items.forEach(item => {
                const row = headers.map(header => {
                    const fieldConfig = fields[header];
                    let value;

                    if (typeof fieldConfig === 'string') {
                        const path = fieldConfig.split('.');
                        let nestedValue = item;
                        for (const key of path) {
                            if (nestedValue === null || typeof nestedValue === 'undefined') {
                                nestedValue = '';
                                break;
                            }
                            nestedValue = nestedValue[key];
                        }
                        value = nestedValue;
                    } else if (typeof fieldConfig === 'object' && fieldConfig.callback) {
                        value = fieldConfig.callback(item);
                    }
                    
                    value = (value === null || typeof value === 'undefined') ? '' : value;
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                });
                csvRows.push(row.join(delimiter));
            });

            const csvContent = csvRows.join('\r\n');
            const bom = '\uFEFF';
            const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "Daftar Pengguna.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
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
    computed: {
        filteredItems() {
            if (!this.search) return this.items;
            const lowerSearch = this.search.toLowerCase();
            return this.items.filter(item => {
                const fullName = ((item.firstName || '') + ' ' + (item.lastName || '')).toLowerCase();
                return fullName.includes(lowerSearch);
            });
        },
        itemsForExport() {
            return this.items.map((item, index) => {
                return { ...item, no: index + 1 };
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
    async created() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            this.isSuperAdmin =  user["super_administrator"] === 1? true : false;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }

        if (this.isSuperAdmin) {
            try {
            const user = JSON.parse(localStorage.getItem('user'));
            this.isSuperAdmin =  user["super_administrator"] === 1? true : false;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }

        if (this.isSuperAdmin) {
            await this.fetchUnits();
        }
        }
        await this.fetchData();
    }

}




</script>