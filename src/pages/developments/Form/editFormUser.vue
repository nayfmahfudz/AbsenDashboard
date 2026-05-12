<template>
<div class="p-4 bg-white rounded shadow">
  <h2 class="text-lg font-bold mb-4">{{ isEdit ? 'Edit User' : 'Tambah User' }}</h2>
  <form class="w-full" id="appx" @submit="checkForm" method="post">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">NIK</label>
        <input v-model="form.nik" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">First Name</label>
        <input v-model="form.firstName" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text" required>
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Last Name</label>
        <input v-model="form.lastName" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Email</label>
        <input v-model="form.email" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="email" required>
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Password</label>
        <input v-model="form.password" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="password" :required="!isEdit">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Unit</label>
        <select v-model="form.unit" class="block appearance-none w-full bg-gray-200 border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white" required>
          <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.nama_unit }}</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Jenis Petugas</label>
        <select v-model="form.petugas_lapangan" class="block appearance-none w-full bg-gray-200 border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white">
          <option :value="1">Petugas OP</option>
          <option :value="0">Tenaga Pendukung</option>
        </select>
      </div>
      <div v-if="form.petugas_lapangan == 1">
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Jabatan Petugas OP</label>
        <select v-model="form.jabatan" class="block appearance-none w-full bg-gray-200 border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white">
          <option value="">Pilih Jabatan</option>
          <option v-for="op in petugasOP" :key="op.id" :value="op.id.toString()">{{ op.nama_tenaga || op.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Sekolah</label>
        <input v-model="form.sekolah" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Pendidikan Terakhir</label>
        <input v-model="form.pendidikan_terakhir" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Lokasi Kerja</label>
        <input v-model="form.lokasi" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Domisili</label>
        <input v-model="form.domisili" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Jurusan</label>
        <input v-model="form.jurusan" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="text">
      </div>
      <div>
        <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">TTL</label>
        <input v-model="form.TTL" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="date">
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-xs font-bold mb-2 uppercase">Alamat</label>
      <textarea v-model="form.alamat" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" rows="3"></textarea>
    </div>
    <div class="flex flex-wrap gap-6 mb-6">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" v-model="form.admin" :true-value="1" :false-value="0" class="form-checkbox">
        <span class="ml-2 text-xs font-bold text-gray-700 uppercase">Admin</span>
      </label>
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" v-model="form.super_administrator" :true-value="1" :false-value="0" class="form-checkbox">
        <span class="ml-2 text-xs font-bold text-gray-700 uppercase">Super Admin</span>
      </label>
    </div>
    <div class="flex items-center justify-end gap-4">
      <button type="button" @click="$router.back()" class="text-gray-500 hover:text-gray-700 font-bold uppercase text-xs">Batal</button>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow">
        {{ isEdit ? 'Simpan Perubahan' : 'Tambah User' }}
      </button>
    </div>
  </form>
</div>
</template>
<script>

import axios from 'axios';

export default {
  data() {
    return {
      isEdit: false,
      units: [],
      petugasOP: [],
      baseUrl: "http://103.170.197.186:8000",
      form: {
        nik: '',
        firstName: '',
        lastName: '',
        domisili: '',
        lokasi: '',
        email: '',
        password: '',
        unit: null,
        jabatan: '',
        sekolah: '',
        pendidikan_terakhir: '',
        jurusan: '',
        TTL: '',
        alamat: '',
        petugas_lapangan: 0,
        admin: 0,
        super_administrator: 0,
      }
    }
  },
  methods: {
    async fetchUnits() {
      try {
        const res = await axios.get(`${this.baseUrl}/units`);
        this.units = res.data || [];
      } catch (err) {
        console.error("Gagal mengambil data unit:", err);
      }
    },
    async fetchTenagaOp() {
      try {
        const res = await axios.get(`${this.baseUrl}/users/tenaga_op`);
        this.petugasOP = res.data.data || res.data || [];
      } catch (err) {
        console.error("Gagal mengambil data tenaga OP:", err);
      }
    },
    async checkForm(e) {
      e.preventDefault();
      const id = this.$route.params.id;
      const url = id ? `${this.baseUrl}/users/${id}` : `${this.baseUrl}/users`;
      const method = id ? 'put' : 'post';

      const payload = { ...this.form };
      // Jangan kirim password jika kosong saat edit (agar tidak menimpa password lama)
      if (id && !payload.password) {
        delete payload.password;
      }

      // Menghapus nilai null agar sesuai dengan logika Dart: payload.removeWhere((_, v) => v == null)
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });

      try {
        const response = await axios[method](url, payload);
        this.$swal({
          icon: 'success',
          title: 'Berhasil',
          text: response.data.message || 'Data berhasil disimpan'
        });
        this.$router.push({ name: 'listuser' });
      } catch (error) {
        console.error("Submit error:", error);
        this.$swal({
          icon: 'error',
          title: 'Gagal',
          text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
        });
      }
    }
  },
  async created() {
    await this.fetchUnits();
    await this.fetchTenagaOp();
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      try {
        const res = await axios.get(`${this.baseUrl}/users/id/${id}`);
        const userData = res.data.data || res.data;
        
        // Map data API ke objek form
        Object.keys(this.form).forEach(key => {
          if (userData[key] !== undefined) {
            this.form[key] = userData[key];
          }
        });

        // Format tanggal untuk input type="date"
        if (this.form.TTL) {
          this.form.TTL = this.form.TTL.split('T')[0];
        }

        // Map ID Unit
        if (userData.unit) {
          this.form.unit = userData.unit;
        } else if (userData.unitData) {
          this.form.unit = userData.unitData.id;
        }
        
        this.form.password = ''; // Kosongkan password di UI
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Data pengguna tidak ditemukan.'
        });
      }
    }
  }
}

</script>
