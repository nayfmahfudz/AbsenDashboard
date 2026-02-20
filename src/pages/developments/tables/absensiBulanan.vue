<template>
    <div class="table w-full p-2">
        <div class="flex justify-start space-x-4">
            <button @click="downloadPDF" class="bg-green-500 hover:bg-green-700 text-white font-bold p-4 w-40 rounded">
                Download PDF
            </button>
        </div>

        <br /><br /><br />

        <div class="w-40 mb-4">
            <VueDatePicker 
                v-model="picked" 
                month-picker 
                auto-apply
                @update:model-value="fetchData" 
            />
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import headerImage from '@/assets/header.png';

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
                
                const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                const month = monthNames[this.picked.month];
                const year = this.picked.year;
                pdf.save(`Laporan Absensi Bulanan - ${month} ${year}.pdf`);
            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat membuat PDF.");
            }
        },
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
                    petugas_lapangan: 0
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