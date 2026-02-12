<template>
  <div ref="printArea">
    <div v-for="(safeData, index) in finalData" :key="index" class="lapkin" :style="index > 0 ? 'page-break-before: always;' : ''">
    <!-- HEADER -->
    <div class="header">
      <h1>LAPORAN KEGIATAN PEMELIHARAAN RUTIN BBWS BRANTAS</h1>
      <p>{{ safeData.di }} </p>
      <p>TAHUN ANGGARAN {{ safeData.tahun }}</p>
    </div>

    <!-- INFO -->
    <table>
      <tr>
        <td>METODE KERJA</td><td>: {{ safeData.metode }}</td>
        <td>NAMA PETUGAS</td><td>: {{ safeData.petugas }}</td>
      </tr>
      <tr>
        <td>JABATAN</td><td>: {{ safeData.jabatan }}</td>
        <td>Unit</td><td>: {{ safeData.ppk }}</td>
      </tr>
      <tr>
        <td>URGENSI</td>
        <td colspan="3">: {{ safeData.urgensi }}</td>
      </tr>
      <tr>
        <td>TANGGAL KEGIATAN</td>
        <td colspan="3">: {{ safeData.tanggal }}</td>
      </tr>
    </table>

    <!-- DOKUMENTASI -->
    <table>
      <tr>
        <th>No</th>
        <th>URAIAN KEGIATAN</th>
        <th>DOKUMENTASI</th>
      </tr>

      <!-- SECTION I -->
      <tr class="section">
        <td>I</td><td>SALURAN DAN BANGUNAN</td><td>FOTO 0%</td>
      </tr>
      <tr>
        <td>1</td>
        <td>Nama Saluran : {{ safeData.saluran }}</td>
        <td rowspan="3">
          <img :src="safeData.foto0" class="foto img-box" @error="onImgError" />
        </td>
      </tr>
      <tr><td>2</td><td>Nama Bangunan : {{ safeData.bangunan }}</td></tr>
      <tr><td>3</td><td>Kejuron : {{ safeData.kejuron }}</td></tr>

      <!-- SECTION II -->
      <tr class="section">
        <td>II</td><td>LOKASI</td><td>FOTO 50%</td>
      </tr>
      <tr>
        <td>1</td>
        <td>Desa : {{ safeData.desa }}</td>
        <td rowspan="4">
          <img :src="safeData.foto50" class="foto" @error="onImgError" />
        </td>
      </tr>
      <tr><td>2</td><td>Kecamatan : {{ safeData.kecamatan }}</td></tr>
      <tr><td>3</td><td>Kab/Kota : {{ safeData.kabupaten }}</td></tr>
      <tr><td>4</td><td>Koordinat : {{ safeData.koordinat }}</td></tr>
