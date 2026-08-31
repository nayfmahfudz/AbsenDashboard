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
                    <label class="text-xs font-bold text-gray-600 block mb-1">Cari</label>
                    <input 
                        type="text" 
                        v-model="search" 
                        placeholder="Cari Nama, Email, NIK, Jabatan..." 
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
                    <th class="p-2 border-r text-sm font-thin text-gray-500 no-print">
                        <div class="flex items-center justify-center">
                            Laporan
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-gray-100 text-center border-b text-sm text-gray-600"
                    v-for="(item, index) in filteredItems"
                    :key="item.id ?? index"
                >
                    <td class="p-2 border-r">{{ index + 1 }}</td>
                    <td class="p-2 border-r">{{ (item.firstName || '') + ' ' + (item.lastName || '') }}</td>
                    <td class="p-2 border-r">{{ item.jabatan_op || item.jabatan || '-' }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_masuk }}</td>
                    <td class="p-2 border-r">{{ item.jumlah_absen_keluar }}</td>
                    <td class="p-2 border-r no-print">
                        <button
                            @click="downloadDetail(item)"
                            :disabled="detailLoadingId !== null || (!item.jumlah_absen_masuk && !item.jumlah_absen_keluar)"
                            class="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {{ detailLoadingId === item.id ? 'Memproses...' : 'Detail PDF' }}
                        </button>
                    </td>
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
            units: [],
            selectedUnit: null,
            isSuperAdmin: false,
            search: '',
            detailLoadingId: null,
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
                const firstName = (item.firstName || '').toLowerCase();
                const lastName = (item.lastName || '').toLowerCase();
                const fullName = `${firstName} ${lastName}`;
                const email = (item.email || '').toLowerCase();
                const jabatan = (item.jabatan_op || item.jabatan || '').toLowerCase();
                const nik = (item.nik || '').toLowerCase();

                return fullName.includes(lowerSearch) || email.includes(lowerSearch) || jabatan.includes(lowerSearch) || nik.includes(lowerSearch);
            });
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
                const canvas = await html2canvas(table, {
                    scale: 2,
                    useCORS: true,
                    onclone: (doc) => {
                        doc.querySelectorAll('.no-print').forEach((el) => { el.style.display = 'none'; });
                    },
                });
                const tableImgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF('l', 'pt', 'a4');
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
        absenFotoUrl(foto) {
            if (!foto) return null;
            if (/^https?:\/\//.test(foto) || String(foto).startsWith('data:image')) return foto;
            return `${this.baseUrl}/${String(foto).replace(/^\/+/, '')}`;
        },
        async imgToDataURL(url) {
            if (!url) return null;
            // Coba lewat fetch + FileReader
            try {
                const res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
                if (res.ok) {
                    const blob = await res.blob();
                    const viaFetch = await new Promise((resolve) => {
                        const fr = new FileReader();
                        fr.onloadend = () => resolve(fr.result);
                        fr.onerror = () => resolve(null);
                        fr.readAsDataURL(blob);
                    });
                    if (viaFetch) return viaFetch;
                }
            } catch (e) {
                console.warn('imgToDataURL fetch gagal, coba via <img>:', url, e && e.message);
            }
            // Fallback: muat via elemen Image lalu gambar ke canvas
            try {
                return await new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            canvas.getContext('2d').drawImage(img, 0, 0);
                            resolve(canvas.toDataURL('image/jpeg', 0.85));
                        } catch (e) {
                            resolve(null);
                        }
                    };
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            } catch (e) {
                return null;
            }
        },
        placePhoto(pdf, dataUrl, x, y, boxW, boxH) {
            if (!dataUrl) {
                pdf.setFontSize(7);
                pdf.setTextColor(150);
                pdf.text('Tidak ada foto', x + boxW / 2, y + boxH / 2, { align: 'center' });
                pdf.setTextColor(0);
                return;
            }
            try {
                const props = pdf.getImageProperties(dataUrl);
                const pad = 4;
                const ratio = Math.min((boxW - pad * 2) / props.width, (boxH - pad * 2) / props.height);
                const w = props.width * ratio;
                const h = props.height * ratio;
                const fmt = (props.fileType || '').toLowerCase().includes('png') ? 'PNG' : 'JPEG';
                pdf.addImage(dataUrl, fmt, x + (boxW - w) / 2, y + (boxH - h) / 2, w, h);
            } catch (e) {
                pdf.setFontSize(7);
                pdf.setTextColor(150);
                pdf.text('Foto gagal dimuat', x + boxW / 2, y + boxH / 2, { align: 'center' });
                pdf.setTextColor(0);
            }
        },
        async downloadDetail(item) {
            if (this.detailLoadingId !== null) return;
            this.detailLoadingId = item.id;
            try {
                let unitId = this.selectedUnit;
                if (!unitId) {
                    try {
                        const u = JSON.parse(localStorage.getItem('user') || 'null');
                        unitId = u?.unitObj?.id ?? null;
                    } catch (e) { /* ignore */ }
                }

                // Kumpulkan tanggal unik dari data absen masuk & keluar bulan terpilih
                const dateSet = new Set();
                (item.data_masuk || []).forEach((r) => r.createdAt && dateSet.add(r.createdAt.split('T')[0]));
                (item.data_keluar || []).forEach((r) => r.createdAt && dateSet.add(r.createdAt.split('T')[0]));
                const dates = Array.from(dateSet).sort();

                if (!dates.length) {
                    alert('Tidak ada data absensi untuk pegawai ini pada bulan terpilih.');
                    return;
                }

                // Ambil detail (lokasi + foto) untuk tiap tanggal (paralel)
                const rows = await Promise.all(dates.map(async (tgl) => {
                    try {
                        const res = await axios.get(`${this.baseUrl}/getabsen`, {
                            params: { idUser: item.id, tanggal: tgl, unitid: unitId ?? '' },
                        });
                        const d = (res.data && res.data.data && res.data.data[0]) || {};
                        return {
                            tgl,
                            masuk: (d.absenMasukList && d.absenMasukList[0]) || null,
                            keluar: (d.absenKeluarList && d.absenKeluarList[0]) || null,
                        };
                    } catch (e) {
                        return { tgl, masuk: null, keluar: null };
                    }
                }));

                // Konversi foto ke data URL agar bisa disematkan ke PDF (paralel)
                await Promise.all(rows.map(async (row) => {
                    row.fotoMasuk = row.masuk ? await this.imgToDataURL(this.absenFotoUrl(row.masuk.foto)) : null;
                    row.fotoKeluar = row.keluar ? await this.imgToDataURL(this.absenFotoUrl(row.keluar.foto)) : null;
                }));

                // Siapkan gambar kop surat sebagai data URL (aman untuk jsPDF)
                this._headerImgData = await this.imgToDataURL(headerImage);

                try {
                    this.buildDetailPDF(item, rows);
                } catch (e) {
                    console.error('buildDetailPDF error:', e);
                    alert('Gagal menyusun file PDF: ' + (e && e.message ? e.message : e));
                }
            } catch (err) {
                console.error('Gagal membuat laporan detail:', err);
                alert('Terjadi kesalahan saat membuat laporan detail: ' + (err && err.message ? err.message : err));
            } finally {
                this.detailLoadingId = null;
            }
        },
        buildDetailPDF(item, rows) {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            const periode = `${monthNames[this.picked.month]} ${this.picked.year}`;
            const nama = `${item.firstName || ''} ${item.lastName || ''}`.trim();
            const jabatan = item.jabatan_op || item.jabatan || '-';

            const pdf = new jsPDF('l', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 30;
            const headerHeight = 55;
            const contentWidth = pageWidth - margin * 2;

            const cols = [
                { key: 'no', label: 'No', w: 28 },
                { key: 'tanggal', label: 'Tanggal', w: 92 },
                { key: 'jamMasuk', label: 'Jam Masuk', w: 58 },
                { key: 'lokasiMasuk', label: 'Lokasi Masuk', w: 132 },
                { key: 'fotoMasuk', label: 'Foto Masuk', w: 122 },
                { key: 'jamKeluar', label: 'Jam Keluar', w: 58 },
                { key: 'lokasiKeluar', label: 'Lokasi Keluar', w: 132 },
                { key: 'fotoKeluar', label: 'Foto Keluar', w: 122 },
            ];
            const totalW = cols.reduce((s, c) => s + c.w, 0);
            const scale = contentWidth / totalW;
            cols.forEach((c) => { c.w *= scale; });

            const rowHeight = 92;

            const drawPageHeader = () => {
                try {
                    pdf.addImage(this._headerImgData || headerImage, 'PNG', margin, margin, contentWidth, headerHeight, undefined, 'NONE');
                } catch (e) { /* lewati header bila gagal */ }
                let ty = margin + headerHeight + 18;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(12);
                pdf.text('LAPORAN DETAIL ABSENSI PEGAWAI', pageWidth / 2, ty, { align: 'center' });
                ty += 15;
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                pdf.text(`Nama: ${nama}   |   Jabatan: ${jabatan}   |   Periode: ${periode}`, pageWidth / 2, ty, { align: 'center' });
                return ty + 10;
            };

            const drawTableHeader = (startY) => {
                const hH = 18;
                pdf.setFillColor(240, 240, 240);
                pdf.setDrawColor(180);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8);
                let x = margin;
                cols.forEach((c) => {
                    pdf.rect(x, startY, c.w, hH, 'FD');
                    pdf.text(c.label, x + c.w / 2, startY + 12, { align: 'center' });
                    x += c.w;
                });
                return startY + hH;
            };

            const fmtTanggal = (ds) => {
                const d = new Date(`${ds}T00:00:00`);
                const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()];
                const bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()];
                return `${hari}\n${d.getDate()} ${bln} ${d.getFullYear()}`;
            };
            const fmtJam = (iso) => (iso ? new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-');
            const fmtLokasi = (rec, label) => {
                if (!rec) return `Tidak absen ${label}`;
                const koord = (rec.latitude || rec.longtitude) ? `${rec.latitude || '-'}, ${rec.longtitude || '-'}` : '';
                return `${rec.lokasi_absen || '-'}\n(${rec.type_absen || '-'})\n${koord}`.trim();
            };

            let cursorY = drawPageHeader();
            cursorY = drawTableHeader(cursorY);

            rows.forEach((row, i) => {
                if (cursorY + rowHeight > pageHeight - margin) {
                    pdf.addPage();
                    cursorY = drawPageHeader();
                    cursorY = drawTableHeader(cursorY);
                }
                const cellData = {
                    no: String(i + 1),
                    tanggal: fmtTanggal(row.tgl),
                    jamMasuk: fmtJam(row.masuk && row.masuk.createdAt),
                    lokasiMasuk: fmtLokasi(row.masuk, 'masuk'),
                    jamKeluar: fmtJam(row.keluar && row.keluar.createdAt),
                    lokasiKeluar: fmtLokasi(row.keluar, 'keluar'),
                };
                let x = margin;
                pdf.setDrawColor(180);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                cols.forEach((c) => {
                    pdf.rect(x, cursorY, c.w, rowHeight);
                    if (c.key === 'fotoMasuk') {
                        this.placePhoto(pdf, row.fotoMasuk, x, cursorY, c.w, rowHeight);
                    } else if (c.key === 'fotoKeluar') {
                        this.placePhoto(pdf, row.fotoKeluar, x, cursorY, c.w, rowHeight);
                    } else {
                        const txt = pdf.splitTextToSize(String(cellData[c.key] ?? '-'), c.w - 6);
                        pdf.text(txt, x + c.w / 2, cursorY + 14, { align: 'center' });
                    }
                    x += c.w;
                });
                cursorY += rowHeight;
            });

            if (cursorY + 30 > pageHeight - margin) {
                pdf.addPage();
                cursorY = drawPageHeader();
            }
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.text(
                `Total Absen Masuk: ${item.jumlah_absen_masuk ?? 0}     Total Absen Keluar: ${item.jumlah_absen_keluar ?? 0}     Jumlah Hari Tercatat: ${rows.length}`,
                margin,
                cursorY + 20,
            );

            const safeName = (nama.replace(/[^\w\s-]/g, '').trim()) || 'Pegawai';
            pdf.save(`Detail Absensi - ${safeName} - ${monthNames[this.picked.month]} ${this.picked.year}.pdf`);
        },
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
                if (!this.picked) return;
                let unitId = this.selectedUnit;

                // Jika belum ada unit terpilih, gunakan unit dari localStorage
                if (!unitId) {
                    try {
                        const userStr = localStorage.getItem('user');
                        const user = userStr ? JSON.parse(userStr) : null;
                        if (user?.unitObj) {
                            unitId = user.unitObj.id;
                            this.selectedUnit = unitId;
                        }
                    } catch (e) {
                        console.error("Error parsing user data", e);
                    }
                }

                // Format tanggal ke YYYY-MM-01 untuk API
                // picked.month dimulai dari 0 (Januari = 0)
                let year = this.picked.year;
                let month = this.picked.month + 1; 
                const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

                const url = `${this.baseUrl}/rekap_bulanan`;
                const result = await axios.post(url, {
                    tanggal: dateStr,
                    unitid: unitId
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
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            this.isSuperAdmin = user?.super_administrator === 1;
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