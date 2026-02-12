<template>
  <!-- preloader -->
  <div class="preloader">
    <div class="preloader-inner">
      <span></span><span></span><span></span><span></span>
    </div>
  </div>

  <!-- scroll top -->
  <button class="scroll__top scroll-to-target" data-target="html">
    <i class="fas fa-chevron-up"></i>
  </button>

  <!-- header -->
  <header>
    <div id="header-fixed-height"></div>

    <div id="sticky-header" class="tg-header__area tg-header__area-six">
      <div class="container">
        <nav class="tgmenu__nav">
          <div class="logo">
            <h1>SINOPI</h1>
          </div>

          <div class="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
            <ul class="navigation p-relative">
              <li><a href="#">Beranda</a></li>
              <li class="menu-item-has-children">
                <a href="#">Tugas</a>
                <ul class="sub-menu">
                  <li><a href="#">Kordinator Lapangan</a></li>
                  <li><a href="#">Petugas Pintu Air</a></li>
                  <li><a href="#">Pekarya</a></li>
                </ul>
              </li>
              <li><a href="#">Galeri</a></li>
            </ul>
          </div>

          <div class="tgmenu__action">
            <a href="#" class="tg-btn tg-btn-four">Login</a>
          </div>
        </nav>
      </div>
    </div>
  </header>

  <!-- main -->
  <main class="main-area fix">
    <!-- slider -->
    <section class="slider__area-three">
      <div class="swiper-container slider-active-three">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide slider__bg-four"
            :style="{
              backgroundImage:
                'url(https://images.pexels.com/photos/14594595/pexels-photo-14594595.jpeg)',
            }"
          >
            <div class="container">
              <h1 class="title san-text-center">SINOPI</h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- history -->
    <section class="history__area-four section-py-130">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img
              src="https://images.pexels.com/photos/10041309/pexels-photo-10041309.jpeg"
              class="img-fluid"
            />
          </div>
          <div class="col-lg-6">
            <h2>Sistem Koordinasi dan Pengelolaan Informasi</h2>
            <p>
              Monitoring dan evaluasi kinerja tenaga lapangan pengelola
              irigasi di Jawa Timur.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- footer -->
  <footer class="footer__area-two">
    <div class="container">
      <p>© Command Center | All Right Reserved</p>
    </div>
  </footer>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // load JS vendor lama
  const scripts = [
    "/src/assets/js/vendor/jquery-3.6.0.min.js",
    "/src/assets/js/bootstrap.min.js",
    "/src/assets/js/swiper-bundle.min.js",
    "/src/assets/js/aos.js",
    "/src/assets/js/main.js",
  ];

  scripts.forEach((src) => {
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  });
});
</script>

<style scoped>
/* optional custom override */
</style>
