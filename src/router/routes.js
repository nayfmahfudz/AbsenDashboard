const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue')
  },
  { 
    path: '/admin', 
    component: () =>import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'homeAdmin',
        alias: 'homeAdmin',
        name: 'homeAdmin',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'pdf-harian/:id',
        alias: 'pdf-harian',
        name: 'pdf-harian',
        component: () => import('@/components/layouts/setupPDFharianpdf.vue')
      },
      {
        path: 'guest',
        name: 'guest',
        component: () => import('@/pages/Guest.vue')
      },
      {
        path: 'dev/getting-started',
        name: 'dev-getting-started',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'editFormUser',
        name: 'editFormUser',
        component: () => import('@/pages/developments/Form/editFormUser.vue')
      },
      {
        path: 'editFormUser/:id',
        name: 'editFormUser-id',
        component: () => import('@/pages/developments/Form/editFormUser.vue')
      },
      {
        path: 'absensiBulanan',
        name: 'absensiBulanan',
        component: () => import('@/pages/developments/tables/absensiBulanan.vue')
      },
      {
        path: 'bulananProgress',
        name: 'bulananProgress',
        component: () => import('@/pages/developments/tables/bulananProgress.vue')
      },
      {
        path: 'listposDA',
        name: 'listposDA',
        component: () => import('@/pages/developments/tables/dataTablePosDA.vue')
      },
      {
        path: 'listposKL',
        name: 'listposKL',
        component: () => import('@/pages/developments/tables/dataTablePosKL.vue')
      },
      {
        path: 'listposKA',
        name: 'listposKA',
        component: () => import('@/pages/developments/tables/dataTablePosKA.vue')
      },
      {
        path: 'dataAbsenHarian',
        name: 'dataAbsenHarian',
        component: () => import('@/pages/developments/tables/dataAbsenHarian.vue')
      },
      {
        path: 'dataTableProgress',
        name: 'dataTableProgress',
        component: () => import('@/pages/developments/tables/dataTableProgress.vue')
      },
      {
        path: 'dataTablePeilscale',
        name: 'dataTablePeilscale',
        component: () => import('@/pages/developments/tables/dataTablePeilscale.vue')
      },
      {
        path: 'listuser',
        name: 'listuser',
        component: () => import('@/pages/developments/tables/dataTableUser.vue')
      },
      {
        path: 'inputdatapos',
        name: 'inputdatapos',
        component: () => import('@/pages/developments/tables/inputDatapos.vue')
      },
      {
        path: 'inputdataposDA',
        name: 'inputdataposDA',
        component: () => import('@/pages/developments/tables/inputDataposDA.vue')
      },
      {
        path: 'formstatus/:id',
        component: () => import('@/pages/developments/Form/status.vue')
      },
      {
        path: 'formstatus',
        name: 'formstatus',
        component: () => import('@/pages/developments/Form/status.vue')
      },
      {
        path: 'formIzin/:id',
        component: () => import('@/pages/developments/Form/izin.vue')
      },
      {
        path: 'formIzin',
        name: 'formIzin',
        component: () => import('@/pages/developments/Form/izin.vue')
      }
      
    ]
  },
  
]
export default routes