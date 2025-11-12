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
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          }
        },
        title: {
          text: 'Percentage Completion by Requirement'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Scale (%)'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Completion: <b>{point.y:.1f} %</b>'
        },
        series: [
          {
            name: 'Completion',
            colorByPoint: true,
            data: [],
            dataLabels: {
              enabled: true
              // rotation: -90,
              // color: '#FFFFFF',
              // align: 'right',
              // format: '{point.y:.1f}', // one decimal
              // y: 10, // 10 pixels down from the top
              // style: {
              //   fontSize: '13px',
              //   fontFamily: 'Verdana, sans-serif',
              // },
            }
          }
        ],
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
      const fetchConsultingsResource = new Resource('reports/completion-report')
      fetchConsultingsResource.list(param).then((response) => {
        this.chart_report.series[0].data = response.data
        this.chart_report.subtitle.text = response.subtitle
        this.loading = false
      })
    }
  }
}
</script>
