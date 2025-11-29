<template>
  <aside style="min-height: 200px">
    <highcharts v-if="showChart" :options="chart_report" />
  </aside>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    },
    selectedProject: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false
          }
        },
        title: {
          text: 'Compliance by Management Clause',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
          series: {
            // borderRadius: '1%',
          },
          column: {
            stacking: 'normal'
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
      },
      projectId: null,
      load: false,
      showChart: false
    }
  },
  watch: {
    selectedProject() {
      this.fetchReportSummary()
    }
  },
  mounted() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      this.load = true
      this.showChart = false
      const param = { project_id: this.selectedProject.id, client_id: this.selectedClient.id }
      const fetchConsultingsResource = new Resource('isms/reports/clause-report')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.chart_report.series = response.series
          this.chart_report.xAxis.categories = response.categories
          this.chart_report.subtitle.text = response.subtitle
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    }
  }
}
</script>
