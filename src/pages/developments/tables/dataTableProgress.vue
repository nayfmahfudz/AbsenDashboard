<template>
    <div class="table w-full p-2">

        <br /><br /><br />

        <div style="position: absolute; left: -9999px; width: 794px;">
            <LapkinReport v-if="items.length" ref="pdfReport" :items="items" :date="picked" />
            <LapkinReport v-if="singleItem.length" ref="singlePdfReport" :items="singleItem" :date="picked" />
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
                            Progress 0%
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Progress 50%
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Progress 100%
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
                            Tanggal
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Action
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
                    :class="item.progressList && item.progressList[0] && item.progressList[0].updatedAt == null ? 'bg-red-100 text-center border-b text-sm text-gray-600' : 'bg-gray-100 text-center border-b text-sm text-gray-600'"
                    v-for="(item, index) in items"
                    :key="item.id ?? index"
                >
                    <td class="p-2 border-r">{{ index + 1 }}</td>
                    <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>

                    <td class="p-2 border-r">
                        <img
                            v-if="getProgress(item, 'progress_1')"
                            :src="getProgress(item, 'progress_1')"
                            alt="-"
                            class="mx-auto h-10 w-10 object-cover rounded"
                        />
                        <span v-else class="text-sm text-gray-500">No image</span>
                    </td>

                    <td class="p-2 border-r">
                        <img
                            v-if="getProgress(item, 'progress_50')"
                            :src="getProgress(item, 'progress_50')"
                            alt="-"
                            class="mx-auto h-10 w-10 object-cover rounded"
                        />
                        <span v-else class="text-sm text-gray-500">No image</span>
                    </td>

                    <td class="p-2 border-r">
                        <img
                            v-if="getProgress(item, 'progress_100')"
                            :src="getProgress(item, 'progress_100')"
                            alt="-"
                            class="mx-auto h-10 w-10 object-cover rounded"
                        />
                        <span v-else class="text-sm text-gray-500">No image</span>
                    </td>

                    <td class="p-2 border-r">{{ getField(item, 'longitude') }}</td>
                    <td class="p-2 border-r">{{ getField(item, 'latitude') }}</td>
                    <td class="p-2 border-r">{{ getField(item, 'updatedAt') }}</td>

                    <td class="p-2 border-r">
                        <div class="flex items-center justify-center">
                            <a @click=" this.$router.push('/admin/pdf-harian/' + item.progressList[0].id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm mr-2">
                                View PDF
                            </a>
                            <button
                                v-if="downloadUrl(item)"
                                @click="downloadRowPDF(item)"
                                class="bg-green-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                                Download PDF
                            </button>
                            <span v-else class="text-sm text-gray-500">No file</span>
                        </div>
                        
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import LapkinReport from "@/components/layouts/setupPDFharianpdf.vue";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
    components: { LapkinReport },
    data() {
        return {
            picked: new Date().toLocaleDateString('en-CA'),
            items: [],
            singleItem: [],
            baseUrl: "http://103.170.197.186:8000", // centralize base
        };
    },
    methods: {
        async downloadPDF() {
            // Wait for the component to be rendered
            await this.$nextTick();
            
            const reportElement = this.$refs.pdfReport?.$el;

            if (!reportElement) {
                alert('Tidak ada data untuk di-generate ke PDF.');
                return;
            }

            try {
                const canvas = await html2canvas(reportElement, {
                    scale: 2, // Higher scale for better quality
                    useCORS: true,
                });
                const imgData = canvas.toDataURL('image/png');
                
                // A4 size in points: 595.28 x 841.89
                const pdf = new jsPDF('p', 'pt', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 30;
                const pdfWidth = pageWidth - (margin * 2);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, pdfHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save(`Laporan Progress Harian - ${this.picked}.pdf`);

            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat membuat PDF.");
            }
        },
        async downloadRowPDF(item) {
            this.singleItem = [item];
            await this.$nextTick();

            // Tunggu sebentar untuk memastikan render selesai
            await new Promise(resolve => setTimeout(resolve, 100));

            const reportElement = this.$refs.singlePdfReport?.$el;

            if (!reportElement) {
                alert('Gagal memproses data PDF.');
                return;
            }

            try {
                const canvas = await html2canvas(reportElement, {
                    scale: 2, 
                    useCORS: true,
                });
                const imgData = canvas.toDataURL('image/png');
                
                const pdf = new jsPDF('p', 'pt', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 30;
                const pdfWidth = pageWidth - (margin * 2);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, pdfHeight);
                    heightLeft -= pageHeight;
                }

                const filename = `Laporan Progress - ${(item.firstName || '')} ${(item.lastName || '')}.pdf`;
                pdf.save(filename);

            } catch (error) {
                console.error("Gagal membuat PDF perorangan:", error);
                alert("Terjadi kesalahan saat membuat PDF perorangan.");
            }
        },
        // kembalikan URL lengkap kalau ada, else null
        getProgress(item, key) {
            if (!item || !item.progressList || !item.progressList[0]) return null;
            const val = item.progressList[0][key];
            if (!val) return null;
            return `${this.baseUrl}/${val}`;
        },
        // ambil field dari progressList[0] dengan fallback '-'
        getField(item, field) {
            if (!item || !item.progressList || !item.progressList[0]) return "-";
            return item.progressList[0][field] ?? "-";
        },
        // kembalikan URL download terbaik (100 > 50 > 1)
        downloadUrl(item) {
            if (!item || !item.progressList || !item.progressList[0]) return null;
            const p = item.progressList[0];
            const file = p.progress_100 || p.progress_50 || p.progress_1;
            return file ? `${this.baseUrl}/${file}` : null;
        },
    },
    async created() {
        try {
            const unitId = JSON.parse(localStorage.user).unitObj.id;
            const date = this.picked ?? new Date().toLocaleDateString('en-CA');
            const url = `http://103.170.197.186:8000/getabsen?tanggal=${date}&unitid=${unitId}&petugas_lapangan=1`;
            const result = await axios.get(url);
            if (result.data && result.data.status === "Success") {
                this.items = result.data.data || [];
            } else {
                this.items = [];
                // optional: console.warn(result.data)
            }
        } catch (err) {
            console.error("Fetch error:", err);
            this.items = [];
        }
    },
};
</script>