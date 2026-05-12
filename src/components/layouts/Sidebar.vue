<template>
  <!-- Toggle sidebar button -->
  <button class="fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-900 lg:hidden">
    <menu-alt-4-icon-s 
      class="btn-toggle"
      :class="{'opacity-0': showSidebar}"
      @click="toggleSidebar" />
    <x-icon-s 
      class="btn-toggle"
      :class="{'opacity-0': !showSidebar}"
      @click="toggleSidebar" />
  </button>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden" :class="{'hidden': !showSidebar}"></div>
  <div class="fixed z-40 left-0 top-0 right-24 lg:right-auto lg:w-64 h-screen border-r border-gray-200 overflow-y-auto bg-white" :class="{'hidden': allowSidebarHide && !showSidebar}">
    <!-- Header -->
    <header class="flex items-center pt-10 px-5">
      <img src="@/assets/logo.svg" alt="Logo" class="w-10">
      <div class="ml-2 flex flex-col">
        <h1 class="text-sm text-gray-700 font-medium">Admin Panel</h1>
        <p class="text-gray-400 text-xs">OP</p>
      </div>
    </header>
    <!-- Menu -->
    <div class="mt-14">
      <menu-header text="Development" />
      <menu-item icon="cube-icon-o" text="User">
        <template #sub-menu>
          <menu-item-sub text="Buat User" :route="{name: 'editFormUser'}" />
          <menu-item-sub text="Data User" :route="{name: 'listuser'}" />
        </template>
      </menu-item>
      <menu-item icon="cube-icon-o" text="Absensi">
        <template #sub-menu>
          <menu-item-sub text="Data Bulanan" :route="{name: 'absensiBulanan'}" />
          <menu-item-sub text="Data Harian" :route="{name: 'dataAbsenHarian'}" />
        </template>
      </menu-item>
      <menu-item icon="cube-icon-o" text="Laporan Progress">
        <template #sub-menu>
          <menu-item-sub text="Data Bulanan" :route="{name: 'bulananProgress'}" />
          <menu-item-sub text="Data Harian" :route="{name: 'dataTableProgress'}" />
          <menu-item-sub text="Data peilscale" :route="{name: 'dataTablePeilscale'}" />
        </template>
      </menu-item>
      <!-- <menu-item icon="cube-icon-o" text="Klimatologi">
        <template #sub-menu>
          <menu-item-sub text="Input Data" :route="{name: 'inputposKL'}" />
          <menu-item-sub text="Data" :route="{name: 'listposKL'}" />
        </template>
      </menu-item>
      <menu-item icon="cube-icon-o" text="Kualitas Air">
        <template #sub-menu>
          <menu-item-sub text="Input Data" :route="{name: 'inputposKA'}" />
          <menu-item-sub text="Data" :route="{name: 'listposKA'}" />
        </template>
      </menu-item> -->
    </div>
  </div>
</template>

<script>
import MenuHeader from '@/components/layouts/SidebarMenuHeader.vue'
import MenuItem from '@/components/layouts/SidebarMenuItem.vue'
import MenuItemSub from '@/components/layouts/SidebarMenuItemSub.vue'
import { vueWindowSizeMixin } from 'vue-window-size/option-api'
export default {
  name: 'Sidebar',
  mixins: [vueWindowSizeMixin()],
  components: {
    MenuHeader,
    MenuItem,
    MenuItemSub,
  },
  data() {
    return {
      widthBreakpoint: 1024, // Tailwind 'lg' breakpoint
      showSidebar: false
    }
  },
  watch: {
    $windowWidth(val) {
      if (val < this.widthBreakpoint) { 
        this.showSidebar = false
      }
    },
    $route() {
      this.showSidebar = false
    },
    showSidebar(val) {
      this.$emit('visibility-change', val)
    }
  },
  computed: {
    allowSidebarHide() {
      return this.$windowWidth < this.widthBreakpoint;
    }
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  }
}
</script>

