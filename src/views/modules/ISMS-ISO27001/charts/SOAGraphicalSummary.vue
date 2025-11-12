<template>
  <aside>
    <highcharts v-loading="loading" :options="chart_report" />
  </aside>
</template>
<script>
export default {
  components: {},
  props: {
    summary: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false
          }
        },
        title: {
          text: 'SOA Summary',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
          // column: {
          //   stacking: 'normal',
          // },
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          // max: 100,
          title: {
            text: 'Scale'
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      }
    }
  },
  watch: {
    summary() {
      this.setData()
    }
  },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      this.chart_report.series = this.summary.series
      this.chart_report.xAxis.categories = this.summary.categories
      this.chart_report.subtitle.text = this.summary.subtitle
    }
  }
}
</script>
