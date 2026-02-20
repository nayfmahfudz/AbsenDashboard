<template>
    <div class="table w-full p-2">
        <div class="flex justify-start space-x-4">
            <button @click="downloadPDF" class="bg-green-500 hover:bg-green-700 text-white font-bold p-2 w-40 rounded">
                Download PDF
            </button>
        </div>
        <br>
        <br>
        <div class="w-40 mb-4">
            <VueDatePicker :enable-time-picker="false" auto-apply
                @update:model-value="fetchData" v-model="picked" />
        </div>
        <br>
        <br>
        <br>
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
                    v-for="(item, index) in paginatedItems" :key="item.id || index">
                        <td class="p-2 border-r">{{ ((currentPage - 1) * perPage) + index + 1 }}</td>
                        <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].type_absen) ? item.absenMasukList[0].type_absen : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].longtitude) ? item.absenMasukList[0].longtitude : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].latitude) ? item.absenMasukList[0].latitude : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenMasukList && item.absenMasukList[0] && item.absenMasukList[0].createdAt) ? new Date(item.absenMasukList[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',hour12: true}) : '-' }}</td>
                        <td class="p-2 border-r">{{ (item.absenKeluarList && item.absenKeluarList[0] && item.absenKeluarList[0].createdAt) ? new Date(item.absenKeluarList[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',hour12: true}) : '-' }}</td>
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
import '@vuepic/vue-datepicker/dist/main.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import headerImage from '@/assets/header.png';
export default {
    components: {
        VueDatePicker
    },
    data() {
        return {
            picked: new Date(),
            items: [],
            currentPage: 1,
            perPage: 25,
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
        async downloadPDF() {
            const table = this.$refs.table;
            if (!table) {
                alert('Tabel tidak ditemukan untuk di-generate ke PDF.');
                return;
            }

            try {
                const canvas = await html2canvas(table, { //
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
                pdf.text("LAPORAN KEGIATAN HARIAN", pageWidth / 2, margin + headerHeight + 20, { align: "center" });

                pdf.addImage(tableImgData, 'PNG', margin, contentStartY, contentWidth, pdfTableHeight);
                heightLeft -= contentHeight;

                while (heightLeft > 0) {
                    position -= contentHeight;
                    pdf.addPage();
                    pdf.addImage(headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                    
                    pdf.text("LAPORAN KEGIATAN HARIAN", pageWidth / 2, margin + headerHeight + 20, { align: "center" });
                    
                    pdf.addImage(tableImgData, 'PNG', margin, position + contentStartY, contentWidth, pdfTableHeight);
                    heightLeft -= contentHeight;
                }
                
                const dateStr = new Date(this.picked.getTime() - (this.picked.getTimezoneOffset()*60*1000)).toISOString().split('T')[0];
                pdf.save(`Laporan Absensi Harian - ${dateStr}.pdf`);
            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat membuat PDF."+error.message);
            }
        },
        async fetchData(newDate) {
            const date = newDate || this.picked;
            if (!date) return;
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
            this.currentPage = 1;
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