<br><br><br><br><br><br><br><br>
      <!-- SECTION III -->
      <tr class="section">
        <td>III</td><td>OUTPUT KEGIATAN</td><td>FOTO 100%</td>
      </tr>
      <tr>
        <td>1</td>
        <td>Luas Area : {{ safeData.luas }}</td>
        <td rowspan="10">
          <img :src="safeData.foto100" class="foto-lg" @error="onImgError" />
        </td>
      </tr>
      <tr><td>2</td><td>Panjang Saluran : {{ safeData.panjang }}</td></tr>
      <tr><td>3</td><td>Angkat Sedimen : {{ safeData.sedimen }}</td></tr>
      <tr><td>4</td><td>Pembersihan Sampah : {{ safeData.sampah }}</td></tr>
      <tr><td>5</td><td>Menutup Bocoran : {{ safeData.bocoran }}</td></tr>
      <tr><td>6</td><td>Pelumasan Pintu Air : {{ safeData.pelumasan }}</td></tr>
      <tr><td>7</td><td>Pengecatan Pintu Air : {{ safeData.pengecatan }}</td></tr>
      <tr><td>8</td><td>Angkat Potong Pohon : {{ safeData.pohon }}</td></tr>
      <tr><td>9</td><td>TMA : {{ safeData.tma }}</td></tr>
      <tr><td>10</td><td>Debit : {{ safeData.debit }}</td></tr>

      <!-- MAP -->
      <tr class="section">
        <td>IV</td>
        <td colspan="2">MAP</td>
        </tr>
      <tr>
        <td>1</td>
        <td colspan="2">
          <img :src="safeData.map" class="foto-lg" @error="onImgError" />
        </td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const placeholder =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='18'>No Image</text></svg>"

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    date: {
      type: [String, Date],
      default: ''
    }
  },
  data() {
    return {
      placeholder,
      safeData: {
        tahun: new Date().getFullYear(),
        di: '-',
        metode: 'Manual',
        petugas: '-',
        jabatan: '-',
        ppk: 'PPK OP I',
        urgensi: 'Normal',
        tanggal: new Date().toLocaleDateString('en-CA'),
        saluran: '-',
        bangunan: '-',
        kejuron: '-',
        desa: '-',
        kecamatan: '-',
        kabupaten: '-',
        koordinat: '-',
        luas: '-',
        panjang: '-',
        sedimen: '-',
        sampah: '-',
        bocoran: '-',
        pelumasan: '-',
        pengecatan: '-',
        pohon: '-',
        tma: '-',
        debit: '-',
        foto0: placeholder,
        foto50: placeholder,
        foto100: placeholder,
        map: placeholder
      }
    }
  },
  computed: {
    finalData() {
      if (this.items && this.items.length > 0) {
        return this.items.map(item => this.mapItemToData(item));
      }
      return [this.safeData];
    }
  },
  methods: {
    onImgError(e) {
      const img = e && e.target
      if (!img) return
      img.onerror = null
      img.src = this.placeholder
    },
    getImgUrl(p) {
      const baseApi = 'http://103.170.197.186:8000/'
      if (!p) return this.placeholder
      if (Array.isArray(p) && p.length) p = p[0]
      if (typeof p !== 'string') return this.placeholder
      if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:image')) return p
      return baseApi.replace(/\/$/, '') + '/' + p.replace(/^\/+/, '')
    },
    mapItemToData(item) {
      const p = (item.progressList && item.progressList.length) ? item.progressList[0] : {};
      const user = item;
      
      return {
        tahun: p.createdAt ? new Date(p.createdAt).getFullYear() : new Date().getFullYear(),
        di: p.DI || '-',
        metode: 'Manual',
        petugas: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        jabatan: user.jabatan || user.unitObj?.nama_unit || user.unitData?.nama_unit || '-',
        ppk: user.unitObj?.nama_unit || user.unitData?.nama_unit || 'PPK OP I',
        urgensi: 'Normal',
        tanggal: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-CA') : (this.date || new Date().toLocaleDateString('en-CA')),
        saluran: p.DI || '-',
        bangunan: p.wilayah_kerja || '-',
        kejuron: '-',
        desa: p.kelurahan || '-',
        kecamatan: p.kecamatan || '-',
        kabupaten: p.kota || '-',
        koordinat: (p.latitude || p.longitude) ? `${p.latitude}, ${p.longitude}` : '-',
        luas: p.luas_area_kegiatan || '-',
        panjang: p.panjang_saluran || '-',
        sedimen: p.angkat_sedimen || '-',
        sampah: p.pembersihan_sampah || '-',
        bocoran: p.menutup_bocoran || '-',
        pelumasan: p.pelumasan_pintu_air || '-',
        pengecatan: p.pengecatan_pintu_air || '-',
        pohon: p.angkat_potong_pohon || '-',
        tma: p.TMA || '-',
        debit: p.debit || '-',
        foto0: this.getImgUrl(p.progress_1),
        foto50: this.getImgUrl(p.progress_50),
        foto100: this.getImgUrl(p.progress_100),
        map: this.getImgUrl(p.map)
      };
    },
    async fetchData() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const idUser = user?.id || ''
        const baseApi = 'http://103.170.197.186:8000/'
        const url = `${baseApi}getprogres?id=${this.$route.params.id || ''}&idUser=${idUser}`

        const res = await axios.get(url)
        if (res?.data?.status === 'Success') {
          const raw = res.data.data || {}
          // Reuse the helper method

          // mapping images
          this.safeData.foto0 = this.getImgUrl(raw.progress_1)
          this.safeData.foto50 = this.getImgUrl(raw.progress_50)
          this.safeData.foto100 = this.getImgUrl(raw.progress_100)
          this.safeData.map = this.getImgUrl(raw.map)

          // mapping info
          this.safeData.petugas = `${raw.user?.firstName || ''} ${raw.user?.lastName || ''}`.trim() || this.safeData.petugas
          this.safeData.jabatan = raw.user?.unitData?.nama_unit || this.safeData.jabatan
          this.safeData.ppk = raw.user?.unitData?.nama_unit || this.safeData.ppk
          this.safeData.di = raw.DI || this.safeData.di
          this.safeData.saluran = raw.DI || this.safeData.saluran
          this.safeData.bangunan = raw.wilayah_kerja || this.safeData.bangunan
          
          this.safeData.kecamatan = raw.kecamatan || this.safeData.kecamatan
          this.safeData.kabupaten = raw.kota || this.safeData.kabupaten
          this.safeData.desa = raw.kelurahan || this.safeData.desa

          // mapping activities
          this.safeData.luas = raw.luas_area_kegiatan ?? this.safeData.luas
          this.safeData.panjang = raw.panjang_saluran ?? this.safeData.panjang
          this.safeData.sedimen = raw.angkat_sedimen ?? this.safeData.sedimen
          this.safeData.sampah = raw.pembersihan_sampah ?? this.safeData.sampah
          this.safeData.bocoran = raw.menutup_bocoran ?? this.safeData.bocoran
          this.safeData.pelumasan = raw.pelumasan_pintu_air ?? this.safeData.pelumasan
          this.safeData.pengecatan = raw.pengecatan_pintu_air ?? this.safeData.pengecatan
          this.safeData.pohon = raw.angkat_potong_pohon ?? this.safeData.pohon
          this.safeData.tma = raw.TMA ?? this.safeData.tma
          this.safeData.debit = raw.debit ?? this.safeData.debit

          const lat = raw.latitude || ''
          const lon = raw.longitude || ''
          this.safeData.koordinat = (lat || lon) ? `${lat}, ${lon}` : this.safeData.koordinat

          if (raw.createdAt) {
            try {
              this.safeData.tanggal = new Date(raw.createdAt).toLocaleDateString('en-CA')
              this.safeData.tahun = new Date(raw.createdAt).getFullYear()
            } catch (e) { /* keep default */ }
          }
        }
      } catch (err) {
        console.error('fetch error', err)
      }
    }
  },
  created() {
    if (!this.items || this.items.length === 0) {
      this.fetchData()
    }
  }
}
</script>

<style scoped>
 
.lapkin {
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: top;
}

th, .section {
  background: #f2f2f2;
  font-weight: bold;
}

.foto {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.foto-lg {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
