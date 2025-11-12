import 'vue/jsx'
import '@/styles/index.less'
import vuetify from '@/plugins/vuetify'
import './permission.ts'
import '@/plugins/unocss'

import '@/plugins/svgIcon'

import { setupI18n } from '@/plugins/vueI18n'

import { setupStore } from '@/store'

import store from '@/VuexStore'

import { setupGlobCom } from '@/components'

import { setupElementPlus } from '@/plugins/elementPlus'

import '@/plugins/animate.css'

import { setupRouter } from './router'

import { setupPermission } from './directives'

import { registerLicense } from '@syncfusion/ej2-base'

import { createApp } from 'vue'

import App from './App.vue'

import { ClientTable } from 'v-tables-3'

import JsonExcel from 'vue-json-excel3'

import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import drilldown from 'highcharts/modules/drilldown'
import exporting from 'highcharts/modules/exporting'
// Optional: Import offline-exporting if needed
import OfflineExporting from 'highcharts/modules/offline-exporting'
import HighchartsGantt from 'highcharts/modules/gantt'
import highcharts3d from 'highcharts/highcharts-3d'
import highchartsMore from 'highcharts/highcharts-more'
import solidGauge from 'highcharts/modules/solid-gauge'
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  drilldown(Highcharts)
  highcharts3d(Highcharts)
  highchartsMore(Highcharts)
  solidGauge(Highcharts)
}
if (!Highcharts.Chart.prototype.exportChart) {
  exporting(Highcharts)
}
if (!Highcharts.Chart.prototype.exportChartLocal) {
  OfflineExporting(Highcharts)
}

if (!Highcharts.GanttChart.prototype.init) {
  HighchartsGantt(Highcharts)
}

registerLicense(import.meta.env.VITE_SYNC_FUSION_LICENSE)
// highcharts3d(Highcharts)

const setupAll = async () => {
  const app = createApp(App)
  app.use(vuetify)
  app.use(ClientTable)
  app.use(HighchartsVue, { highcharts: Highcharts })
  app.use(JsonExcel)
  app.component('downloadExcel', JsonExcel)
  await setupI18n(app)

  app.use(store)

  setupStore(app)
  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  app.mount('#app')
}

setupAll()
