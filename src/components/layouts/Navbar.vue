<template>
  <div
    class="fixed top-0 left-0 lg:left-64 right-0 h-14 bg-white border-b border-gray-200 flex flex-row items-center justify-between px-5">
    <h3 class="text-sm font-medium text-gray-600">Welcome, Admin</h3>
    <div class="flex">
      <div class="group flex items-center mr-3 cursor-pointer" @click="Logout()">
        <span class="text-sm  text-gray-600 group-hover:text-gray-800">Logout</span>
        <external-link-icon-o class="ml-1 w-4 h-4 text-gray-600 group-hover:text-gray-800" />
      </div>
      <img src="@/assets/logo.svg" alt="Avatar" class="ml-3 w-6 h-6 rounded-full">
    </div>
  </div>
</template>

<script>
export default {
  el: "#app",
  data() {
  },
  methods: {
    Logout() {
      localStorage.user = "";
      this.$router.push('/login');
    },
  },
};
</script>