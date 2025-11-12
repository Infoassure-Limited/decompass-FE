<template>
  <aside>
    <highcharts :options="chart_report" />
  </aside>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedProject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true
          }
        },
        title: {
          text: 'Level of Conformity for each part of the NDPA Requirement',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
          column: {
            // stacking: 'normal',
          }
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Scale'
          },
          stackLabels: {
            enabled: true
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      }
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      this.loading = true
      const param = {
        project_id: this.selectedProject.id,
        client_id: this.selectedProject.client_id
      }
      const fetchConsultingsResource = new Resource('reports/clause-report')
      fetchConsultingsResource.list(param).then((response) => {
        this.chart_report.series = response.series
        this.chart_report.xAxis.categories = response.categories
        this.chart_report.subtitle.text = response.subtitle
        this.loading = false
      })
    }
  }
}
</script>
