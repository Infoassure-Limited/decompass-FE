<template>
  <aside style="min-height: 200px">
    <el-skeleton :loading="load" :rows="3" animated />
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
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0
          }
        },
        title: {
          text: 'Compliance Status',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%'
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            borderRadius: 8,
            // innerSize: 100, // what makes it donut
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %'
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: 'Value Count',
            colorByPoint: true,
            data: []
          }
        ],
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
      const fetchConsultingsResource = new Resource('isms/reports/summary-report')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          const { reports } = response
          this.chart_report.series = [
            {
              name: 'No. of Occurence',
              colorByPoint: true,
              data: [
                {
                  name: 'Compliant',
                  y: reports.conformity,
                  color: '#00a65a',
                  sliced: true,
                  selected: true
                },
                {
                  name: 'Non Compliant',
                  y: reports.non_conformity,
                  color: '#f00c12'
                },
                {
                  name: 'Open For Improvement',
                  y: reports.open_for_imporvement,
                  color: '#FFA500'
                },
                {
                  name: 'N/A',
                  y: reports.not_applicable,
                  color: '#cccccc'
                }
              ]
            }
          ]
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    }
  }
}
</script>
